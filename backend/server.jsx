import express from 'express';
import { all } from './database.jsx';   

const app = express();
app.use(express.json());

app.get('api/health', async (req, res) => {
    res.json({ok: true});
});

app.get('api/events', async (req, res) => {
    res.json({ok: true});
});

app.listen(3000, () => console.log('Server running on port 3000'));