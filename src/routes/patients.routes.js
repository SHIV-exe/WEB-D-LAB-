// src/routes/patients.routes.js
import { query, run } from '../db/index.js';
import { renderPatientList } from '../views/patients/list.js';
import { renderPatientForm } from '../views/patients/form.js';
import { renderPatientDetail } from '../views/patients/detail.js';
import { sendHtml, redirect, readBody } from '../lib/http.js';
import { logAction } from '../lib/audit.js'; // <-- NEW

export function showPatientList(req, res) {
  const patients = query('SELECT * FROM patients ORDER BY last_name ASC');
  sendHtml(res, renderPatientList({ user: req.user, patients }));
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

  // LOG ACTION
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

  // LOG ACTION (Viewing a patient record is highly sensitive)
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