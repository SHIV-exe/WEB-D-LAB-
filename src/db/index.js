// src/db/index.js
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const __dirname = import.meta.dirname;

try { process.loadEnvFile(); } catch (e) {}

const dbPath = process.env.DB_PATH || './data/hospital.db';
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

// ==========================================
// CRITICAL DATABASE CONFIGURATION
// ==========================================

// 1. Enable Foreign Keys (Prevents orphaned records)
db.exec('PRAGMA foreign_keys = ON;');

// 2. Enable Write-Ahead Logging (WAL)
// This allows multiple readers and one writer simultaneously, 
// preventing database locks when multiple staff use the app.
db.exec('PRAGMA journal_mode = WAL;');

// 3. Set Busy Timeout
// If a write happens while another is in progress, wait 5 seconds before failing.
db.exec('PRAGMA busy_timeout = 5000;');

// 4. Set Synchronous to NORMAL
// Safe for WAL mode and much faster for writes.
db.exec('PRAGMA synchronous = NORMAL;');

// ==========================================

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

console.log('✅ Database connected and schema verified.');

export function query(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

export function run(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}