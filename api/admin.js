import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Tüm bekleyen işleri listele (Admin için)
router.get('/pending-jobs', async (req, res) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, profiles(full_name)')
        .eq('status', 'Pending');
    
    if (error) return res.status(400).json(error);
    res.json(data);
});

// İşlemi Onayla ve Ödemeyi Başlat
router.post('/approve-work', async (req, res) => {
    const { booking_id, price } = req.body;

    const { error } = await supabase.rpc('complete_booking_and_payout', {
        booking_id_param: booking_id,
        total_price: price
    });

    if (error) return res.status(400).json(error);
    res.json({ message: 'İş onaylandı, fotoğrafçı kazancı cüzdana yansıdı (15 gün bekliyor).' });
});

export default router;