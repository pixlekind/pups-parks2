require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(express.static('.'));
app.use('/assets', express.static('assets'));

// Data management
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
async function initializeData() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        try {
            await fs.access(DB_FILE);
        } catch {
            const initialData = {
                users: [
                    {
                        id: "walker1",
                        name: "Sarah Johnson",
                        email: "sarah@pupswalks.com",
                        role: "walker",
                        avatar: "/assets/img/avatar-walker1.jpg",
                        subscriptionStatus: "active",
                        stripeCustomerId: "cus_test123",
                        subscriptionId: "sub_test123",
                        badges: ["Top Walker", "5-Star Rated"],
                        rating: 4.9,
                        walksCompleted: 127,
                        joinedDate: "2023-01-15",
                        bio: "Professional dog walker with 5+ years experience. Specialized in puppy training and senior dog care.",
                        location: "London, UK",
                        phone: "+44 7123 456789"
                    },
                    {
                        id: "client1",
                        name: "Mike Chen",
                        email: "mike@email.com",
                        role: "client",
                        avatar: "/assets/img/avatar-client1.jpg",
                        subscriptionStatus: "free",
                        joinedDate: "2023-06-20"
                    }
                ],
                posts: [
                    {
                        id: "post1",
                        authorId: "walker1",
                        authorName: "Sarah Johnson",
                        authorAvatar: "/assets/img/avatar-walker1.jpg",
                        content: "Beautiful morning walk with Max and Bella in Hyde Park! 🐕🌳 They love exploring the autumn leaves.",
                        image: "/assets/img/walk1.jpg",
                        timestamp: "2024-01-15T08:30:00Z",
                        likes: 12,
                        comments: 3,
                        featured: true
                    },
                    {
                        id: "post2",
                        authorId: "walker1",
                        authorName: "Sarah Johnson",
                        authorAvatar: "/assets/img/avatar-walker1.jpg",
                        content: "Just completed a puppy training session! 🎾 Little Coco is getting so good at fetch!",
                        image: "/assets/img/walk2.jpg",
                        timestamp: "2024-01-14T16:45:00Z",
                        likes: 8,
                        comments: 1,
                        featured: false
                    }
                ],
                analytics: {
                    walker1: {
                        totalWalks: 127,
                        totalLikes: 342,
                        newClients: 15,
                        weeklyWalks: [12, 15, 18, 14, 16, 20, 22],
                        monthlyRevenue: [850, 920, 1100, 1250],
                        engagement: {
                            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                            data: [65, 78, 90, 81, 95, 110]
                        }
                    }
                }
            };
            await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// Read data helper
async function readData() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { users: [], posts: [], analytics: {} };
    }
}

async function writeData(data) {
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing database:', error);
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
app.get('/api/posts', async (req, res) => {
    const data = await readData();
    const sortedPosts = data.posts.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    res.json(sortedPosts);
});

app.post('/api/posts', async (req, res) => {
    const data = await readData();
    const newPost = {
        id: uuidv4(),
        authorId: req.body.authorId,
        authorName: req.body.authorName,
        authorAvatar: req.body.authorAvatar,
        content: req.body.content,
        image: req.body.image || null,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        featured: false
    };
    
    data.posts.push(newPost);
    await writeData(data);
    
    res.json(newPost);
});

app.post('/api/posts/:id/like', async (req, res) => {
    const data = await readData();
    const post = data.posts.find(p => p.id === req.params.id);
    
    if (post) {
        post.likes += 1;
        await writeData(data);
        res.json({ success: true, likes: post.likes });
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

app.get('/api/users', async (req, res) => {
    const data = await readData();
    res.json(data.users);
});

app.get('/api/analytics/:walkerId', async (req, res) => {
    const data = await readData();
    const analytics = data.analytics[req.params.walkerId];
    
    if (analytics) {
        res.json(analytics);
    } else {
        res.status(404).json({ error: 'Analytics not found' });
    }
});

// Enhanced Stripe checkout
app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: 'Pups & Parks™ Walker Subscription',
                        description: 'Monthly subscription for dog walkers - Includes premium dashboard, analytics, and priority support',
                        images: ['https://pups-parks.com/assets/img/subscription-banner.jpg'],
                    },
                    unit_amount: 2500, // £25.00
                    recurring: {
                        interval: 'month',
                    },
                },
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${req.headers.origin}/walker-dashboard.html?session_id={CHECKOUT_SESSION_ID}&success=true`,
            cancel_url: `${req.headers.origin}/pricing.html?canceled=true`,
            metadata: {
                userId: req.body.userId || 'anonymous',
                userEmail: req.body.userEmail || ''
            }
        });
        
        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Stripe webhook
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
        if (webhookSecret) {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
            event = req.body;
        }
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('✅ Payment succeeded:', session.id);
            
            // Update user subscription status in database
            const data = await readData();
            const user = data.users.find(u => u.id === session.metadata.userId);
            if (user) {
                user.subscriptionStatus = 'active';
                user.stripeCustomerId = session.customer;
                user.subscriptionId = session.subscription;
                await writeData(data);
                console.log(`✅ User ${user.name} subscription activated`);
            }
            break;
            
        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            console.log('❌ Subscription cancelled:', subscription.id);
            
            // Update user subscription status
            const data2 = await readData();
            const user2 = data2.users.find(u => u.subscriptionId === subscription.id);
            if (user2) {
                user2.subscriptionStatus = 'cancelled';
                await writeData(data2);
                console.log(`❌ User ${user2.name} subscription cancelled`);
            }
            break;
            
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
});

// Start server
initializeData().then(() => {
    app.listen(PORT, () => {
        console.log(`🐕 Pups & Parks™ server running on port ${PORT}`);
        console.log(`📍 Local: http://localhost:${PORT}`);
        console.log(`💳 Stripe: Using your test keys - ready for £25/month subscriptions!`);
    });
});
