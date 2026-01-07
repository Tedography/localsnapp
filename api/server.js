import express from 'express';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './auth.js';
import bookingRoutes from './booking.js'; // Yeni ekledik

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Rotaları Tanımla
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes); // Rezervasyon sistemini bağladık

const styles = `
    <style>
        :root { --brand: #00d1b2; --dark: #1a1a1a; }
        body { font-family: 'Inter', sans-serif; margin: 0; color: #333; background: #f4f7f6; }
        .nav { background: white; padding: 20px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; }
        .container { padding: 40px 8%; }
        .card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 20px; }
        .btn { background: var(--brand); color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; font-weight: bold; display: inline-block; }
        .ticket-btn { background: #ff4757; margin-top: 15px; font-size: 14px; }
        .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; background: #e1fef9; color: var(--brand); font-weight: bold; }
        input, select, textarea { width:100%; padding:12px; margin-bottom:15px; border-radius:8px; border:1px solid #ddd; box-sizing: border-box; }
    </style>
`;

// ANA SAYFA
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>Localsnapp | Book</title>${styles}</head>
            <body>
                <nav class="nav"><a href="/" class="logo">Localsnapp.</a></nav>
                <div class="container">
                    <div class="card" style="max-width: 500px; margin: auto;">
                        <h2>New Booking</h2>
                        <form action="/dashboard" method="GET">
                            <input type="text" name="city" placeholder="City" required>
                            <input type="date" name="date" required>
                            <select name="package">
                                <option value="139">1 Hour - £139</option>
                                <option value="229">2 Hours - £229</option>
                            </select>
                            <textarea name="notes" placeholder="Notes..."></textarea>
                            <button type="submit" class="btn" style="width:100%">Book Now</button>
                        </form>
                    </div>
                </div>
            </body>
        </html>
    `);
});

// MÜŞTERİ DASHBOARD
app.get('/dashboard', (req, res) => {
    res.send(`
        <html>
            <head><title>Dashboard</title>${styles}</head>
            <body>
                <nav class="nav"><a href="/" class="logo">Localsnapp.</a></nav>
                <div class="container">
                    <h1>Your Sessions</h1>
                    <div class="card">
                        <p>Booking details will appear here after login integration.</p>
                        <button class="btn ticket-btn" onclick="alert('Ticket System!')">Open Ticket</button>
                    </div>
                </div>
            </body>
        </html>
    `);
});

export default app;