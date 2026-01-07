import express from 'express';
import paymentRoutes from './payment.js';
import storageRoutes from './storage.js';
import adminRoutes from './admin.js';

const app = express();
app.use(express.json());

// API Rotaları
app.use('/api/payment', paymentRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/admin', adminRoutes);

const styles = "<style>:root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; } body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); } .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; } .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; } .container { padding: 30px 8%; } .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; max-width:400px; margin:auto; } .btn { background: var(--brand); color: white; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; text-decoration: none; display: inline-block; text-align: center; } .wallet-card { background: var(--dark); color: white; padding: 25px; border-radius: 12px; } input, select { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }</style>";

// ANA SAYFA
app.get('/', (req, res) => {
    let html = "<html><head><title>Localsnapp</title>" + styles;
    html += "<script src='https://www.paypal.com/sdk/js?client-id=AY2qXxdM1VHcYkh3G7Zosf0IbTn7VqMV2yn_w-imA3cYMNyavvnMl2vxPE0Ro2H2iaDkOnZl89u5LHwc&currency=GBP'></script></head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a> <div><a href='/pro' style='margin-right:15px; color:#666;'>Pro Portal</a> <a href='/admin' style='color:#666;'>Admin</a></div></nav>";
    html += "<div class='container'><div class='card'><h2>Book Now</h2><input type='text' id='city' placeholder='Enter City'><select id='pkg'><option value='139'>1 Hour - £139</option><option value='229'>2 Hours - £229</option></select><div id='paypal-button-container' style='margin-top:20px;'></div></div></div>";
    html += "<script>paypal.Buttons({ createOrder: async function() { const res = await fetch('/api/payment/create-paypal-order', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ amount: document.getElementById('pkg').value }) }); const order = await res.json(); return order.id; }, onApprove: function(data, actions) { return actions.order.capture().then(() => { window.location.href='/dashboard'; }); } }).render('#paypal-button-container');</script></body></html>";
    res.send(html);
});

// PRO PORTAL
app.get('/pro', (req, res) => {
    let html = "<html><head><title>Pro Portal</title>" + styles + "</head><body><nav class='nav'><a href='/' class='logo'>Localsnapp PRO</a></nav>";
    html += "<div class='container'><div style='display:grid; grid-template-columns:1.5fr 1fr; gap:20px;'><div><div class='card'><h3>Upload RAWs</h3><input type='file' multiple><button class='btn' style='margin-top:10px;'>Upload</button></div></div>";
    html += "<div><div class='wallet-card'><h3>My Wallet</h3><p>Pending: £120.00</p></div></div></div></div></body></html>";
    res.send(html);
});

// ADMIN PANELİ
app.get('/admin', (req, res) => {
    let html = "<html><head><title>Admin Panel</title>" + styles + "</head><body><nav class='nav'><a href='/' class='logo'>Localsnapp ADMIN</a></nav>";
    html += "<div class='container'><div class='card'><h3>Review Job #1024</h3><button class='btn'>Release Payment</button></div></div></body></html>";
    res.send(html);
});

// DASHBOARD
app.get('/dashboard', (req, res) => {
    res.send("<html><head>" + styles + "</head><body><div class='container'><h2>Payment Successful!</h2><a href='/' class='btn'>Home</a></div></body></html>");
});

export default app;