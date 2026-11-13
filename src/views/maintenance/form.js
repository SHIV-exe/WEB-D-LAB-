// src/views/maintenance/form.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderMaintenanceForm({ user, equipment, error = null }) {
  const content = html`
    <div class="page-header">
      <h1>Report Equipment Issue</h1>
      <p>Submit a new maintenance ticket.</p>
    </div>

    <div class="card" style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); max-width: 800px;">
      ${error ? html`<div class="alert-error">${error}</div>` : ''}

      <form action="/maintenance/new" method="POST">
        <div class="form-group">
          <label for="equipment_id">Select Equipment *</label>
          <select id="equipment_id" name="equipment_id" class="form-control" required>
            <option value="">-- Choose Equipment --</option>
            ${raw(equipment.map(eq => html`
              <option value="${eq.id}">${eq.name} (${eq.location || 'Unknown Location'})</option>
            `).join(''))}
          </select>
        </div>

        <div class="form-group">
          <label for="issue">Describe the Issue *</label>
          <textarea id="issue" name="issue" class="form-control" rows="3" required placeholder="e.g., Screen won't turn on, strange noise from motor..."></textarea>
        </div>

        <div class="form-group">
          <label for="priority">Priority</label>
          <select id="priority" name="priority" class="form-control">
            <option value="low">Low</option>
            <option value="normal" selected>Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent (Life Support)</option>
          </select>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <button type="submit" class="btn btn-primary">Submit Ticket</button>
          <a href="/maintenance" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `;

  return layout({
    title: 'New Maintenance Ticket',
    body: content,
    user
  });
}