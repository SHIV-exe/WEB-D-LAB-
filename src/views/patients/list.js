// src/views/patients/list.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderPatientList({ user, patients, searchQuery = '', statusFilter = '' }) {
  const content = html`
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>Patient Directory</h1>
        <p>Manage and view all registered patients.</p>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <a href="/patients/export" class="btn btn-secondary">Export CSV</a>
        <a href="/patients/new" class="btn btn-primary">+ Register Patient</a>
      </div>
    </div>

    <form action="/patients" method="GET" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; max-width: 600px;">
      <input type="text" name="search" class="form-control" placeholder="Search by name or MRN..." value="${searchQuery}">
      
      <select name="status" class="form-control" style="width: auto;">
        <option value="">All Statuses</option>
        <option value="1" ${statusFilter === '1' ? 'selected' : ''}>Active</option>
        <option value="0" ${statusFilter === '0' ? 'selected' : ''}>Discharged</option>
      </select>

      <button type="submit" class="btn btn-primary">Filter</button>
      ${(searchQuery || statusFilter) ? raw(html`<a href="/patients" class="btn btn-secondary">Clear</a>`) : ''}
    </form>

    <div class="card" style="background: white; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; padding: 0;">
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
                No patients found matching your criteria.
              </td>
            </tr>
          `) : raw(patients.map(patient => html`
            <tr style="${patient.is_active === 0 ? 'opacity: 0.65; background-color: #f8fafc;' : ''}">
              <td><strong>${patient.mrn}</strong></td>
              <td>${patient.first_name} ${patient.last_name}</td>
              <td>${patient.dob || 'N/A'}</td>
              <td>${patient.sex || 'N/A'}</td>
              <td>${patient.phone || 'N/A'}</td>
              <td>
                ${patient.is_active === 0
                  ? raw(html`<span style="background: #f1f5f9; color: var(--text-muted); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Discharged</span>`)
                  : raw(html`<span style="background: #dcfce7; color: #15803d; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Active</span>`)}
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