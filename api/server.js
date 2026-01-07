import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const styles = "<style>:root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; } body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); color: #333; } .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; } .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; } .container { padding: 30px 8%; } .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; } .btn { background: var(--brand); color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; font-weight: bold; display: inline-block; width: 100%; text-align: center; } input, select, textarea { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }</style>";

// ANA SAYFA (Rezervasyon Formu)
app.get('/', (req, res) => {
    let html = "<html><head><title>Localsnapp | Book</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a></nav>";
    html += "<div class='container'><div class='card' style='max-width: 500px; margin: auto;'>";
    html += "<h2>Book Your Session</h2>";
    // Formun action kısmını 'dashboard' olarak bıraktık ama vercel.json ile yakalayacağız
    html += "<form action='/dashboard' method='GET'>";
    html += "<input type='text' name='city' placeholder='City (e.g. London)' required>";
    html += "<input type='date' name='date' required>";
    html += "<select name='package'><option value='139'>1 Hour - £139</option><option value='229'>2 Hours - £229</option></select>";
    html += "<button type='submit' class='btn'>Book a Session</button>";
    html += "</form></div></div></body></html>";
    res.send(html);
});

// MÜŞTERİ DASHBOARD (Hata aldığın yer burasıydı, artık açılacak)
app.get('/dashboard', (req, res) => {
    let html = "<html><head><title>My Dashboard</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a></nav>";
    html += "<div class='container'><h2>My Sessions</h2><div class='card'>";
    html += "<p><b>Status:</b> Payment Pending</p>";
    html += "<p>Your booking request for has been received!</p>";
    html += "<a href='/' class='btn' style='background:#444;'>Back to Home</a>";
    html += "</div></div></body></html>";
    res.send(html);
});

// Pro ve Admin sayfalarını da buraya ekleyebilirsin
app.get('/pro', (req, res) => { res.send("Pro Page Ready"); });
app.get('/admin', (req, res) => { res.send("Admin Page Ready"); });

export default app;