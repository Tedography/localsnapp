import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// PayPal Anahtarların
const PAYPAL_CLIENT_ID = "AY2qXxdM1VHcYkh3G7Zosf0IbTn7VqMV2yn_w-imA3cYMNyavvnMl2vxPE0Ro2H2iaDkOnZl89u5LHwc";
const PAYPAL_CLIENT_SECRET = "EIN6GYMh0hxMZqKYtV5dZHiZjHwck4Rj49svBWaAIJol-fG9Pkmf8XrX3nYLZf6xo2u1HBEKhrzvShrl";

// PayPal Token Alıcı
async function getPayPalAccessToken() {
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
    const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: { Authorization: `Basic ${auth}` }
    });
    const data = await response.json();
    return data.access_token;
}

router.post('/create-paypal-order', async (req, res) => {
    const { amount } = req.body;
    try {
        const accessToken = await getPayPalAccessToken();
        const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{
                    amount: { currency_code: "GBP", value: amount }
                }],
                application_context: {
                    return_url: `${req.headers.origin}/dashboard`,
                    cancel_url: `${req.headers.origin}/`
                }
            })
        });
        const order = await response.json();
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;