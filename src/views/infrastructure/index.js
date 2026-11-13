// src/views/infrastructure/index.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderInfrastructure({ user, beds, equipment }) {
  const content = html`
    <div class="page-header">
      <h1>Infrastructure & Assets</h1>
      <p>Manage hospital beds, equipment, and maintenance status.</p>
    </div>

    <!-- BEDS SECTION -->
    <h2 style="margin-bottom: 1rem;">Bed Management</h2>
    <div class="dashboard-grid" style="margin-bottom: 3rem;">
      ${raw(beds.map(bed => {
        let statusColor = 'var(--success-color)';
        let statusBg = '#d1e7dd';
        if (bed.status === 'occupied') { statusColor = 'var(--danger-color)'; statusBg = '#f8d7da'; }
        if (bed.status === 'maintenance') { statusColor = '#664d03'; statusBg = '#fff3cd'; }
        
        return html`
          <div class="stat-card" style="border-left-color: ${statusColor};">
            <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${bed.ward} - Room ${bed.room}${bed.bed_number}</h3>
            <span style="display: inline-block; background: ${statusBg}; color: ${statusColor}; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; font-weight: bold; margin-top: 0.5rem;">
              ${bed.status}
            </span>
          </div>
        `;
      }).join(''))}
    </div>

    <!-- EQUIPMENT SECTION -->
    <h2 style="margin-bottom: 1rem;">Medical Equipment</h2>
    <div class="card" style="background: white; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden;">
      <table class="table">
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>Category</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${raw(equipment.map(item => {
            let badgeColor = item.status === 'working' ? 'var(--success-color)' : 'var(--danger-color)';
            
            return html`
              <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.category || 'N/A'}</td>
                <td>${item.location || 'N/A'}</td>
                <td>
                  <span style="color: ${badgeColor}; font-weight: bold; text-transform: capitalize;">
                    ${item.status}
                  </span>
                </td>
                <td>
                  <form action="/infrastructure/equipment/${item.id}/status" method="POST" style="display: flex; gap: 0.5rem;">
                    <select name="status" class="form-control" style="width: auto; padding: 0.25rem;">
                      <option value="working" ${item.status === 'working' ? 'selected' : ''}>Working</option>
                      <option value="broken" ${item.status === 'broken' ? 'selected' : ''}>Broken</option>
                      <option value="maintenance" ${item.status === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                    </select>
                    <button type="submit" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">Update</button>
                  </form>
                </td>
              </tr>
            `;
          }).join(''))}
        </tbody>
      </table>
    </div>
  `;

  return layout({
    title: 'Infrastructure',
    body: content,
    user
  });
}