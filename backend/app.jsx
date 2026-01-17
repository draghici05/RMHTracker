import express from 'express';
import session from 'express-session';
import cors from 'cors';

import db from './database.jsx';
import initializeDB from './initializedb.jsx';

import auth from '../routes/auth.jsx';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', credentials: true
}))

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}));

initializeDB();

await db.sync({force: false});
app.get('/api/health', (req, res) => res.json({ok: true}));
app.use('/api/auth', auth);
app.listen(3000, () => console.log('Server running on port 3000'));