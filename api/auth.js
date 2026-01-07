import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// KAYIT OLMA (REGISTER)
router.post('/register', async (req, res) => {
    const { email, password, full_name, role } = req.body;

    // 1. Supabase Auth sistemine kullanıcıyı kaydet
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if (authError) return res.status(400).json({ error: authError.message });

    // 2. Kullanıcıyı bizim oluşturduğumuz 'profiles' tablosuna ekle
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
            id: authData.user.id, 
            full_name: full_name, 
            role: role // 'customer' veya 'photographer'
        }]);

    if (profileError) return res.status(400).json({ error: profileError.message });

    // 3. EĞER FOTOĞRAFÇIYSA: Ona bir cüzdan (wallet) aç
    if (role === 'photographer') {
        await supabase.from('wallets').insert([{ photographer_id: authData.user.id }]);
    }

    res.status(200).json({ message: 'Kayıt başarılı! Lütfen emailinizi kontrol edin.' });
});

export default router;