import express from 'express';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Dosyaları geçici olarak hafızada tutmak için yapılandırma
const upload = multer({ storage: multer.memoryStorage() });

// RAW FOTOĞRAF YÜKLEME ROTASI
router.post('/upload-raw', upload.array('files'), async (req, res) => {
    try {
        const { booking_id } = req.body;
        const files = req.files;

        if (!files || files.length === 0) return res.status(400).send('Dosya seçilmedi.');

        const uploadPromises = files.map(async (file) => {
            const fileName = `raw/${booking_id}/${Date.now()}-${file.originalname}`;
            
            const { data, error } = await supabase.storage
                .from('photos')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype
                });

            if (error) throw error;
            return data.path;
        });

        const paths = await Promise.all(uploadPromises);

        // Rezervasyonu "Fotoğraflar Yüklendi" durumuna getir
        await supabase
            .from('bookings')
            .update({ status: 'Completed', raw_images_url: paths.join(',') })
            .eq('id', booking_id);

        res.status(200).json({ message: 'Yükleme başarılı!', paths });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;