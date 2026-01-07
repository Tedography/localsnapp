import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Rezervasyon Oluşturma Rotası
router.post('/create', async (req, res) => {
    const { customer_id, city, booking_date, hours, price, customer_notes } = req.body;

    // Supabase 'bookings' tablosuna yeni kayıt ekle
    const { data, error } = await supabase
        .from('bookings')
        .insert([
            { 
                customer_id, 
                city, 
                booking_date, 
                hours, 
                price, 
                customer_notes,
                status: 'Pending' // İlk aşamada onay bekliyor
            }
        ]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Rezervasyon başarıyla oluşturuldu!', data });
});

export default router;