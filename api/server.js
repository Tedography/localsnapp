const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-base-js');
const payment = require('./payment');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Bağlantısı
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- ÖDEME ROTLARI ---
app.post('/api/create-order', (req, res) => payment.createOrder(req, res));
app.post('/api/capture-order', (req, res) => payment.captureOrder(req, res, supabase));

// --- ADMIN & PRO ROTLARI ---
// Fotoğrafçı RAW Yükleme
app.post('/api/pro/upload-raw', async (req, res) => {
    // Multer entegrasyonu buraya gelecek
    res.json({ message: "RAW dosyası sisteme alındı." });
});

// Admin Ödeme Onay (Release Payout)
app.post('/api/admin/release-payout', async (req, res) => {
    const { bookingId } = req.body;
    const { data, error } = await supabase
        .from('bookings')
        .update({ payment_status: 'released' })
        .eq('id', bookingId);
    
    res.json({ message: "Ödeme fotoğrafçı cüzdanına aktarıldı." });
});

// Port Dinleme
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Localsnapp Server running on port ${PORT}`));

module.exports = app;