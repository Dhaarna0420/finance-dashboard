const Database = require("better-sqlite3");
const db = new Database("finance.db");

// Create tables
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT,
  isActive INTEGER DEFAULT 1
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL,
  type TEXT,
  category TEXT,
  date TEXT,
  notes TEXT,
  userId INTEGER
)`).run();

module.exports = db;