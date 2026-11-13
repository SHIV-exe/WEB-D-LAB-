// src/views/dashboard/index.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderDashboard({ user, stats, recentEncounters, lowStockItems, brokenEquipmentList }) {
  const content = html`
    <div class="page-header">
      <h1>Welcome, ${user.full_name}</h1>
      <p>You are logged in as a <strong>${user.role}</strong>.</p>
    </div>

    <div class="dashboard-grid">
      <div class="stat-card">
        <h2>Total Patients</h2>
        <p class="stat-number">${stats.totalPatients}</p>
      </div>
      <div class="stat-card">
        <h2>Available Beds</h2>
        <p class="stat-number">${stats.availableBeds}</p>
      </div>
      <div class="stat-card">
        <h2>Equipment Issues</h2>
        <p class="stat-number">${stats.brokenEquipment}</p>
      </div>
    </div>

    <!-- NEW: Live Activity & Alerts -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
      
      <!-- Recent Encounters -->
      <div class="card" style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow);">
        <h2 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Recent Visits</h2>
        ${recentEncounters.length === 0 ? raw(html`<p style="color: var(--text-muted);">No recent visits.</p>`) : raw(recentEncounters.map(enc => html`
          <div style="border-bottom: 1px solid var(--bg-color); padding: 0.75rem 0; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>${enc.patient_name}</strong>
              <p style="font-size: 0.875rem; color: var(--text-muted);">${enc.chief_complaint} - ${enc.diagnosis || 'Pending'}</p>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted); text-align: right;">
              ${new Date(enc.started_at).toLocaleDateString()}<br>
              ${enc.doctor_name}
            </span>
          </div>
        `).join(''))}
      </div>

      <!-- System Alerts -->
      <div class="card" style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow); border-top: 4px solid var(--danger-color);">
        <h2 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; color: var(--danger-color);">⚠️ System Alerts</h2>
        
        <h3 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;">Equipment Down</h3>
        ${brokenEquipmentList.length === 0 ? raw(html`<p style="font-size: 0.875rem; color: var(--success-color); margin-bottom: 1rem;">All equipment operational.</p>`) : raw(brokenEquipmentList.map(eq => html`
          <p style="font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>${eq.name}</strong> (${eq.location})</p>
        `).join(''))}

        <h3 style="font-size: 0.9rem; color: var(--text-muted); margin-top: 1.5rem; margin-bottom: 0.5rem;">Low Stock Inventory</h3>
        ${lowStockItems.length === 0 ? raw(html`<p style="font-size: 0.875rem; color: var(--success-color);">All supplies stocked.</p>`) : raw(lowStockItems.map(item => html`
          <p style="font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>${item.item_name}</strong> - Only ${item.quantity} left!</p>
        `).join(''))}
      </div>

    </div>
  `;

  return layout({
    title: 'Dashboard',
    body: content,
    user
  });
}