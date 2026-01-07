cat <<EOT > api/server.js
import express from 'express';
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Localsnapp Sistemi Hazir: Musteri Paneli Bekleniyor');
});

export default app;
EOT