import express from 'express';
import paymentRoutes from './payment.js';
import storageRoutes from './storage.js';
import adminRoutes from './admin.js';

const app = express();
app.use(express.json());

// ROTALARI BAĞLA
app.use('/api/payment', paymentRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/admin', adminRoutes);

const styles = "<style>:root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; } body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); } .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; } .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; } .container { padding: 30px 8%; } .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; } .btn-paypal { background: #ffc439; color: #111; padding: 14px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; width: 100%; font-size: 16px; margin-top: 10px; } .btn { background: var(--brand); color: white; padding: 12px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; text-decoration: none; display: inline-block; text-align: center; } .wallet-card { background: var(--dark); color: white; padding: 25px; border-radius: 12px; } input, select { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }</style>";

// 1. ANA SAYFA
app.get('/', (req, res) => {
    let html = "<html><head><title>Localsnapp</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a> <div><a href='/pro' style='margin-right:15px;'>Pro</a><a href='/admin'>Admin</a></div></nav>";
    html += "<div class='container'><div class='card' style='max-width:400px; margin:auto;'>";
    html += "<h2>Book a Session</h2><label>City</label><input type='text' id='city' placeholder='London'>";
    html += "<label>Package</label><select id='amount'><option value='139'>1 Hour - £139</option><option value='229'>2 Hours - £229</option></select>";
    html += "<button onclick='startPayPal()' class='btn-paypal' id='pBtn'>Pay with PayPal</button>";
    html += "</div></div><script>";
    html += "async function startPayPal() { const b=document.getElementById('pBtn'); b.innerText='Connecting...'; const city=document.getElementById('city').value;";
    html += "const res=await fetch('/api/payment/create-paypal-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:document.getElementById('amount').value})});";
    html += "const order=await res.json(); if(order.links){ window.location.href=order.links.find(l=>l.rel==='approve').href; }else{alert('PayPal Error'); b.innerText='Pay with PayPal';} }";
    html += "</script></body></html>";
    res.send(html);
});

// 2. PRO PORTAL
app.get('/pro', (req, res) => {
    let html = "<html><head><title>Pro</title>" + styles + "</head><body><nav class='nav'><a href='/' class='logo'>Localsnapp PRO</a></nav><div class='container'>";
    html += "<div style='display:grid; grid-template-columns:1.5fr 1fr; gap:20px;'><div><div class='card'><h3>Upload RAWs</h3><input type='file' multiple><button class='btn' style='margin-top:10px;'>Upload</button></div></div>";
    html += "<div><div class='wallet-card'><h3>Wallet</h3><p>Pending: £120.00</p></div></div></div></div></body></html>";
    res.send(html);
});

// 3. ADMIN PANELİ
app.get('/admin', (req, res) => {
    let html = "<html><head><title>Admin</title>" + styles + "</head><body><nav class='nav'><a href='/' class='logo'>Localsnapp ADMIN</a></nav>";
    html += "<div class='container'><div class='card'><h3>Job #1024</h3><p>Status: Paid</p><button class='btn'>Release Payment</button></div></div></body></html>";
    res.send(html);
});

// 4. DASHBOARD (ÖDEME SONRASI)
app.get('/dashboard', (req, res) => {
    res.send("<html><head>" + styles + "</head><body><div class='container'><h2>Payment Successful!</h2><a href='/' class='btn'>Back Home</a></div></body></html>");
});

export default app;