import db from '../db/index.js';

export const getAllRecords = (req, res, next) => {
  const { startDate, endDate, category, type } = req.query;
  let query = 'SELECT r.*, u.username as creator FROM financial_records r JOIN users u ON r.user_id = u.id WHERE 1=1';
  const params = [];

  if (startDate) {
    query += ' AND r.date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND r.date <= ?';
    params.push(endDate);
  }
  if (category) {
    query += ' AND r.category = ?';
    params.push(category);
  }
  if (type) {
    query += ' AND r.type = ?';
    params.push(type);
  }

  try {
    const records = db.prepare(query).all(...params);
    res.json(records);
  } catch (err) {
    next(err);
  }
};

export const createRecord = (req, res, next) => {
  const { amount, type, category, date, notes } = req.body;
  const userId = req.user.id;

  try {
    const info = db.prepare('INSERT INTO financial_records (user_id, amount, type, category, date, notes) VALUES (?, ?, ?, ?, ?, ?)')
      .run(userId, amount, type, category, date, notes);
    res.status(201).json({ id: info.lastInsertRowid, amount, type, category, date, notes });
  } catch (err) {
    next(err);
  }
};

export const updateRecord = (req, res, next) => {
  const { id } = req.params;
  const { amount, type, category, date, notes } = req.body;

  try {
    const info = db.prepare('UPDATE financial_records SET amount = ?, type = ?, category = ?, date = ?, notes = ? WHERE id = ?')
      .run(amount, type, category, date, notes, id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ id, amount, type, category, date, notes });
  } catch (err) {
    next(err);
  }
};

export const deleteRecord = (req, res, next) => {
  const { id } = req.params;

  try {
    const info = db.prepare('DELETE FROM financial_records WHERE id = ?').run(id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
