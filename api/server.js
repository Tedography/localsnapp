import express from 'express';
import paymentRoutes from './payment.js';
import storageRoutes from './storage.js';

const app = express();
app.use(express.json());

// API Rotaları
app.use('/api/payment', paymentRoutes);
app.use('/api/storage', storageRoutes);

// Global Tasarım Sistemi
const styles = `<style>
    :root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; --text: #333; }
    body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background: var(--gray); color: var(--text); line-height: 1.6; }
    .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; position: sticky; top: 0; z-index: 100; }
    .logo { font-size: 24px; font-weight: 800; color: var(--brand); text-decoration: none; letter-spacing: -1px; }
    .container { padding: 40px 8%; max-width: 1200px; margin: auto; }
    .card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.05); margin-bottom: 25px; border: 1px solid rgba(0,0,0,0.03); }
    .btn { background: var(--brand); color: white; padding: 12px 24px; border-radius: 10px; border: none; cursor: pointer; font-weight: 700; text-decoration: none; display: inline-block; transition: all 0.2s; }
    .btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-outline { background: transparent; border: 2px solid var(--brand); color: var(--brand); }
    .wallet-card { background: var(--dark); color: white; padding: 30px; border-radius: 20px; position: relative; overflow: hidden; }
    .wallet-card::after { content: ''; position: absolute; right: -20px; top: -20px; width: 100px; height: 100px; background: var(--brand); opacity: 0.1; border-radius: 50%; }
    .status-badge { padding: 6px 14px; border-radius: 30px; font-size: 12px; font-weight: 700; background: #e1fef9; color: var(--brand); text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 30px; }
    input, select, textarea { width: 100%; padding: 14px; margin: 10px 0 20px 0; border: 1.5px solid #eee; border-radius: 10px; font-size: 16px; transition: border-color 0.2s; }
    input:focus { border-color: var(--brand); outline: none; }
    h1, h2, h3 { margin-top: 0; font-weight: 800; color: var(--dark); }
    .nav-links a { margin-left: 20px; text-decoration: none; color: #666; font-weight: 600; font-size: 14px; }
    .msg-box { background: #fff9e6; border-left: 5px solid #f1c40f; padding: 15px; border-radius: 8px; font-size: 14px; margin: 15px 0; }
    @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } .container { padding: 20px 5%; } }
</style>`;

// 1. ANA SAYFA (BOOKING & PAYPAL)
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>Localsnapp | Book a Photographer</title>${styles}
    <script src="https://www.paypal.com/sdk/js?client-id=AY2qXxdM1VHcYkh3G7Zosf0IbTn7VqMV2yn_w-imA3cYMNyavvnMl2vxPE0Ro2H2iaDkOnZl89u5LHwc&currency=GBP"></script>
    </head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp.</a><div class="nav-links"><a href="/pro">For Photographers</a><a href="/admin">Admin</a></div></nav>
    <div class="container" style="max-width: 500px; text-align: center;">
        <h1>Professional photography, made simple.</h1>
        <p style="color:#777; margin-bottom:30px;">Book a world-class photographer in minutes.</p>
        <div class="card" style="text-align: left;">
            <label>Where is the shoot?</label>
            <input type="text" id="city" placeholder="e.g. London, United Kingdom">
            <label>Select Your Package</label>
            <select id="pkg">
                <option value="139">1 Hour Session - £139</option>
                <option value="229">2 Hours Session - £229</option>
            </select>
            <div id="paypal-button-container" style="margin-top:10px;"></div>
        </div>
    </div>
    <script>
        paypal.Buttons({
            createOrder: async function() {
                const city = document.getElementById('city').value;
                if(!city) { alert('Please enter a city'); return; }
                const res = await fetch('/api/payment/create-paypal-order', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ amount: document.getElementById('pkg').value })
                });
                const order = await res.json();
                return order.id;
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(() => { window.location.href = '/dashboard'; });
            }
        }).render('#paypal-button-container');
    </script></body></html>`);
});

// 2. MÜŞTERİ DASHBOARD (ÖDEME SONRASI)
app.get('/dashboard', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>Dashboard</title>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp.</a></nav>
    <div class="container">
        <div class="card" style="border-top: 5px solid var(--brand);">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:20px;">
                <div style="background:var(--brand); color:white; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">✓</div>
                <h2>Payment Successful!</h2>
            </div>
            <p>Your booking <b>#LS-99284</b> has been confirmed. We are currently matching you with a top-rated photographer in your city.</p>
            <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
            <h3>What's next?</h3>
            <ul style="padding-left:20px; color:#555;">
                <li>You'll receive an email with your photographer's details within 24 hours.</li>
                <li>Your photographer will contact you to coordinate the exact meeting point.</li>
            </ul>
            <a href="/" class="btn" style="margin-top:20px;">Back to Home</a>
        </div>
    </div></body></html>`);
});

