import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// 1. Banka Bilgilerini Güncelle
router.post('/update-bank', async (req, res) => {
    const { user_id, bank_details } = req.body;
    const { error } = await supabase
        .from('profiles')
        .update({ bank_details })
        .eq('id', user_id);
    
    if (error) return res.status(400).json(error);
    res.json({ message: 'Banka bilgileri kaydedildi.' });
});

// 2. Para Çekme Talebi Oluştur (Sadece 'balance' çekilebilir, 'pending' çekilemez)
router.post('/request-payout', async (req, res) => {
    const { photographer_id, amount } = req.body;

    // Önce cüzdanı kontrol et
    const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('photographer_id', photographer_id)
        .single();

    if (wallet.balance < amount) {
        return res.status(400).json({ error: 'Yetersiz bakiye.' });
    }

    // Bakiyeden düş ve talebi kaydet (Basit anlatım için direkt düşüyoruz)
    await supabase
        .from('wallets')
        .update({ balance: wallet.balance - amount })
        .eq('photographer_id', photographer_id);

    res.json({ message: 'Para çekme talebiniz alındı. 3 iş günü içinde hesabınızda olacaktır.' });
});

export default router;