const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// PayPal Ortamı Kurulumu
function environment() {
    let clientId = "AY2qXxdM1VHcYkh3G7Zosf0IbTn7VqMV2yn_w-imA3cYMNyavvnMl2vxPE0Ro2H2iaDkOnZl89u5LHwc";
    let clientSecret = "EIN6GYMh0hxMZqKYtV5dZHiZjHwck4Rj49svBWaAIJol-fG9Pkmf8XrX3nYLZf6xo2u1HBEKhrzvShrl";
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

// Sipariş Oluşturma
async function createOrder(req, res) {
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: req.body.amount || '100.00' // Dinamik tutar
            }
        }]
    });

    try {
        const order = await client().execute(request);
        res.status(201).json({ id: order.result.id });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Ödeme Onaylama ve Supabase Güncelleme
async function captureOrder(req, res, supabase) {
    const { orderID, bookingData } = req.body;
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    
    try {
        const capture = await client().execute(request);
        
        // Ödeme başarılıysa Supabase'e kaydet
        const { data, error } = await supabase
            .from('bookings')
            .insert([{ 
                ...bookingData, 
                status: 'paid', 
                paypal_order_id: orderID,
                payment_status: 'escrow' 
            }]);

        res.status(200).json(capture.result);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = { createOrder, captureOrder };