// 3. FOTOĞRAFÇI (PRO) PORTAL
app.get('/pro', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>Pro Portal</title>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp PRO.</a></nav>
    <div class="container">
        <div class="grid">
            <div>
                <h2>Active Assignments</h2>
                <div class="card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <span class="status-badge">New Job</span>
                            <h3 style="margin-top:10px;">London Portrait Session</h3>
                            <p style="color:#666; font-size:14px;">Client: Ahmet Yilmaz | Package: 1 Hour</p>
                        </div>
                        <div style="text-align:right;">
                            <span style="font-weight:bold; color:var(--brand);">£120.00</span>
                        </div>
                    </div>
                    <div class="msg-box"><b>Client Note:</b> Please use natural light. We'll meet at Westminster Bridge.</div>
                    <div style="margin-top:20px;">
                        <h4>Deliver RAW Files</h4>
                        <form action="/api/storage/upload-raw" method="POST" enctype="multipart/form-data">
                            <input type="file" name="files" multiple style="font-size:12px;">
                            <button type="submit" class="btn" style="width:100%;">Upload Photos to Admin</button>
                        </form>
                    </div>
                </div>
            </div>
            <div>
                <h2>Earnings</h2>
                <div class="wallet-card">
                    <p style="margin:0; opacity:0.8; font-size:14px;">Total Pending Bakiye</p>
                    <h1 style="color:white; font-size:42px; margin:10px 0;">£120.00</h1>
                    <p style="font-size:12px; opacity:0.6;">Payouts are released 24h after admin approval.</p>
                    <button class="btn" style="background:white; color:var(--dark); width:100%; margin-top:15px;">Withdraw Funds</button>
                </div>
                <div class="card" style="margin-top:25px;">
                    <h3>Pro Support</h3>
                    <p style="font-size:14px; color:#666;">Need help with a shoot? Our team is available 24/7.</p>
                    <a href="#" class="btn btn-outline" style="width:100%; box-sizing:border-box;">Open Support Ticket</a>
                </div>
            </div>
        </div>
    </div></body></html>`);
});

// 4. ADMIN PANELİ
app.get('/admin', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>Admin Panel</title>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp ADMIN.</a></nav>
    <div class="container">
        <h2>System Overview</h2>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:20px; margin-bottom:30px;">
            <div class="card" style="padding:15px; text-align:center;"><b>Total Bookings</b><h2 style="margin:5px 0;">124</h2></div>
            <div class="card" style="padding:15px; text-align:center;"><b>Revenue</b><h2 style="margin:5px 0; color:var(--brand);">£14,200</h2></div>
            <div class="card" style="padding:15px; text-align:center;"><b>Pending RAWs</b><h2 style="margin:5px 0; color:#f1c40f;">3</h2></div>
        </div>
        <h3>Pending Approvals</h3>
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <b>Job #LS-99284</b> - London <br>
                    <small style="color:#888;">Photographer: John Doe | Uploaded: 24 Photos</small>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn btn-outline" style="padding:8px 15px; font-size:12px;">View RAWs</button>
                    <button class="btn" style="padding:8px 15px; font-size:12px;">Approve & Pay Pro</button>
                </div>
            </div>
        </div>
    </div></body></html>`);
});

export default app;