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

app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payout', payoutRoutes);

const styles = "<style>:root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; } body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); color: #333; } .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; } .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; } .container { padding: 30px 8%; } .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; } .btn { background: var(--brand); color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; border: none; cursor: pointer; font-weight: bold; display: inline-block; } .wallet-card { background: var(--dark); color: white; padding: 20px; border-radius: 12px; } input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; }</style>";

app.get('/', (req, res) => {
    let html = "<html><head>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a> <a href='/pro'>Photographer</a></nav>";
    html += "<div class='container' style='text-align:center; padding-top:50px;'><h1>Professional Photography</h1><a href='/dashboard' class='btn'>Book Session</a></div>";
    html += "</body></html>";
    res.send(html);
});

app.get('/pro', (req, res) => {
    let html = "<html><head>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp PRO</a></nav>";
    html += "<div class='container'><div style='display:grid; grid-template-columns: 1.5fr 1fr; gap:20px;'>";
    html += "<div><div class='card'><h3>Payout Settings</h3><p>Enter your Bank Details (IBAN/Swift):</p><input type='text' placeholder='GB12 3456...'><button class='btn'>Save Details</button></div>";
    html += "<div class='card'><h3>Recent Jobs</h3><p>No active jobs.</p></div></div>";
    html += "<div><div class='wallet-card'><h3>My Wallet</h3><p style='font-size:24px;'>Available: £0.00</p><p style='color:#aaa'>Pending: £139.00</p><hr><button class='btn' style='width:100%; background:#444;'>Request Payout</button></div></div>";
    html += "</div></div></body></html>";
    res.send(html);
});

app.get('/admin', (req, res) => {
    let html = "<html><head>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp ADMIN</a></nav>";
    html += "<div class='container'><h1>Admin Panel</h1><div class='card'><h3>Withdrawal Requests</h3><p>No pending requests.</p></div></div></body></html>";
    res.send(html);
});

export default app;