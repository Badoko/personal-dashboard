const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create database file
const dbPath = path.join(__dirname, "tasks.db");

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to SQLite database");

    // Create tasks table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      )
    `);
  }
});

module.exports = db;