import express from 'express';
import paymentRoutes from './payment.js';
import storageRoutes from './storage.js';

const app = express();
app.use(express.json());

// API Rotaları
app.use('/api/payment', paymentRoutes);
app.use('/api/storage', storageRoutes);

// Global Tasarım Sistemi (CSS)
const styles = `<style>
    :root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; --text: #333; }
    body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background: var(--gray); color: var(--text); line-height: 1.6; }
    .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; position: sticky; top: 0; z-index: 100; }
    .logo { font-size: 24px; font-weight: 800; color: var(--brand); text-decoration: none; letter-spacing: -1px; }
    .container { padding: 40px 8%; max-width: 1200px; margin: auto; }
    .card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.05); margin-bottom: 25px; border: 1px solid rgba(0,0,0,0.03); }
    .btn { background: var(--brand); color: white; padding: 12px 24px; border-radius: 10px; border: none; cursor: pointer; font-weight: 700; text-decoration: none; display: inline-block; transition: all 0.2s; }
    .btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-outline { background: transparent; border: 2px solid var(--brand); color: var(--brand); }
    .wallet-card { background: var(--dark); color: white; padding: 30px; border-radius: 20px; position: relative; overflow: hidden; }
    .status-badge { padding: 6px 14px; border-radius: 30px; font-size: 12px; font-weight: 700; background: #e1fef9; color: var(--brand); text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 30px; }
    input, select { width: 100%; padding: 14px; margin: 10px 0 20px 0; border: 1.5px solid #eee; border-radius: 10px; font-size: 16px; }
    .nav-links a { margin-left: 20px; text-decoration: none; color: #666; font-weight: 600; font-size: 14px; }
    .msg-box { background: #fff9e6; border-left: 5px solid #f1c40f; padding: 15px; border-radius: 8px; font-size: 14px; margin: 15px 0; }
    @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
</style>`;

// 1. ANA SAYFA
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>Localsnapp</title>${styles}
    <script src="https://www.paypal.com/sdk/js?client-id=AY2qXxdM1VHcYkh3G7Zosf0IbTn7VqMV2yn_w-imA3cYMNyavvnMl2vxPE0Ro2H2iaDkOnZl89u5LHwc&currency=GBP"></script>
    </head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp.</a><div class="nav-links"><a href="/pro">Pro Portal</a><a href="/admin">Admin</a></div></nav>
    <div class="container" style="max-width: 500px; text-align: center;">
        <h1>Professional photography, made simple.</h1>
        <div class="card" style="text-align: left;">
            <label>City</label><input type="text" id="city" placeholder="London">
            <label>Package</label>
            <select id="pkg"><option value="139">1 Hour - £139</option><option value="229">2 Hours - £229</option></select>
            <div id="paypal-button-container"></div>
        </div>
    </div>
    <script>
        const checkPayPal = setInterval(() => {
            if (window.paypal) {
                renderButton();
                clearInterval(checkPayPal);
            }
        }, 500);

        function renderButton() {
            paypal.Buttons({
                createOrder: async function() {
                    const city = document.getElementById('city').value;
                    if(!city) { alert('Enter city'); return; }
                    const res = await fetch('/api/payment/create-paypal-order', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ amount: document.getElementById('pkg').value })
                    });
                    const order = await res.json();
                    return order.id;
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(() => { window.location.href='/dashboard'; });
                }
            }).render('#paypal-button-container');
        }
    </script></body></html>`);
});

// 2. MÜŞTERİ DASHBOARD
app.get('/dashboard', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>Dashboard</title>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp.</a></nav>
    <div class="container"><div class="card"><h2>Payment Successful!</h2><p>Booking #LS-99284 confirmed.</p><a href="/" class="btn">Back Home</a></div></div></body></html>`);
});

// 3. PRO PORTAL
app.get('/pro', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>Pro Portal</title>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp PRO.</a></nav>
    <div class="container"><div class="grid">
        <div><div class="card"><h3>Active Job</h3><div class="msg-box"><b>Client Note:</b> Portrait session in London.</div>
        <form action="/api/storage/upload-raw" method="POST" enctype="multipart/form-data">
        <input type="file" name="files" multiple><button type="submit" class="btn" style="width:100%; margin-top:10px;">Upload RAWs</button></form></div></div>
        <div><div class="wallet-card"><h3>Wallet</h3><h1>£120.00</h1><button class="btn" style="background:white; color:var(--dark); width:100%;">Withdraw</button></div></div>
    </div></div></body></html>`);
});

// 4. ADMIN PANELİ
app.get('/admin', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>Admin Panel</title>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp ADMIN.</a></nav>
    <div class="container"><h2>Admin Overview</h2><div class="card"><h3>Job #LS-99284</h3><button class="btn">Approve & Pay Pro</button></div></div></body></html>`);
});

export default app;