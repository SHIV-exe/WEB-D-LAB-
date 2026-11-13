// src/db/index.js
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// 1. Get the current directory (src/db) to find schema.sql
// (import.meta.dirname is a modern Node feature that gives us the folder path)
const __dirname = import.meta.dirname;

// Load environment variables if this file is run directly
try { process.loadEnvFile(); } catch (e) {}

// 2. Set the database path (from .env, or fallback to ./data/hospital.db)
const dbPath = process.env.DB_PATH || './data/hospital.db';

// 3. Ensure the "data" folder actually exists before we try to create the DB
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 4. Initialize the Database
// Note: This will create the file if it doesn't exist
export const db = new DatabaseSync(dbPath);

// 5. Turn on Foreign Keys (SQLite requires this to be explicitly turned on for every connection)
db.exec('PRAGMA foreign_keys = ON;');

// 6. Read and execute the schema.sql file
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

console.log('✅ Database connected and schema verified.');

// ==========================================
// HELPER FUNCTIONS
// These make it easy to run SQL from our routes
// ==========================================

/**
 * Run a SELECT query and return an array of rows.
 * Example: query('SELECT * FROM users WHERE role = ?', ['doctor'])
 */
export function query(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

/**
 * Run an INSERT, UPDATE, or DELETE statement.
 * Returns an object with { changes, lastInsertRowid }
 * Example: run('INSERT INTO users (username) VALUES (?)', ['admin'])
 */
export function run(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}