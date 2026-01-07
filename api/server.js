import express from 'express';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './auth.js';
import bookingRoutes from './booking.js';
import storageRoutes from './storage.js';

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/storage', storageRoutes);

const styles = "<style>:root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; } body { font-family: 'Inter', sans-serif; margin: 0; color: #333; background: var(--gray); } .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; } .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; } .container { padding: 30px 8%; } .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; } .btn { background: var(--brand); color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; border: none; cursor: pointer; font-weight: 600; display: inline-block; } .btn-upload { background: #3498db; display: block; text-align: center; margin-top: 10px; width: 100%; } .status-badge { padding: 4px 10px; border-radius: 15px; font-size: 11px; background: #e1fef9; color: var(--brand); font-weight: bold; } .msg-box { background: #fff9e6; border-left: 4px solid #f1c40f; padding: 10px; margin: 10px 0; font-style: italic; font-size: 14px; } .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }</style>";

app.get('/', (req, res) => {
    let html = "<html><head>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a> <a href='/pro' style='color:#666; text-decoration:none;'>Photographer Login</a></nav>";
    html += "<div class='container' style='text-align:center; padding-top:100px;'><h1>Capture Your Moments</h1><p>Professional photography on demand.</p><a href='/dashboard' class='btn'>Book a Session</a></div>";
    html += "</body></html>";
    res.send(html);
});

app.get('/dashboard', (req, res) => {
    let html = "<html><head>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a></nav>";
    html += "<div class='container'><h2>My Sessions</h2><div class='card'>";
    html += "<div style='display:flex; justify-content:space-between;'><span><b>Booking #1024</b> - London</span><span class='status-badge'>Confirmed</span></div>";
    html += "<hr style='border:0; border-top:1px solid #eee; margin:15px 0;'><p>Status: Photos being edited.</p><button class='btn' style='background:#444;'>Download</button></div></div>";
    html += "</body></html>";
    res.send(html);
});

app.get('/pro', (req, res) => {
    let html = "<html><head>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp PRO</a></nav>";
    html += "<div class='container'><div class='grid'><div class='card'><h3>Jobs</h3><div style='border:1px solid #eee; padding:15px; border-radius:8px;'><b>Client: Ahmet Yilmaz</b><div class='msg-box'>Portrait session.</div></div></div>";
    html += "<div class='card'><h3>Upload RAWs</h3><form action='/api/storage/upload-raw' method='POST' enctype='multipart/form-data'><input type='file' name='files' multiple><button type='submit' class='btn btn-upload'>Upload</button></form></div></div></div>";
    html += "</body></html>";
    res.send(html);
});

export default app;