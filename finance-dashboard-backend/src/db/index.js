import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : (process.env.DATABASE_URL || './data/finance.sqlite');
const dbDir = path.dirname(dbPath);

// Ensure database directory exists (only if not in-memory)
if (dbPath !== ':memory:' && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;
