// src/views/patients/list.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderPatientList({ user, patients, searchQuery = '' }) {
  const content = html`
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>Patient Directory</h1>
        <p>Manage and view all registered patients.</p>
      </div>
      <a href="/patients/new" class="btn btn-primary">+ Register Patient</a>
    </div>

    <form action="/patients" method="GET" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; max-width: 400px;">
      <input type="text" name="search" class="form-control" placeholder="Search by name or MRN..." value="${searchQuery}">
      <button type="submit" class="btn btn-secondary">Search</button>
      ${searchQuery ? raw(html`<a href="/patients" class="btn btn-secondary" style="background: var(--text-muted);">Clear</a>`) : ''}
    </form>

    <div class="card" style="background: white; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden;">
      <table class="table">
        <thead>
          <tr>
            <th>MRN</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Sex</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${patients.length === 0 ? raw(html`
            <tr>
              <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No patients found matching your search.
              </td>
            </tr>
          `) : raw(patients.map(patient => html`
            <tr style="${patient.is_active === 0 ? 'opacity: 0.6; background-color: #f8f9fa;' : ''}">
              <td><strong>${patient.mrn}</strong></td>
              <td>${patient.first_name} ${patient.last_name}</td>
              <td>${patient.dob || 'N/A'}</td>
              <td>${patient.sex || 'N/A'}</td>
              <td>${patient.phone || 'N/A'}</td>
              <td>
                ${patient.is_active === 0
                  ? raw(html`<span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: bold;">Discharged</span>`)
                  : raw(html`<span style="color: var(--success-color); font-size: 0.75rem; text-transform: uppercase; font-weight: bold;">Active</span>`)}
              </td>
              <td>
                <a href="/patients/${patient.id}" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">View</a>
              </td>
            </tr>
          `).join(''))}
        </tbody>
      </table>
    </div>
  `;

  return layout({ title: 'Patients', body: content, user });
}