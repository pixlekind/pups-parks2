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
const SUPPORT_FILE = path.join(DATA_DIR, 'support.json');

// Ensure data directory and files exist
async function initializeData() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Initialize db.json
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
                        joinedDate: "2023-01-15"
                    },
                    {
                        id: "client1",
                        name: "Mike Chen",
                        email: "mike@email.com",
                        role: "client",
                        avatar: "/assets/img/avatar-client1.jpg",
                        subscriptionStatus: "free"
                    }
                ],
                posts: [
                    {
                        id: "post1",
                        authorId: "walker1",
                        authorName": "Sarah Johnson",
                        authorAvatar": "/assets/img/avatar-walker1.jpg",
                        content": "Beautiful morning walk with Max and Bella in Hyde Park! 🐕🌳 They love exploring the autumn leaves.",
                        image": "/assets/img/walk1.jpg",
                        timestamp": "2024-01-15T08:30:00Z",
                        likes": 12,
                        comments": 3,
                        featured": true
                    }
                ],
                analytics: {
                    "walker1": {
                        "totalWalks": 127,
                        "totalLikes": 342,
                        "newClients": 15,
                        "weeklyWalks": [12, 15, 18, 14, 16, 20, 22],
                        "monthlyRevenue": [850, 920, 1100, 1250],
                        "engagement": {
                            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                            "data": [65, 78, 90, 81, 95, 110]
                        }
                    }
                }
            };
            await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
        }

        // Initialize support.json
        try {
            await fs.access(SUPPORT_FILE);
        } catch {
            const initialSupport = {
                messages: [
                    {
                        id: "msg1",
                        userId: "client1",
                        userName": "Mike Chen",
                        message": "How do I book a dog walker?",
                        timestamp": "2024-01-15T10:30:00Z",
                        response": "You can browse available walkers in the feed and message them directly!",
                        responded": true
                    }
                ]
            };
            await fs.writeFile(SUPPORT_FILE, JSON.stringify(initialSupport, null, 2));
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// Read data helpers
async function readData() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
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

async function readSupport() {
    try {
        const data = await fs.readFile(SUPPORT_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { messages: [] };
    }
}

async function writeSupport(data) {
    try {
        await fs.writeFile(SUPPORT_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing support data:', error);
    }
}

// API Routes

// Get feed posts
app.get('/api/posts', async (req, res) => {
    const data = await readData();
    const sortedPosts = data.posts.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    res.json(sortedPosts);
});

// Create new post
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

// Like post
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

// Get users
app.get('/api/users', async (req, res) => {
    const data = await readData();
    res.json(data.users);
});

// Get analytics for walker
app.get('/api/analytics/:walkerId', async (req, res) => {
    const data = await readData();
    const analytics = data.analytics[req.params.walkerId];
    
    if (analytics) {
        res.json(analytics);
    } else {
        res.status(404).json({ error: 'Analytics not found' });
    }
});

// Support chat endpoints
app.get('/api/support', async (req, res) => {
    const data = await readSupport();
    res.json(data.messages);
});

app.post('/api/support', async (req, res) => {
    const data = await readSupport();
    const newMessage = {
        id: uuidv4(),
        userId: req.body.userId,
        userName: req.body.userName,
        message: req.body.message,
        timestamp: new Date().toISOString(),
        response: null,
        responded: false
    };
    
    data.messages.push(newMessage);
    await writeSupport(data);
    
    // Auto-response simulation
    setTimeout(async () => {
        const updatedData = await readSupport();
        const message = updatedData.messages.find(m => m.id === newMessage.id);
        if (message && !message.responded) {
            message.response = "Thanks for your message! Our support team will get back to you soon. 🐕";
            message.responded = true;
            await writeSupport(updatedData);
        }
    }, 2000);
    
    res.json(newMessage);
});

// Stripe integration
app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: 'Pups & Parks™ Walker Subscription',
                        description: 'Monthly subscription for dog walkers',
                    },
                    unit_amount: 2500, // £25.00
                    recurring: {
                        interval: 'month',
                    },
                },
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${req.headers.origin}/walker-dashboard.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/pricing.html`,
            metadata: {
                userId: req.body.userId || 'anonymous'
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
            console.log('Payment succeeded:', session.id);
            
            // Update user subscription status in database
            const data = await readData();
            const user = data.users.find(u => u.id === session.metadata.userId);
            if (user) {
                user.subscriptionStatus = 'active';
                user.stripeCustomerId = session.customer;
                user.subscriptionId = session.subscription;
                await writeData(data);
            }
            break;
            
        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            console.log('Subscription cancelled:', subscription.id);
            
            // Update user subscription status
            const data2 = await readData();
            const user2 = data2.users.find(u => u.subscriptionId === subscription.id);
            if (user2) {
                user2.subscriptionStatus = 'cancelled';
                await writeData(data2);
            }
            break;
            
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
});

// Initialize data and start server
initializeData().then(() => {
    app.listen(PORT, () => {
        console.log(`🐕 Pups & Parks™ server running on port ${PORT}`);
        console.log(`📍 Local: http://localhost:${PORT}`);
    });
});
