import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const styles = "<style>:root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; } body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); color: #333; } .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; } .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; } .container { padding: 30px 8%; } .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; } .btn { background: var(--brand); color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; font-weight: bold; display: inline-block; text-align: center; transition: 0.3s; } .btn:hover { opacity: 0.8; } .wallet-card { background: var(--dark); color: white; padding: 25px; border-radius: 12px; } .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #e1fef9; color: var(--brand); } input, select, textarea { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; } .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 25px; }</style>";

// 1. ANA SAYFA (REZERVASYON FORMU)
app.get('/', (req, res) => {
    let html = "<html><head><title>Localsnapp | Book</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a> <a href='/pro' style='color:#666; text-decoration:none; font-size:14px;'>Photographer Portal</a></nav>";
    html += "<div class='container'><div class='card' style='max-width: 500px; margin: auto;'>";
    html += "<h2>Book Your Session</h2>";
    html += "<form action='/dashboard' method='GET'>";
    html += "<label>City</label><input type='text' name='city' placeholder='e.g. London' required>";
    html += "<label>Date</label><input type='date' name='date' required>";
    html += "<label>Package</label><select name='package'><option value='139'>1 Hour - £139</option><option value='229'>2 Hours - £229</option></select>";
    html += "<button type='submit' class='btn' style='width:100%'>Book Now</button>";
    html += "</form></div></div></body></html>";
    res.send(html);
});

// 2. MÜŞTERİ DASHBOARD
app.get('/dashboard', (req, res) => {
    let html = "<html><head><title>My Sessions</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a></nav>";
    html += "<div class='container'><h2>My Sessions</h2><div class='card'>";
    html += "<div style='display:flex; justify-content:space-between;'><span><b>Booking #1024</b></span><span class='status-badge'>Confirmed</span></div>";
    html += "<p>Your professional shoot is scheduled. Check back for photos.</p>";
    html += "<a href='/' class='btn' style='background:#444;'>Back to Home</a></div></div></body></html>";
    res.send(html);
});

// 3. FOTOĞRAFÇI PANELİ (PRO)
app.get('/pro', (req, res) => {
    let html = "<html><head><title>Photographer Portal</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp PRO</a></nav>";
    html += "<div class='container'><div class='grid'><div>";
    html += "<div class='card'><h3>Active Jobs</h3><p>London - 15 Jan, 14:00</p><button class='btn' style='font-size:12px;'>Job Details</button></div>";
    html += "<div class='card'><h3>Upload RAW Files</h3><form action='/api/storage/upload-raw' method='POST' enctype='multipart/form-data'><input type='file' name='files' multiple><button type='submit' class='btn' style='background:#3498db; width:100%; margin-top:10px;'>Upload to Admin</button></form></div></div>";
    html += "<div><div class='wallet-card'><h3>My Wallet</h3><p>Available: £0.00</p><p style='color:var(--brand)'>Pending: £120.00</p><button class='btn' style='width:100%; background:white; color:black; margin-top:10px;'>Request Payout</button></div></div>";
    html += "</div></div></body></html>";
    res.send(html);
});

// 4. ADMIN PANELİ (KONTROL MERKEZİ)
app.get('/admin', (req, res) => {
    let html = "<html><head><title>Admin Control</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp ADMIN</a></nav>";
    html += "<div class='container'><h2>Admin Overview</h2><div class='grid'>";
    html += "<div class='card'><h3>Pending Approval</h3><p>Job #1024 - London</p><button class='btn'>Review & Pay Photographer</button></div>";
    html += "<div class='card'><h3>Platform Stats</h3><p>Active Photographers: 12</p><p>Completed Shoots: 45</p></div>";
    html += "</div></div></body></html>";
    res.send(html);
});

export default app;