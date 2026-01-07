import express from 'express';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './auth.js'; // Bunu ekledik

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Rotaları sisteme tanıtıyoruz
app.use('/api/auth', authRoutes);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// --- TASARIM (HTML/CSS) ---
const styles = `
    <style>
        :root { --brand: #00d1b2; --dark: #1a1a1a; }
        body { font-family: 'Inter', sans-serif; margin: 0; color: #333; background: #f4f7f6; }
        .nav { background: white; padding: 20px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; }
        .container { padding: 40px 8%; }
        .card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .btn { background: var(--brand); color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; font-weight: bold; }
        .ticket-btn { background: #ff4757; margin-top: 10px; font-size: 14px; }
        .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; background: #e1fef9; color: var(--brand); }
    </style>
`;

// --- ROTALAR ---

// 1. ANA SAYFA (Rezervasyon Formu)
app.get('/', (req, res) => {
    res.send(`
        ${styles}
        <nav class="nav"><b>Localsnapp.</b></nav>
        <div class="container">
            <div class="card" style="max-width: 500px; margin: auto;">
                <h2>Book a Photographer</h2>
                <input type="text" placeholder="Which City?" style="width:100%; padding:10px; margin-bottom:15px; border-radius:5px; border:1px solid #ddd;">
                <input type="date" style="width:100%; padding:10px; margin-bottom:15px; border-radius:5px; border:1px solid #ddd;">
                <select style="width:100%; padding:10px; margin-bottom:15px; border-radius:5px; border:1px solid #ddd;">
                    <option>1 Hour - £139</option>
                    <option>2 Hours - £229</option>
                </select>
                <textarea placeholder="Any notes for the photographer?" style="width:100%; padding:10px; margin-bottom:15px; border-radius:5px; border:1px solid #ddd;"></textarea>
                <button class="btn" style="width:100%">Proceed to Payment</button>
            </div>
        </div>
    `);
});

// 2. MÜŞTERİ DASHBOARD (Senin istediğin detaylar)
app.get('/dashboard', (req, res) => {
    // Burada normalde giriş yapan müşterinin verileri Supabase'den çekilecek
    res.send(`
        ${styles}
        <nav class="nav"><b>Localsnapp.</b> <a href="/">Logout</a></nav>
        <div class="container">
            <h1>Welcome, Customer!</h1>
            <div class="card">
                <h3>Your Booking Details</h3>
                <p><b>Status:</b> <span class="status-badge">Confirmed</span></p>
                <p><b>Photographer:</b> John Doe</p>
                <p><b>Date & Time:</b> 12 Jan 2024, 14:00</p>
                <p><b>Location:</b> London, Hyde Park</p>
                <hr>
                <h4>Files</h4>
                <p>Photos are being edited. You will be notified when they are ready.</p>
                <button class="btn ticket-btn" onclick="alert('Ticket window opened! Writing to admin...')">Need Help? (Open Ticket)</button>
            </div>
        </div>
    `);
});

export default app;