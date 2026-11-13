// src/views/encounters/form.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderEncounterForm({ user, patient, error = null }) {
  const content = html`
    <div class="page-header">
      <h1>New Medical Encounter</h1>
      <p>Recording visit for: <strong>${patient.first_name} ${patient.last_name}</strong> (${patient.mrn})</p>
    </div>

    <div class="card" style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); max-width: 900px;">
      ${error ? raw(html`<div class="alert-error">${error}</div>`) : ''}

      <form action="/patients/${patient.id}/encounters/new" method="POST">
        
        <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Clinical Notes</h3>
        <div class="form-group">
          <label for="chief_complaint">Chief Complaint (Reason for visit) *</label>
          <input type="text" id="chief_complaint" name="chief_complaint" class="form-control" required placeholder="e.g., Chest pain, fever, annual checkup">
        </div>
        <div class="form-group">
          <label for="diagnosis">Diagnosis</label>
          <input type="text" id="diagnosis" name="diagnosis" class="form-control" placeholder="e.g., Hypertension, Viral Infection">
        </div>
        <div class="form-group">
          <label for="notes">Additional Notes</label>
          <textarea id="notes" name="notes" class="form-control" rows="3" placeholder="Enter detailed medical notes here..."></textarea>
        </div>

        <h3 style="margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Vitals</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
          <div class="form-group">
            <label for="temperature">Temp (°C)</label>
            <input type="number" step="0.1" id="temperature" name="temperature" class="form-control" placeholder="37.0">
          </div>
          <div class="form-group">
            <label for="bp_systolic">BP Systolic</label>
            <input type="number" id="bp_systolic" name="bp_systolic" class="form-control" placeholder="120">
          </div>
          <div class="form-group">
            <label for="bp_diastolic">BP Diastolic</label>
            <input type="number" id="bp_diastolic" name="bp_diastolic" class="form-control" placeholder="80">
          </div>
          <div class="form-group">
            <label for="pulse">Pulse (bpm)</label>
            <input type="number" id="pulse" name="pulse" class="form-control" placeholder="72">
          </div>
          <div class="form-group">
            <label for="resp_rate">Resp Rate</label>
            <input type="number" id="resp_rate" name="resp_rate" class="form-control" placeholder="16">
          </div>
          <div class="form-group">
            <label for="spo2">SpO2 (%)</label>
            <input type="number" id="spo2" name="spo2" class="form-control" placeholder="98">
          </div>
        </div>

        <h3 style="margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Prescription (Optional)</h3>
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label for="drug_name">Medication</label>
            <input type="text" id="drug_name" name="drug_name" class="form-control" placeholder="e.g., Amoxicillin">
          </div>
          <div class="form-group">
            <label for="dose">Dose</label>
            <input type="text" id="dose" name="dose" class="form-control" placeholder="e.g., 500mg">
          </div>
          <div class="form-group">
            <label for="frequency">Frequency</label>
            <input type="text" id="frequency" name="frequency" class="form-control" placeholder="e.g., 3x daily">
          </div>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <button type="submit" class="btn btn-primary">Save Encounter</button>
          <a href="/patients/${patient.id}" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `;

  return layout({
    title: 'New Encounter',
    body: content,
    user
  });
}