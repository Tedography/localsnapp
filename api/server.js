import express from 'express';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './auth.js';
import bookingRoutes from './booking.js';
import storageRoutes from './storage.js';
import adminRoutes from './admin.js';
import payoutRoutes from './payout.js';
import paymentRoutes from './payment.js';

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// TÜM ROTLAR (Hiçbiri eksik değil)
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payout', payoutRoutes);
app.use('/api/payment', paymentRoutes);

const styles = "<style>:root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; } body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); color: #333; } .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; } .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; } .container { padding: 30px 8%; } .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; } .btn { background: var(--brand); color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; font-weight: bold; display: inline-block; width: 100%; text-align: center; } .btn-paypal { background: #ffc439; color: #111; padding: 14px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; width: 100%; margin-top: 15px; font-size: 16px; } .wallet-card { background: var(--dark); color: white; padding: 25px; border-radius: 12px; } .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #e1fef9; color: var(--brand); } .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 25px; } input, select { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; } .msg-box { background: #fff9e6; border-left: 4px solid #f1c40f; padding: 10px; margin: 10px 0; font-style: italic; font-size: 13px; }</style>";

// 1. ANA SAYFA (PayPal Entegreli)
app.get('/', (req, res) => {
    let html = "<html><head><title>Localsnapp | Book</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a> <div><a href='/pro' style='margin-right:15px; color:#666; text-decoration:none;'>Pro Portal</a><a href='/admin' style='color:#666; text-decoration:none;'>Admin</a></div></nav>";
    html += "<div class='container'><div class='card' style='max-width: 450px; margin: auto;'>";
    html += "<h2>Book Your Session</h2>";
    html += "<label>City</label><input type='text' id='city' placeholder='e.g. London'>";
    html += "<label>Package</label><select id='amount'><option value='139'>1 Hour - £139</option><option value='229'>2 Hours - £229</option></select>";
    html += "<button onclick='pay()' class='btn-paypal' id='payBtn'>Pay with PayPal</button>";
    html += "</div></div><script>";
    html += "async function pay(){ const btn=document.getElementById('payBtn'); const city=document.getElementById('city').value; if(!city){alert('Enter city');return;} btn.innerText='Connecting...';";
    html += "const res=await fetch('/api/payment/create-paypal-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:document.getElementById('amount').value})});";
    html += "const order=await res.json(); if(order.links){ window.location.href=order.links.find(l=>l.rel==='approve').href; }else{alert('Error'); btn.innerText='Pay with PayPal';}}";
    html += "</script></body></html>";
    res.send(html);
});

// 2. MÜŞTERİ DASHBOARD
app.get('/dashboard', (req, res) => {
    let html = "<html><head><title>Dashboard</title>" + styles + "</head><body><nav class='nav'><a href='/' class='logo'>Localsnapp.</a></nav>";
    html += "<div class='container'><h2>My Sessions</h2><div class='card'><h3>Booking #1024</h3><span class='status-badge'>Payment Received</span><p>We are matching you with a photographer.</p></div></div></body></html>";
    res.send(html);
});

// 3. PRO PORTAL (Cüzdan + RAW Yükleme)
app.get('/pro', (req, res) => {
    let html = "<html><head><title>Pro Portal</title>" + styles + "</head><body><nav class='nav'><a href='/' class='logo'>Localsnapp PRO</a></nav>";
    html += "<div class='container'><div class='grid'><div>";
    html += "<div class='card'><h3>Job: London</h3><div class='msg-box'>Portrait session.</div></div>";
    html += "<div class='card'><h3>Upload RAWs</h3><form action='/api/storage/upload-raw' method='POST' enctype='multipart/form-data'><input type='file' name='files' multiple><button type='submit' class='btn' style='margin-top:10px;'>Upload to Admin</button></form></div></div>";
    html += "<div><div class='wallet-card'><h3>Wallet</h3><p>Available: £0.00</p><p style='color:var(--brand)'>Pending: £120.00</p><button class='btn' style='background:white; color:black;'>Request Payout</button></div></div>";
    html += "</div></div></body></html>";
    res.send(html);
});

// 4. ADMIN PANELİ (Onay Mekanizması)
app.get('/admin', (req, res) => {
    let html = "<html><head><title>Admin Panel</title>" + styles + "</head><body><nav class='nav'><a href='/' class='logo'>Localsnapp ADMIN</a></nav>";
    html += "<div class='container'><h2>Pending Jobs</h2><div class='card'><h3>Job #1024</h3><p>Status: RAWs Uploaded</p><button class='btn'>Review & Release Payment</button></div></div></body></html>";
    res.send(html);
});

export default app;