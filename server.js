require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(express.static('.'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/posts', async (req, res) => {
    res.json([{
        id: "1",
        authorName: "Sarah Johnson",
        content: "Beautiful morning walk with Max and Bella! 🐕",
        likes: 12,
        timestamp: new Date().toISOString()
    }]);
});

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
                    unit_amount: 2500,
                    recurring: {
                        interval: 'month',
                    },
                },
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${req.headers.origin}/walker-dashboard.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/pricing.html`,
        });
        
        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🐕 Pups & Parks™ server running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
});
