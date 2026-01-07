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

// Rotaların Bağlanması (Hiçbiri bozulmadı)
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payout', payoutRoutes);
app.use('/api/payment', paymentRoutes);

const styles = "<style>:root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; } body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); color: #333; } .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; } .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; } .container { padding: 30px 8%; } .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; } .btn { background: var(--brand); color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; font-weight: bold; display: inline-block; width: 100%; text-align: center; transition: 0.3s; } .wallet-card { background: var(--dark); color: white; padding: 25px; border-radius: 12px; } .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #e1fef9; color: var(--brand); } input, select, textarea { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; } .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 25px; } .msg-box { background: #fff9e6; border-left: 4px solid #f1c40f; padding: 10px; margin: 10px 0; font-style: italic; font-size: 14px; }</style>";

// 1. ANA SAYFA: REZERVASYON & PAYPAL
app.get('/', (req, res) => {
    let html = "<html><head><title>Localsnapp | Book</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a> <a href='/pro' style='color:#666; text-decoration:none; font-size:14px;'>Photographer Portal</a></nav>";
    html += "<div class='container'><div class='card' style='max-width: 500px; margin: auto;'>";
    html += "<h2>Book Your Session</h2>";
    html += "<label>City</label><input type='text' id='city' placeholder='e.g. London' required>";
    html += "<label>Date</label><input type='date' id='date' required>";
    html += "<label>Package</label><select id='amount'><option value='139'>1 Hour Shoot - £139</option><option value='229'>2 Hours Shoot - £229</option></select>";
    html += "<button onclick='payWithPayPal()' class='btn' id='payBtn'>Pay with PayPal</button>";
    html += "</div></div>";
    html += "<script>async function payWithPayPal() {";
    html += " const btn = document.getElementById('payBtn'); btn.innerText = 'Connecting...';";
    html += " const amount = document.getElementById('amount').value;";
    html += " const res = await fetch('/api/payment/create-paypal-order', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({amount}) });";
    html += " const order = await res.json();";
    html += " if (order.links) { window.location.href = order.links.find(l => l.rel === 'approve').href; } else { alert('Error'); btn.innerText = 'Pay with PayPal'; }";
    html += "}</script></body></html>";
    res.send(html);
});

// 2. MÜŞTERİ DASHBOARD
app.get('/dashboard', (req, res) => {
    let html = "<html><head><title>Dashboard</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a></nav>";
    html += "<div class='container'><h2>My Sessions</h2><div class='card'>";
    html += "<div style='display:flex; justify-content:space-between;'><span><b>Booking #1024</b></span><span class='status-badge'>Payment Received</span></div>";
    html += "<p>We are assigning a photographer. You will be notified via email.</p>";
    html += "</div></div></body></html>";
    res.send(html);
});

// 3. FOTOĞRAFÇI PANELİ (RAW Yükleme + Cüzdan + Mesaj)
app.get('/pro', (req, res) => {
    let html = "<html><head><title>Pro Portal</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp PRO</a></nav>";
    html += "<div class='container'><div class='grid'><div>";
    html += "<div class='card'><h3>Active Job</h3><b>Client: Ahmet Yilmaz</b><div class='msg-box'>Note: Family portrait in London.</div><button class='btn' style='font-size:12px; width:auto;'>Send Message</button></div>";
    html += "<div class='card'><h3>Upload RAW Files</h3><form action='/api/storage/upload-raw' method='POST' enctype='multipart/form-data'><input type='file' name='files' multiple><button type='submit' class='btn' style='background:#3498db; margin-top:10px;'>Upload to Admin</button></form></div></div>";
    html += "<div><div class='wallet-card'><h3>My Wallet</h3><p style='font-size:24px;'>Available: £0.00</p><p style='color:var(--brand);'>Pending: £120.00</p><hr><button class='btn' style='background:white; color:black;'>Request Payout</button></div>";
    html += "<div class='card' style='margin-top:20px;'><h4>Bank Details</h4><input type='text' placeholder='IBAN'><button class='btn' style='font-size:12px;'>Save</button></div></div>";
    html += "</div></div></body></html>";
    res.send(html);
});

// 4. ADMIN PANELİ
app.get('/admin', (req, res) => {
    let html = "<html><head><title>Admin Control</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp ADMIN</a></nav>";
    html += "<div class='container'><h2>Admin Overview</h2><div class='grid'>";
    html += "<div class='card'><h3>Pending Approval</h3><p>Job #1024 - RAWs Uploaded</p><button class='btn'>Review & Pay Photographer</button></div>";
    html += "<div class='card'><h3>Stats</h3><p>Total Revenue: £1,240</p></div>";
    html += "</div></div></body></html>";
    res.send(html);
});

export default app;