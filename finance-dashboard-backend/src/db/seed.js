import db from './index.js';

export const createTables = () => {
  // Roles table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `).run();

  // Users table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role_id INTEGER NOT NULL,
      status TEXT DEFAULT 'active',
      FOREIGN KEY (role_id) REFERENCES roles (id)
    )
  `).run();

  // Financial Records table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS financial_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `).run();
};

export const seedDatabase = (bcrypt) => {
  createTables();

  // Seed Roles
  const roles = ['Admin', 'Analyst', 'Viewer'];
  const insertRole = db.prepare('INSERT OR IGNORE INTO roles (name) VALUES (?)');
  roles.forEach(role => insertRole.run(role));

  // Seed Admin user (if not exists)
  const adminExists = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    const adminRoleId = db.prepare('SELECT id FROM roles WHERE name = ?').get('Admin').id;
    db.prepare('INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)')
      .run('admin', hash, adminRoleId);
    console.log('Seeded Admin user: admin/admin123');
  }

  // Seed Sample Financial Records (if table is empty)
  const recordCount = db.prepare('SELECT count(*) as count FROM financial_records').get().count;
  if (recordCount === 0) {
    const adminId = db.prepare('SELECT id FROM users WHERE username = ?').get('admin').id;
    const sampleRecords = [
      { amount: 5000.00, type: 'income', category: 'Salary', date: '2024-03-01', notes: 'Monthly payroll' },
      { amount: 1200.00, type: 'expense', category: 'Rent', date: '2024-03-02', notes: 'Apartment rent' },
      { amount: 150.50, type: 'expense', category: 'Utilities', date: '2024-03-05', notes: 'Electricity & Water' },
      { amount: 75.25, type: 'expense', category: 'Food', date: '2024-03-06', notes: 'Grocery shopping' },
      { amount: 1000.00, type: 'income', category: 'Freelance', date: '2024-03-10', notes: 'Web Dev Project' },
      { amount: 45.00, type: 'expense', category: 'Transport', date: '2024-03-12', notes: 'Gas refill' },
      { amount: 200.00, type: 'expense', category: 'Entertainment', date: '2024-03-15', notes: 'Dinner & Movie' },
      { amount: 80.00, type: 'expense', category: 'Food', date: '2024-03-18', notes: 'Supplies' },
      { amount: 120.00, type: 'expense', category: 'Utilities', date: '2024-03-20', notes: 'Internet bill' }
    ];

    const insertRecord = db.prepare(`
      INSERT INTO financial_records (user_id, amount, type, category, date, notes) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      sampleRecords.forEach(record => {
        insertRecord.run(adminId, record.amount, record.type, record.category, record.date, record.notes);
      });
    })();

    console.log(`Seeded ${sampleRecords.length} sample financial records.`);
  }
};
