import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Kayıt Olma Fonksiyonu
router.post('/register', async (req, res) => {
    const { email, password, full_name, role } = req.body;

    // 1. Kullanıcıyı Supabase Auth'a ekle
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if (authError) return res.status(400).json({ error: authError.message });

    // 2. Kullanıcı profilini (Müşteri mi, Fotoğrafçı mı) profiles tablosuna işle
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: authData.user.id, full_name, role }]);

    if (profileError) return res.status(400).json({ error: profileError.message });

    // 3. Eğer fotoğrafçıysa, ona boş bir cüzdan aç (Finansal başlangıç)
    if (role === 'photographer') {
        await supabase.from('wallets').insert([{ photographer_id: authData.user.id }]);
    }

    res.status(200).json({ message: 'Kayıt başarılı!', user: authData.user });
});

export default router;