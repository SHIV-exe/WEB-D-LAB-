// src/views/audit/index.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderAuditLog({ user, logs }) {
  const content = html`
    <div class="page-header">
      <h1>System Audit Log</h1>
      <p>Track who is accessing and modifying hospital data.</p>
    </div>

    <div class="card" style="background: white; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden;">
      <table class="table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Entity ID</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          ${logs.length === 0 ? raw(html`
            <tr>
              <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No system activity recorded yet.
              </td>
            </tr>
          `) : raw(logs.map(log => html`
            <tr>
              <td style="font-size: 0.875rem; color: var(--text-muted);">${new Date(log.timestamp).toLocaleString()}</td>
              <td><strong>${log.user_name}</strong></td>
              <td><span style="background: #f1f5f9; border: 1px solid var(--border-color); color: #334155; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; font-size: 0.8rem; font-weight: 600;">${log.action}</span></td>
              <td>${log.entity}</td>
              <td>${log.entity_id || '-'}</td>
              <td style="font-size: 0.875rem; color: var(--text-muted);">${log.ip_address}</td>
            </tr>
          `).join(''))}
        </tbody>
      </table>
    </div>
  `;

  return layout({
    title: 'Audit Log',
    body: content,
    user
  });
}