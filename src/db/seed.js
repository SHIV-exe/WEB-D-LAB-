// src/db/seed.js
import crypto from 'node:crypto';
import { run, query } from './index.js';

console.log('🌱 Starting database seeding...');

// 1. Helper function to securely hash passwords
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

// 2. Helper function to create a user
function createUser(username, password, role, fullName) {
  // Check if user already exists to prevent duplicates if we run this twice
  const existing = query('SELECT id FROM users WHERE username = ?', [username]);
  if (existing.length > 0) {
    console.log(`⚠️ User '${username}' already exists. Skipping.`);
    return;
  }

  const { hash, salt } = hashPassword(password);
  run(
    'INSERT INTO users (username, password_hash, password_salt, role, full_name) VALUES (?, ?, ?, ?, ?)',
    [username, hash, salt, role, fullName]
  );
  console.log(`👤 Created ${role}: ${username} (Password: ${password})`);
}

// 3. Create the default users
createUser('admin', 'admin123', 'admin', 'System Administrator');
createUser('dr_smith', 'doctor123', 'doctor', 'Dr. John Smith');
createUser('nurse_joy', 'nurse123', 'nurse', 'Joy Williams');
createUser('reception1', 'recep123', 'reception', 'Sarah Connor');

// 4. Create some fake patients
const patientCount = query('SELECT COUNT(*) as count FROM patients')[0].count;
if (patientCount === 0) {
  const patients = [
    ['MRN-1001', 'Alice', 'Johnson', '1985-04-12', 'F', '555-0101', 'Penicillin'],
    ['MRN-1002', 'Bob', 'Smith', '1972-11-23', 'M', '555-0102', 'None'],
    ['MRN-1003', 'Charlie', 'Brown', '1990-08-05', 'M', '555-0103', 'Peanuts']
  ];

  for (const p of patients) {
    run(
      `INSERT INTO patients (mrn, first_name, last_name, dob, sex, phone, allergies) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      p
    );
  }
  console.log('🏥 Created 3 fake patients.');
}

// 5. Create some fake beds
const bedCount = query('SELECT COUNT(*) as count FROM beds')[0].count;
if (bedCount === 0) {
  const beds = [
    ['ICU', '101', 'A', 'available'],
    ['ICU', '101', 'B', 'occupied'],
    ['General', '201', 'A', 'available'],
    ['General', '201', 'B', 'maintenance']
  ];

  for (const b of beds) {
    run('INSERT INTO beds (ward, room, bed_number, status) VALUES (?, ?, ?, ?)', b);
  }
  console.log('🛏️ Created 4 fake beds.');
}

// 6. Create some fake equipment
const eqCount = query('SELECT COUNT(*) as count FROM equipment')[0].count;
if (eqCount === 0) {
  const equipment = [
    ['Ventilator', 'VNT-101', 'Life Support', 'ICU', 'working'],
    ['X-Ray Machine', 'XR-201', 'Imaging', 'Radiology', 'maintenance'],
    ['Wheelchair', 'WC-301', 'Mobility', 'General', 'working']
  ];

  for (const e of equipment) {
    run('INSERT INTO equipment (name, serial_number, category, location, status) VALUES (?, ?, ?, ?, ?)', e);
  }
  console.log('🩺 Created 3 fake equipment items.');
}

console.log('✅ Seeding complete!');