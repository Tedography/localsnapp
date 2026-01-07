import express from 'express';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './auth.js';
import bookingRoutes from './booking.js';

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);

const styles = `
    <style>
        :root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; }
        body { font-family: 'Inter', sans-serif; margin: 0; color: #333; background: var(--gray); }
        .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; }
        .container { padding: 30px 8%; }
        .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; }
        .btn { background: var(--brand); color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; border: none; cursor: pointer; font-weight: 600; display: inline-block; }
        .btn-upload { background: #3498db; }
        .status-badge { padding: 4px 10px; border-radius: 15px; font-size: 11px; background: #e1fef9; color: var(--brand); font-weight: bold; }
        .msg-box { background: #fff9e6; border-left: 4px solid #f1c40f; padding: 10px; margin: 10px 0; font-style: italic; }
        h2, h3 { margin-top: 0; }
        .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
    </style>
`;

// 1. ANA SAYFA (Müşteri Girişi)
app.get('/', (req, res) => {
    res.send(`<html><head>${styles}</head><body>
        <nav class="nav"><a href="/" class="logo">Localsnapp.</a> <a href="/pro" style="color:666; text-decoration:none;">Photographer Login</a></nav>
        <div class="container" style="text-align:center;">
            <h1>Capture Your Moments</h1>
            <a href="/dashboard" class="btn">Book a Photographer</a>
        </div>
    </body></html>`);
});

// 2. MÜŞTERİ DASHBOARD
app.get('/dashboard', (req, res) => {
    res.send(`<html><head>${styles}</head><body>
        <nav class="nav"><a href="/" class="logo">Localsnapp.</a></nav>
        <div class="container">
            <h2>My Bookings</h2>
            <div class="card">
                <div style="display:flex; justify-content:space-between;">
                    <span><b>Booking #1024</b> - London</span>
                    <span class="status-badge">Payment Done</span>
                </div>
                <hr style="border:0; border-top:1px solid #eee; margin:15px 0;">
                <button class="btn" style="background:#444;">Download Edits</button>
                <button class="btn" style="background:#ff4757; margin-left:10px;">Open Support Ticket</button>
            </div>
        </div>
    </body></html>`);
});

// 3. FOTOĞRAFÇI PANELİ (Senin istediğin detaylar)
app.get('/pro', (req, res) => {
    res.send(`<html><head>${styles}</head><body>
        <nav class="nav"><a href="/" class="logo">Localsnapp <small style="color:#666">PRO</small></a></nav>
        <div class="container">
            <h2>Photographer Dashboard</h2>
            <div class="grid">
                <div class="card">
                    <h3>Upcoming Shoots</h3>
                    <div style="border:1px solid #eee; padding:15px; border-radius:8px;">
                        <div style="display:flex; justify-content:space-between;">
                            <b>Client: Ahmet Yilmaz</b>
                            <span class="status-badge" style="background:#fff3cd; color:#856404;">Assigned</span>
                        </div>
                        <p>📍 Location: London, SE1</p>
                        <p>⏰ Time: 15 Jan, 14:00 (2 Hours)</p>
                        <div class="msg-box">"Müşteri Notu: Aile çekimi olacak, doğal ışık tercih ediyoruz."</div>
                        <button class="btn">Message Client</button>
                        <button class="btn" style="background:#eee; color:#333; margin-left:10px;">Job Details</button>
                    </div>
                </div>
                
                <div class="card">
                    <h3>Media Upload</h3>
                    <p style="font-size:13px; color:#666;">Upload RAW files here for Admin review.</p>
                    <div style="border:2px dashed #ccc; padding:20px; text-align:center; border-radius:8px;">
                        <input type="file" id="rawUpload" multiple style="display:none;">
                        <label for="rawUpload" class="btn btn-upload">Select RAW Files</label>
                    </div>
                    <hr style="border:0; border-top:1px solid #eee; margin:15px 0;">
                    <h3>Wallet</h3>
                    <p>Pending: <b>£120.00</b> (Payout in 12 days)</p>
                    <p>Available: <b>£0.00</b></p>
                </div>
            </div>
        </div>
    </body></html>`);
});

export default app;