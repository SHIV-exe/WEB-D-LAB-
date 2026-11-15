// src/views/patients/detail.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderPatientDetail({ user, patient, encounters, assignedBed, availableBeds }) {
  const isActive = patient.is_active === 1;

  const content = html`
    ${!isActive ? raw(html`
      <div style="background: #f8d7da; color: #842029; padding: 1rem; border-radius: var(--radius); margin-bottom: 1.5rem; font-weight: bold; border: 1px solid #f5c2c7;">
        ⚠️ This patient has been discharged. Their records are locked in read-only mode.
      </div>
    `) : ''}

    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>${patient.first_name} ${patient.last_name} ${!isActive ? '(Discharged)' : ''}</h1>
        <p>Medical Record Number: <strong>${patient.mrn}</strong></p>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <a href="/patients" class="btn btn-secondary">Back</a>
        ${isActive ? raw(html`
          <a href="/patients/${patient.id}/edit" class="btn btn-primary">Edit Profile</a>
          <form action="/patients/${patient.id}/discharge" method="POST" onsubmit="return confirm('Are you sure you want to discharge this patient?');">
            <button type="submit" class="btn btn-logout" style="padding: 0.5rem 1rem; font-size: 1rem;">Discharge</button>
          </form>
        `) : ''}
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
      <!-- Demographics -->
      <div class="card" style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow);">
        <h2 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Demographics</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid var(--bg-color);"><td style="padding: 0.5rem 0; color: var(--text-muted); width: 40%;">DOB</td><td style="padding: 0.5rem 0; font-weight: 500;">${patient.dob || 'N/A'}</td></tr>
          <tr style="border-bottom: 1px solid var(--bg-color);"><td style="padding: 0.5rem 0; color: var(--text-muted);">Sex</td><td style="padding: 0.5rem 0; font-weight: 500;">${patient.sex || 'N/A'}</td></tr>
          <tr style="border-bottom: 1px solid var(--bg-color);"><td style="padding: 0.5rem 0; color: var(--text-muted);">Phone</td><td style="padding: 0.5rem 0; font-weight: 500;">${patient.phone || 'N/A'}</td></tr>
        </table>
      </div>

      <!-- Bed Assignment Card -->
      <div class="card" style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow); border-top: 4px solid var(--primary-color);">
        <h2 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Bed Assignment</h2>
        
        ${assignedBed ? raw(html`
          <div style="background: #e0f2fe; padding: 1rem; border-radius: var(--radius); margin-bottom: 1rem;">
            <p style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Currently In:</p>
            <h3 style="font-size: 1.25rem; color: var(--primary-color);">${assignedBed.ward} - Room ${assignedBed.room}${assignedBed.bed_number}</h3>
          </div>
        `) : raw(html`
          <p style="color: var(--text-muted); margin-bottom: 1rem; font-size: 0.9rem;">No bed currently assigned.</p>
        `)}

        ${isActive ? raw(html`
          <form action="/patients/${patient.id}/assign-bed" method="POST" style="display: flex; gap: 0.5rem;">
            <select name="bed_id" class="form-control">
              <option value="">-- Unassign Bed --</option>
              ${raw(availableBeds.map(bed => html`
                <option value="${bed.id}">${bed.ward} - ${bed.room}${bed.bed_number}</option>
              `).join(''))}
            </select>
            <button type="submit" class="btn btn-secondary">Assign</button>
          </form>
        `) : ''}
      </div>

      <!-- Medical Alerts -->
      <div class="card" style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow); border-top: 4px solid var(--danger-color);">
        <h2 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; color: var(--danger-color);">⚠️ Medical Alerts</h2>
        <h3 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;">Known Allergies</h3>
        <p style="font-size: 1.25rem; font-weight: bold; color: ${patient.allergies && patient.allergies !== 'None' ? 'var(--danger-color)' : 'var(--success-color)'};">
          ${patient.allergies || 'None'}
        </p>
      </div>
    </div>

    <!-- Medical Encounters (Same as before) -->
    <div class="card" style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="padding-bottom: 0.5rem; flex-grow: 1;">Medical Encounters</h2>
        ${isActive ? raw(html`
          <a href="/patients/${patient.id}/encounters/new" class="btn btn-primary" style="margin-left: 1rem;">+ New Encounter</a>
        `) : ''}
      </div>
      
      ${encounters.length === 0 ? raw(html`
        <p style="color: var(--text-muted); text-align: center; padding: 2rem;">No medical encounters recorded yet.</p>
      `) : raw(encounters.map(enc => html`
        <div style="border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <strong style="font-size: 1.1rem;">Visit: ${new Date(enc.started_at).toLocaleDateString()}</strong>
            <span style="color: var(--text-muted); font-size: 0.875rem;">Dr. ${enc.doctor_name || 'Unknown'}</span>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
            <div>
              <p style="margin-bottom: 0.5rem;"><strong>Complaint:</strong> ${enc.chief_complaint || 'None'}</p>
              <p style="margin-bottom: 0.5rem;"><strong>Diagnosis:</strong> ${enc.diagnosis || 'Pending'}</p>
              <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 1rem;">Notes: ${enc.notes || 'None'}</p>
            </div>
            
            <div style="background: var(--bg-color); padding: 1rem; border-radius: var(--radius); font-size: 0.9rem;">
              ${enc.vitals ? raw(html`
                <strong style="display: block; margin-bottom: 0.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem;">Vitals</strong>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                  ${enc.vitals.temperature ? raw(html`<div>Temp: <strong>${enc.vitals.temperature}°C</strong></div>`) : ''}
                  ${enc.vitals.bp_systolic ? raw(html`<div>BP: <strong>${enc.vitals.bp_systolic}/${enc.vitals.bp_diastolic}</strong></div>`) : ''}
                  ${enc.vitals.pulse ? raw(html`<div>Pulse: <strong>${enc.vitals.pulse} bpm</strong></div>`) : ''}
                  ${enc.vitals.spo2 ? raw(html`<div>SpO2: <strong>${enc.vitals.spo2}%</strong></div>`) : ''}
                </div>
              `) : raw(html`<span style="color: var(--text-muted);">No vitals recorded.</span>`)}

              ${enc.prescriptions.length > 0 ? raw(html`
                <strong style="display: block; margin-top: 1rem; margin-bottom: 0.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem;">Rx</strong>
                ${raw(enc.prescriptions.map(p => html`
                  <div>💊 <strong>${p.drug_name}</strong> ${p.dose} - ${p.frequency}</div>
                `).join(''))}
              `) : ''}
            </div>
          </div>
        </div>
      `).join(''))}
    </div>
  `;

  return layout({ title: `${patient.first_name} ${patient.last_name}`, body: content, user });
}