// src/views/patients/edit.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderEditPatientForm({ user, patient, error = null }) {
  const content = html`
    <div class="page-header">
      <h1>Edit Patient Profile</h1>
      <p>Update information for <strong>${patient.first_name} ${patient.last_name}</strong> (${patient.mrn})</p>
    </div>

    <div class="card" style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); max-width: 800px;">
      ${error ? raw(html`<div class="alert-error">${error}</div>`) : ''}

      <form action="/patients/${patient.id}/edit" method="POST">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label for="first_name">First Name *</label>
            <input type="text" id="first_name" name="first_name" class="form-control" value="${patient.first_name}" required>
          </div>
          <div class="form-group">
            <label for="last_name">Last Name *</label>
            <input type="text" id="last_name" name="last_name" class="form-control" value="${patient.last_name}" required>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" class="form-control" value="${patient.dob || ''}">
          </div>
          <div class="form-group">
            <label for="sex">Sex</label>
            <select id="sex" name="sex" class="form-control">
              <option value="" ${!patient.sex ? 'selected' : ''}>Select...</option>
              <option value="M" ${patient.sex === 'M' ? 'selected' : ''}>Male</option>
              <option value="F" ${patient.sex === 'F' ? 'selected' : ''}>Female</option>
              <option value="O" ${patient.sex === 'O' ? 'selected' : ''}>Other</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" class="form-control" value="${patient.phone || ''}">
          </div>
          <div class="form-group">
            <label for="emergency_contact">Emergency Contact</label>
            <input type="text" id="emergency_contact" name="emergency_contact" class="form-control" value="${patient.emergency_contact || ''}">
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <input type="text" id="address" name="address" class="form-control" value="${patient.address || ''}">
        </div>

        <div class="form-group">
          <label for="allergies">Known Allergies</label>
          <input type="text" id="allergies" name="allergies" class="form-control" value="${patient.allergies === 'None' ? '' : (patient.allergies || '')}" placeholder="e.g., Penicillin, Peanuts (or leave blank)">
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <a href="/patients/${patient.id}" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `;

  return layout({ title: 'Edit Patient', body: content, user });
}