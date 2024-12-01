const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../user.db');

// Initialize SQLite Database (in-memory, you can modify this to use a file)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)', (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('User table created');
      }
    });
  }
});

module.exports = db;
