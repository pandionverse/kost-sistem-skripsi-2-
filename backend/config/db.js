const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

dotenv.config();

const dbPath = process.env.SQLITE_PATH || path.join(__dirname, '..', 'data', 'kost.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const rawDb = new sqlite3.Database(dbPath);
rawDb.serialize(() => {
  rawDb.run('PRAGMA foreign_keys = ON');

  rawDb.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'owner' CHECK(role IN ('admin','owner')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  rawDb.run(`
    CREATE TABLE IF NOT EXISTS kost (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      address TEXT NOT NULL,
      maps_link TEXT,
      owner_phone TEXT,
      room_available INTEGER DEFAULT 1,
      last_room_update DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  rawDb.run(`
    CREATE TABLE IF NOT EXISTS kost_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kost_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (kost_id) REFERENCES kost(id) ON DELETE CASCADE
    )
  `);

  rawDb.run(`
    CREATE TABLE IF NOT EXISTS logbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_type TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    rawDb.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ insertId: this.lastID, affectedRows: this.changes });
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    rawDb.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

module.exports = {
  async execute(sql, params = []) {
    const normalized = sql.trim().toUpperCase();
    if (normalized.startsWith('SELECT')) {
      const rows = await all(sql, params);
      return [rows];
    }
    const result = await run(sql, params);
    return [result];
  },
  async query(sql, params = []) {
    return this.execute(sql, params);
  }
};
