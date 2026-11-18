// src/views/users/list.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderUserList({ user, users }) {
  const content = html`
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>Staff Management</h1>
        <p>Manage hospital staff accounts and roles.</p>
      </div>
      <a href="/users/new" class="btn btn-primary">+ Add Staff Account</a>
    </div>

    <div class="card" style="background: white; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden;">
      <table class="table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${raw(users.map(u => html`
            <tr>
              <td><strong>${u.full_name}</strong></td>
              <td>${u.username}</td>
              <td style="text-transform: capitalize;">${u.role}</td>
              <td>
                ${u.is_active 
                  ? raw(html`<span style="background: #dcfce7; color: #15803d; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Active</span>`)
                  : raw(html`<span style="background: #fee2e2; color: #b91c1c; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Inactive</span>`)}
              </td>
            </tr>
          `).join(''))}
        </tbody>
      </table>
    </div>
  `;

  return layout({ title: 'Staff Management', body: content, user });
}