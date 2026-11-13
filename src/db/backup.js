// src/db/backup.js
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

try { process.loadEnvFile(); } catch (err) {}

const dbPath = process.env.DB_PATH || './data/hospital.db';
const backupDir = './backups';

// 1. Check if the database file actually exists
if (!fs.existsSync(dbPath)) {
  console.error(`❌ Database file not found at ${dbPath}. Cannot backup.`);
  process.exit(1);
}

// 2. Ensure the backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// 3. Generate a timestamped filename (e.g., hospital-backup-2024-05-20T14-30-00.db)
// We replace colons with hyphens because Windows doesn't allow colons in filenames.
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const backupFile = path.join(backupDir, `hospital-backup-${timestamp}.db`);

// 4. Copy the database file
try {
  fs.copyFileSync(dbPath, backupFile);
  console.log(`✅ Database backed up successfully to: ${backupFile}`);
} catch (err) {
  console.error(`❌ Failed to backup database:`, err);
  process.exit(1);
}

// 5. Cleanup old backups (Keep only the 7 most recent)
try {
  const files = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('hospital-backup-') && f.endsWith('.db'))
    .sort(); // Sorting alphabetically works because of the ISO timestamp

  if (files.length > 7) {
    const filesToDelete = files.slice(0, files.length - 7);
    for (const file of filesToDelete) {
      fs.unlinkSync(path.join(backupDir, file));
      console.log(`🗑️ Deleted old backup: ${file}`);
    }
  }
} catch (err) {
  console.error(`⚠️ Could not clean up old backups:`, err);
}