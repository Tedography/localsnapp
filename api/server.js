import express from 'express';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './auth.js';
import bookingRoutes from './booking.js';
import storageRoutes from './storage.js';
import adminRoutes from './admin.js';
import payoutRoutes from './payout.js';

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Tüm servis rotalarını bağla
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payout', payoutRoutes);

// Ortak Stil Dosyası
const styles = "<style>:root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; } body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); color: #333; } .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; } .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; } .container { padding: 30px 8%; } .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; } .btn { background: var(--brand); color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; font-weight: bold; display: inline-block; transition: 0.3s; } .btn:hover { opacity: 0.8; } .wallet-card { background: var(--dark); color: white; padding: 25px; border-radius: 12px; } .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #e1fef9; color: var(--brand); } input, select, textarea { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box; } .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 25px; }</style>";

// 1. ANA SAYFA: REZERVASYON FORMU (Müşterinin ilk geldiği yer)
app.get('/', (req, res) => {
    let html = "<html><head><title>Book a Photographer</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a> <a href='/pro' style='color:#666; text-decoration:none; font-size:14px;'>Photographer Portal</a></nav>";
    html += "<div class='container'><div class='card' style='max-width: 550px; margin: auto;'>";
    html += "<h2>Book Your Session</h2><p style='color:#666;'>Book a professional photographer in seconds.</p>";
    html += "<form action='/dashboard' method='GET'>";
    html += "<label>Where?</label><input type='text' name='city' placeholder='e.g. London' required>";
    html += "<label>When?</label><input type='date' name='date' required>";
    html += "<label>Package</label><select name='package'><option value='139'>1 Hour Shoot - £139</option><option value='229'>2 Hours Shoot - £229</option><option value='799'>Full Day - £799</option></select>";
    html += "<label>Notes</label><textarea name='notes' placeholder='Tell us about your requirements...' rows='3'></textarea>";
    html += "<button type='submit' class='btn' style='width:100%; margin-top:10px;'>Proceed to Booking</button>";
    html += "</form></div></div></body></html>";
    res.send(html);
});

// 2. MÜŞTERİ DASHBOARD (Rezervasyon sonrası ekranı)
app.get('/dashboard', (req, res) => {
    let html = "<html><head><title>My Sessions</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a></nav>";
    html += "<div class='container'><h2>My Sessions</h2>";
    html += "<div class='card'><div style='display:flex; justify-content:space-between; align-items:center;'>";
    html += "<div><h3 style='margin:0;'>London Session</h3><p style='color:#666;'>12 Jan 2024 • 1 Hour</p></div>";
    html += "<span class='status-badge'>Confirmed</span></div><hr style='border:0; border-top:1px solid #eee; margin:20px 0;'>";
    html += "<div style='display:flex; gap:10px;'><button class='btn' style='background:#444;'>View Photos</button>";
    html += "<button class='btn' style='background:#ff4757;' onclick='alert(\"Support ticket opened!\")'>Get Help</button></div>";
    html += "</div></div></body></html>";
    res.send(html);
});

// 3. FOTOĞRAFÇI PANELİ (PRO)
app.get('/pro', (req, res) => {
    let html = "<html><head><title>Pro Portal</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp <small style='color:#666'>PRO</small></a></nav>";
    html += "<div class='container'><div class='grid'>";
    html += "<div><div class='card'><h3>New Opportunities</h3><p>No new jobs in your area right now.</p></div>";
    html += "<div class='card'><h3>Banka Bilgileri</h3><input type='text' placeholder='IBAN / Bank Details'><button class='btn' style='font-size:12px;'>Save Account</button></div></div>";
    html += "<div><div class='wallet-card'><h3>My Wallet</h3><p style='font-size:28px; margin:10px 0;'>Available: £0.00</p><p style='color:#00d1b2; font-size:14px;'>Pending: £120.00</p>";
    html += "<button class='btn' style='width:100%; background:white; color:black; margin-top:15px;'>Request Payout</button></div></div>";
    html += "</div></div></body></html>";
    res.send(html);
});

// 4. ADMIN PANELİ (KONTROL MERKEZİ)
app.get('/admin', (req, res) => {
    let html = "<html><head><title>Admin Control</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp ADMIN</a></nav>";
    html += "<div class='container'><h2>System Overview</h2><div class='grid'>";
    html += "<div class='card'><h3>Recent Bookings</h3><p>London - £139 (Pending Approval)</p><button class='btn'>Review & Release Payment</button></div>";
    html += "<div class='card'><h3>Photographers</h3><p>Total Active: 12</p></div>";
    html += "</div></div></body></html>";
    res.send(html);
});

export default app;