import express from 'express';
import paymentRoutes from './payment.js';
import storageRoutes from './storage.js';

const app = express();
app.use(express.json());

// API Rotaları
app.use('/api/payment', paymentRoutes);
app.use('/api/storage', storageRoutes);

// Ortak Tasarım Sistemi (CSS)
const styles = `<style>
    :root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; }
    body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); color: #333; }
    .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; align-items: center; }
    .logo { font-size: 24px; font-weight: bold; color: var(--brand); text-decoration: none; }
    .container { padding: 30px 8%; }
    .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); margin-bottom: 20px; }
    .btn { background: var(--brand); color: white; padding: 12px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; text-decoration: none; display: inline-block; text-align: center; }
    .wallet-card { background: var(--dark); color: white; padding: 25px; border-radius: 12px; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #e1fef9; color: var(--brand); }
    input, select { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
    .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 25px; }
</style>`;

// 1. ANA SAYFA (RESERVASYON + PAYPAL SDK)
app.get('/', (req, res) => {
    let html = `<html><head><title>Localsnapp | Book</title>${styles}
    <script src="https://www.paypal.com/sdk/js?client-id=AY2qXxdM1VHcYkh3G7Zosf0IbTn7VqMV2yn_w-imA3cYMNyavvnMl2vxPE0Ro2H2iaDkOnZl89u5LHwc&currency=GBP"></script>
    </head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp.</a> <div><a href="/pro" style="margin-right:15px; text-decoration:none; color:#666;">Pro Portal</a><a href="/admin" style="text-decoration:none; color:#666;">Admin</a></div></nav>
    <div class="container"><div class="card" style="max-width:450px; margin:auto;">
        <h2>Book a Session</h2>
        <input type="text" id="city" placeholder="Which city?">
        <select id="pkg"><option value="139">1 Hour - £139</option><option value="229">2 Hours - £229</option></select>
        <div id="paypal-button-container" style="margin-top:20px;"></div>
    </div></div>
    <script>
        paypal.Buttons({
            createOrder: async function() {
                const city = document.getElementById('city').value;
                if(!city) { alert('Please enter a city'); return; }
                const res = await fetch('/api/payment/create-paypal-order', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ amount: document.getElementById('pkg').value, city: city })
                });
                const order = await res.json();
                return order.id;
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(() => { window.location.href = '/dashboard'; });
            }
        }).render('#paypal-button-container');
    </script></body></html>`;
    res.send(html);
});

// 2. MÜŞTERİ DASHBOARD
app.get('/dashboard', (req, res) => {
    let html = `<html><head><title>My Dashboard</title>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp.</a></nav>
    <div class="container"><h2>My Sessions</h2><div class="card">
        <div style="display:flex; justify-content:space-between;"><b>London Session</b><span class="status-badge">Paid</span></div>
        <p>Photographer is being assigned. You will receive an email shortly.</p>
    </div></div></body></html>`;
    res.send(html);
});

// 3. FOTOĞRAFÇI PANELİ (PRO)
app.get('/pro', (req, res) => {
    let html = `<html><head><title>Pro Portal</title>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp PRO</a></nav>
    <div class="container"><div class="grid">
        <div><div class="card"><h3>Active Job</h3><p>London - Jan 15</p>
        <form action="/api/storage/upload-raw" method="POST" enctype="multipart/form-data">
        <input type="file" name="files" multiple><button type="submit" class="btn" style="margin-top:10px; width:100%;">Upload RAWs</button>
        </form></div></div>
        <div><div class="wallet-card"><h3>Wallet</h3><p style="font-size:24px;">Pending: £120.00</p><button class="btn" style="background:white; color:black; width:100%;">Request Payout</button></div></div>
    </div></div></body></html>`;
    res.send(html);
});

// 4. ADMIN PANELİ
app.get('/admin', (req, res) => {
    let html = `<html><head><title>Admin Panel</title>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp ADMIN</a></nav>
    <div class="container"><h2>System Management</h2><div class="card">
        <h3>Job #1024 - Review Needed</h3>
        <p>Customer paid £139. Photographer uploaded files.</p>
        <button class="btn">Release £120 to Photographer</button>
    </div></div></body></html>`;
    res.send(html);
});

export default app;