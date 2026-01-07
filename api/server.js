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

app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payout', payoutRoutes);
app.use('/api/payment', paymentRoutes);

const styles = "<style>:root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; } body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); color: #333; } .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; } .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; } .container { padding: 30px 8%; } .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; } .btn-paypal { background: #ffc439; color: #111; padding: 14px 20px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; font-weight: bold; display: block; width: 100%; text-align: center; font-size: 16px; margin-top: 15px; } .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #e1fef9; color: var(--brand); } input, select { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }</style>";

app.get('/', (req, res) => {
    let html = "<html><head><title>Localsnapp | Book</title>" + styles + "</head><body>";
    html += "<nav class='nav'><a href='/' class='logo'>Localsnapp.</a> <a href='/pro' style='color:#666; text-decoration:none;'>Pro Portal</a></nav>";
    html += "<div class='container'><div class='card' style='max-width: 450px; margin: auto;'>";
    html += "<h2>Start Your Booking</h2>";
    html += "<label>City</label><input type='text' id='city' placeholder='e.g. London'>";
    html += "<label>Select Package</label><select id='amount'><option value='139'>1 Hour - £139</option><option value='229'>2 Hours - £229</option></select>";
    html += "<button onclick='payWithPayPal()' class='btn-paypal' id='payBtn'>Pay with PayPal</button>";
    html += "</div></div>";
    
    html += "<script>";
    html += "async function payWithPayPal() {";
    html += "  const btn = document.getElementById('payBtn');";
    html += "  const city = document.getElementById('city').value;";
    html += "  if(!city) { alert('Please enter a city'); return; }";
    html += "  btn.innerText = 'Connecting to PayPal...';";
    html += "  try {";
    html += "    const response = await fetch('/api/payment/create-paypal-order', {";
    html += "      method: 'POST',";
    html += "      headers: {'Content-Type': 'application/json'},";
    html += "      body: JSON.stringify({ amount: document.getElementById('amount').value })";
    html += "    });";
    html += "    const order = await response.json();";
    html += "    if (order.links) {";
    html += "      window.location.href = order.links.find(l => l.rel === 'approve').href;";
    html += "    } else { alert('PayPal error. Please try again.'); btn.innerText = 'Pay with PayPal'; }";
    html += "  } catch (err) { alert('Connection error'); btn.innerText = 'Pay with PayPal'; }";
    html += "}";
    html += "</script></body></html>";
    res.send(html);
});

// Diğer sayfalar (bozulmasın diye aynen bırakıldı)
app.get('/dashboard', (req, res) => { res.send("<html><head>" + styles + "</head><body><div class='container'><h2>Success!</h2><p>Payment received.</p></div></body></html>"); });
app.get('/pro', (req, res) => { res.send("<html><head>" + styles + "</head><body><div class='container'><h2>Pro Dashboard</h2></div></body></html>"); });
app.get('/admin', (req, res) => { res.send("<html><head>" + styles + "</head><body><div class='container'><h2>Admin</h2></div></body></html>"); });

export default app;