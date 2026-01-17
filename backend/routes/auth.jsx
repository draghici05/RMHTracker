import express from 'express';
import bcrypt from 'bcrypt';
import user from '../models/user.jsx';
import authRoutes from './routes/auth.jsx';

const router = express.Router();
const allowedRoles = new Set(['EO', 'PARTICIPANT']);

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const existing = await user.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const safeRole = allowedRoles.has(role) ? role : 'PARTICIPANT';

    const created = await user.create({
      name,
      email,
      password: hashed,
      role: safeRole,
    });

    req.session.user = {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
    };

    return res.json({ ok: true, user: req.session.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const found = await user.findOne({ where: { email } });
    if (!found) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, found.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };

    return res.json({ ok: true, user: req.session.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  return res.json({ ok: true, user: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.use('/api/auth', authRoutes);
export default router;
