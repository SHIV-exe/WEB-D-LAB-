// src/views/maintenance/index.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderMaintenanceList({ user, tickets, statusFilter = '' }) {
  const content = html`
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>Maintenance Tickets</h1>
        <p>Track and resolve issues with hospital equipment.</p>
      </div>
      <a href="/maintenance/new" class="btn btn-primary">+ Report Issue</a>
    </div>

    <form action="/maintenance" method="GET" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; max-width: 400px;">
      <select name="status" class="form-control">
        <option value="">All Tickets</option>
        <option value="open" ${statusFilter === 'open' ? 'selected' : ''}>Open</option>
        <option value="in_progress" ${statusFilter === 'in_progress' ? 'selected' : ''}>In Progress</option>
        <option value="resolved" ${statusFilter === 'resolved' ? 'selected' : ''}>Resolved</option>
      </select>
      <button type="submit" class="btn btn-primary">Filter</button>
      ${statusFilter ? raw(html`<a href="/maintenance" class="btn btn-secondary">Clear</a>`) : ''}
    </form>

    <div class="card" style="background: white; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; padding: 0;">
      <table class="table">
        <thead>
          <tr>
            <th>Equipment</th>
            <th>Issue</th>
            <th>Priority</th>
            <th>Reported By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${tickets.length === 0 ? raw(html`
            <tr>
              <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No maintenance tickets found.
              </td>
            </tr>
          `) : raw(tickets.map(ticket => {
            let priorityColor = 'var(--text-main)';
            if (ticket.priority === 'urgent') priorityColor = 'var(--danger-color)';
            if (ticket.priority === 'high') priorityColor = '#fd7e14'; 
            
            const isResolved = ticket.status === 'resolved';
            const rowStyle = isResolved ? 'opacity: 0.6; background-color: #f8f9fa;' : '';

            return html`
              <tr style="${rowStyle}">
                <td>
                  <strong>${ticket.equipment_name}</strong>
                  <br>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">
                    SN: ${ticket.serial_number || 'N/A'} | ${ticket.location}
                  </span>
                </td>
                <td>${ticket.issue}</td>
                <td style="color: ${priorityColor}; font-weight: bold; text-transform: uppercase; font-size: 0.875rem;">
                  ${ticket.priority}
                </td>
                <td>${ticket.reporter_name}</td>
                <td>
                  <span style="background: ${isResolved ? '#e2e3e5' : '#fff3cd'}; color: ${isResolved ? '#383d41' : '#664d03'}; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase;">
                    ${ticket.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  ${isResolved ? raw(html`
                    <span style="font-size: 0.875rem; color: var(--text-muted); font-weight: bold;">Ticket Closed</span>
                  `) : raw(html`
                    <form action="/maintenance/${ticket.id}/status" method="POST" style="display: flex; gap: 0.5rem;">
                      <select name="status" class="form-control" style="width: auto; padding: 0.25rem;">
                        <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>Open</option>
                        <option value="in_progress" ${ticket.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                      </select>
                      <button type="submit" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">Update</button>
                    </form>
                  `)}
                </td>
              </tr>
            `;
          }).join(''))}
        </tbody>
      </table>
    </div>
  `;

  return layout({ title: 'Maintenance', body: content, user });
}