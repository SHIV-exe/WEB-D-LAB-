// src/views/infrastructure/index.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderInfrastructure({ user, beds, equipment }) {
  const content = html`
    <div class="page-header">
      <h1>Infrastructure & Assets</h1>
      <p>Manage hospital beds, equipment, and maintenance status.</p>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <h2 style="margin: 0;">Bed Management</h2>
      <a href="/infrastructure/beds/new" class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">+ Add Bed</a>
    </div>
    
    <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 3rem;">
      ${raw(beds.map(bed => {
        let statusColor = '#15803d';
        let statusBg = '#dcfce7';
        if (bed.status === 'occupied') { statusColor = '#b91c1c'; statusBg = '#fee2e2'; }
        if (bed.status === 'maintenance') { statusColor = '#b45309'; statusBg = '#fef3c7'; }
        
        return html`
          <div class="stat-card" style="border-left-color: ${statusColor}; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1rem; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${bed.ward} - ${bed.room}${bed.bed_number}
              </h3>
              
              ${bed.patient_id ? raw(html`
                <p style="font-size: 0.8rem; color: var(--primary-color); font-weight: 600; margin-bottom: 0.5rem;">
                  <a href="/patients/${bed.patient_id}" style="text-decoration: none;">👤 ${bed.first_name} ${bed.last_name}</a>
                </p>
              `) : ''}
            </div>
            
            <span style="display: inline-block; background: ${statusBg}; color: ${statusColor}; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.65rem; text-transform: uppercase; font-weight: bold; margin-top: 0.5rem; width: fit-content;">
              ${bed.status}
            </span>
          </div>
        `;
      }).join(''))}
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <h2 style="margin: 0;">Medical Equipment</h2>
      <a href="/infrastructure/equipment/new" class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">+ Add Equipment</a>
    </div>
    
    <div class="card" style="background: white; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; padding: 0;">
      <table class="table">
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>Serial Number</th>
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
                <td><strong>${item.name}</strong><br><span style="font-size: 0.75rem; color: var(--text-muted);">${item.category || 'N/A'}</span></td>
                <td>${item.serial_number || 'N/A'}</td>
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

  return layout({ title: 'Infrastructure', body: content, user });
}