import express from 'express';
import paymentRoutes from './payment.js';

const app = express();
app.use(express.json());
app.use('/api/payment', paymentRoutes);

const styles = `<style>
    :root { --brand: #00d1b2; --dark: #1a1a1a; --gray: #f4f7f6; }
    body { font-family: 'Inter', sans-serif; margin: 0; background: var(--gray); display: flex; flex-direction: column; min-height: 100vh; }
    .nav { background: white; padding: 15px 8%; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; }
    .logo { font-size: 24px; font-weight: 800; color: var(--brand); text-decoration: none; }
    .container { padding: 40px 8%; flex: 1; display: flex; justify-content: center; align-items: flex-start; }
    .card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.05); width: 100%; max-width: 400px; text-align: center; }
    input, select { width: 100%; padding: 12px; margin: 10px 0 20px 0; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; }
    #paypal-button-container { min-height: 150px; margin-top: 20px; }
    .footer-links { margin-top: 20px; font-size: 14px; }
    .footer-links a { color: #666; text-decoration: none; margin: 0 10px; }
</style>`;

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html><html><head>
    <title>Localsnapp | Booking</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${styles}
    <script src="https://www.paypal.com/sdk/js?client-id=AY2qXxdM1VHcYkh3G7Zosf0IbTn7VqMV2yn_w-imA3cYMNyavvnMl2vxPE0Ro2H2iaDkOnZl89u5LHwc&currency=GBP"></script>
    </head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp.</a></nav>
    <div class="container">
        <div class="card">
            <h2>Book Your Shoot</h2>
            <p style="color:#666; font-size:14px;">Select package and pay securely</p>
            <input type="text" id="city" placeholder="Enter City (e.g. London)" value="London">
            <select id="pkg">
                <option value="139">1 Hour Session - £139</option>
                <option value="229">2 Hours Session - £229</option>
            </select>
            <div id="paypal-button-container"></div>
            <div class="footer-links">
                <a href="/pro">Pro Portal</a> • <a href="/admin">Admin</a>
            </div>
        </div>
    </div>
    <script>
        function initPayPal() {
            if (window.paypal) {
                paypal.Buttons({
                    style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
                    createOrder: async function() {
                        const res = await fetch('/api/payment/create-paypal-order', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ amount: document.getElementById('pkg').value })
                        });
                        const data = await res.json();
                        return data.id;
                    },
                    onApprove: function(data, actions) {
                        return actions.order.capture().then(() => { window.location.href='/dashboard'; });
                    }
                }).render('#paypal-button-container');
            } else {
                setTimeout(initPayPal, 1000); // SDK henüz yüklenmediyse 1 saniye bekle tekrar dene
            }
        }
        initPayPal();
    </script></body></html>`);
});

// TAM TASARLANMIŞ DİĞER SAYFALAR
app.get('/pro', (req, res) => {
    res.send(`<!DOCTYPE html><html><head>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp PRO.</a></nav>
    <div class="container"><div class="card" style="max-width:600px;">
    <h2>Pro Dashboard</h2><p>Upload your RAW files here.</p>
    <input type="file" multiple><button style="background:var(--brand); color:white; border:none; padding:10px; width:100%; border-radius:8px; cursor:pointer;">Upload to Admin</button>
    <div style="background:#000; color:#fff; padding:20px; border-radius:12px; margin-top:20px;">Wallet: £120.00</div>
    </div></div></body></html>`);
});

app.get('/admin', (req, res) => {
    res.send(`<!DOCTYPE html><html><head>${styles}</head><body>
    <nav class="nav"><a href="/" class="logo">Localsnapp ADMIN.</a></nav>
    <div class="container"><div class="card" style="max-width:600px;">
    <h2>Admin Management</h2><div style="border:1px solid #eee; padding:15px; border-radius:8px; text-align:left;">
    <strong>Job #1024</strong><br>Status: RAWs Uploaded<br><button style="margin-top:10px; cursor:pointer;">Approve & Release Payment</button>
    </div></div></div></body></html>`);
});

app.get('/dashboard', (req, res) => {
    res.send(`<!DOCTYPE html><html><head>${styles}</head><body>
    <div class="container"><div class="card"><h2>✓ Payment Successful</h2><p>We are matching you with a photographer.</p><a href="/">Home</a></div></div></body></html>`);
});

export default app;