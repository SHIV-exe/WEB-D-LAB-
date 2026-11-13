// src/routes/patients.routes.js
import { query, run } from '../db/index.js';
import { renderPatientList } from '../views/patients/list.js';
import { renderPatientForm } from '../views/patients/form.js';
import { renderEditPatientForm } from '../views/patients/edit.js';
import { renderPatientDetail } from '../views/patients/detail.js';
import { sendHtml, redirect, readBody } from '../lib/http.js';
import { logAction } from '../lib/audit.js';

export function showPatientList(req, res) {
  const search = req.query.get('search')?.trim() || '';
  const statusFilter = req.query.get('status') || '';

  // Start building the query
  let sql = 'SELECT * FROM patients WHERE 1=1';
  const params = [];

  // Add search condition if present
  if (search) {
    sql += ' AND (first_name LIKE ? OR last_name LIKE ? OR mrn LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  // Add status condition if present
  if (statusFilter === '1' || statusFilter === '0') {
    sql += ' AND is_active = ?';
    params.push(parseInt(statusFilter, 10));
  }

  // Add ordering
  sql += ' ORDER BY is_active DESC, last_name ASC';

  const patients = query(sql, params);

  sendHtml(res, renderPatientList({ 
    user: req.user, 
    patients, 
    searchQuery: search, 
    statusFilter 
  }));
}

export function showNewPatientForm(req, res) {
  sendHtml(res, renderPatientForm({ user: req.user }));
}

export async function handleCreatePatient(req, res) {
  const body = await readBody(req);
  const first_name = body.get('first_name')?.trim();
  const last_name = body.get('last_name')?.trim();
  const dob = body.get('dob') || null;
  const sex = body.get('sex') || null;
  const phone = body.get('phone') || null;
  const address = body.get('address') || null;
  const emergency_contact = body.get('emergency_contact') || null;
  const allergies = body.get('allergies') || 'None';

  if (!first_name || !last_name) {
    return sendHtml(res, renderPatientForm({ user: req.user, error: 'First name and last name are required.' }), 400);
  }

  const mrn = `MRN-${Date.now().toString().slice(-6)}`;

  const result = run(
    `INSERT INTO patients (mrn, first_name, last_name, dob, sex, phone, address, emergency_contact, allergies) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [mrn, first_name, last_name, dob, sex, phone, address, emergency_contact, allergies]
  );

  logAction(req.user.user_id, 'CREATE_PATIENT', 'patients', result.lastInsertRowid, req);
  redirect(res, '/patients');
}

export function showPatientDetail(req, res) {
  const patientId = req.params.id;
  
  const rows = query('SELECT * FROM patients WHERE id = ?', [patientId]);
  const patient = rows[0];

  if (!patient) {
    return sendHtml(res, '<h1>404</h1><p>Patient not found.</p>', 404);
  }

  logAction(req.user.user_id, 'VIEW_PATIENT', 'patients', patientId, req);

  const encounters = query(`
    SELECT e.*, u.full_name as doctor_name 
    FROM encounters e
    JOIN users u ON e.doctor_id = u.id
    WHERE e.patient_id = ?
    ORDER BY e.started_at DESC
  `, [patientId]);

  for (const enc of encounters) {
    enc.vitals = query('SELECT * FROM vitals WHERE encounter_id = ?', [enc.id])[0] || null;
    enc.prescriptions = query('SELECT * FROM prescriptions WHERE encounter_id = ?', [enc.id]);
  }

  sendHtml(res, renderPatientDetail({ user: req.user, patient, encounters }));
}

export function showEditPatientForm(req, res) {
  const patientId = req.params.id;
  const patient = query('SELECT * FROM patients WHERE id = ?', [patientId])[0];

  if (!patient) {
    return sendHtml(res, '<h1>404</h1><p>Patient not found.</p>', 404);
  }

  sendHtml(res, renderEditPatientForm({ user: req.user, patient }));
}

export async function handleUpdatePatient(req, res) {
  const patientId = req.params.id;
  const body = await readBody(req);
  
  const first_name = body.get('first_name')?.trim();
  const last_name = body.get('last_name')?.trim();
  const dob = body.get('dob') || null;
  const sex = body.get('sex') || null;
  const phone = body.get('phone') || null;
  const address = body.get('address') || null;
  const emergency_contact = body.get('emergency_contact') || null;
  const allergies = body.get('allergies') || 'None';

  if (!first_name || !last_name) {
    const patient = query('SELECT * FROM patients WHERE id = ?', [patientId])[0];
    return sendHtml(res, renderEditPatientForm({ user: req.user, patient, error: 'First and last name are required.' }), 400);
  }

  run(
    `UPDATE patients 
     SET first_name = ?, last_name = ?, dob = ?, sex = ?, phone = ?, address = ?, emergency_contact = ?, allergies = ?
     WHERE id = ?`,
    [first_name, last_name, dob, sex, phone, address, emergency_contact, allergies, patientId]
  );

  logAction(req.user.user_id, 'EDIT_PATIENT', 'patients', patientId, req);
  redirect(res, `/patients/${patientId}`);
}

export function handleDischargePatient(req, res) {
  const patientId = req.params.id;
  run('UPDATE patients SET is_active = 0 WHERE id = ?', [patientId]);
  logAction(req.user.user_id, 'DISCHARGE_PATIENT', 'patients', patientId, req);
  redirect(res, `/patients/${patientId}`);
}