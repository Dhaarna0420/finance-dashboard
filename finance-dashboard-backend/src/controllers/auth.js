import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../db/index.js';

export const register = async (req, res, next) => {
  const { username, password, role = 'Viewer' } = req.body;

  try {
    const roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get(role);
    if (!roleRow) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const info = db.prepare('INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)')
      .run(username, hash, roleRow.id);

    res.status(201).json({ id: info.lastInsertRowid, username, role });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = db.prepare(`
      SELECT u.*, r.name as role 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.username = ?
    `).get(username);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    next(err);
  }
};
