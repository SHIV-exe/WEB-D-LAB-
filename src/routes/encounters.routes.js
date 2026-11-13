// src/routes/encounters.routes.js
import { query, run } from '../db/index.js';
import { renderEncounterForm } from '../views/encounters/form.js';
import { sendHtml, redirect, readBody } from '../lib/http.js';

export function showNewEncounterForm(req, res) {
  const patientId = req.params.id;
  
  const rows = query('SELECT * FROM patients WHERE id = ?', [patientId]);
  const patient = rows[0];

  if (!patient) {
    return sendHtml(res, '<h1>404</h1><p>Patient not found.</p>', 404);
  }

  sendHtml(res, renderEncounterForm({ user: req.user, patient }));
}

export async function handleCreateEncounter(req, res) {
  const patientId = req.params.id;
  const body = await readBody(req);
  
  const chief_complaint = body.get('chief_complaint')?.trim();
  const diagnosis = body.get('diagnosis')?.trim() || null;
  const notes = body.get('notes')?.trim() || null;

  // Vitals data
  const temperature = parseFloat(body.get('temperature')) || null;
  const bp_systolic = parseInt(body.get('bp_systolic')) || null;
  const bp_diastolic = parseInt(body.get('bp_diastolic')) || null;
  const pulse = parseInt(body.get('pulse')) || null;
  const resp_rate = parseInt(body.get('resp_rate')) || null;
  const spo2 = parseInt(body.get('spo2')) || null;

  // Prescription data
  const drug_name = body.get('drug_name')?.trim() || null;
  const dose = body.get('dose')?.trim() || null;
  const frequency = body.get('frequency')?.trim() || null;

  // We need the patient details in case of validation error
  const patient = query('SELECT * FROM patients WHERE id = ?', [patientId])[0];

  if (!chief_complaint) {
    return sendHtml(res, renderEncounterForm({ 
      user: req.user, 
      patient, 
      error: 'Chief complaint is required.' 
    }), 400);
  }

  // 1. Insert the encounter and get its ID
  const result = run(
    `INSERT INTO encounters (patient_id, doctor_id, chief_complaint, diagnosis, notes) 
     VALUES (?, ?, ?, ?, ?)`,
    [patientId, req.user.user_id, chief_complaint, diagnosis, notes]
  );
  
  const encounterId = result.lastInsertRowid;

  // 2. If vitals were provided, insert them
  if (temperature || bp_systolic || bp_diastolic || pulse || resp_rate || spo2) {
    run(
      `INSERT INTO vitals (encounter_id, recorded_by, temperature, bp_systolic, bp_diastolic, pulse, resp_rate, spo2) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [encounterId, req.user.user_id, temperature, bp_systolic, bp_diastolic, pulse, resp_rate, spo2]
    );
  }

  // 3. If a prescription was provided, insert it
  if (drug_name && dose) {
    run(
      `INSERT INTO prescriptions (encounter_id, drug_name, dose, frequency, prescribed_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [encounterId, drug_name, dose, frequency, req.user.user_id]
    );
  }

  // Redirect back to the patient's profile
  redirect(res, `/patients/${patientId}`);
}