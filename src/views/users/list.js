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
                  ? raw(html`<span style="color: var(--success-color); font-weight: bold;">Active</span>`)
                  : raw(html`<span style="color: var(--danger-color); font-weight: bold;">Inactive</span>`)}
              </td>
            </tr>
          `).join(''))}
        </tbody>
      </table>
    </div>
  `;

  return layout({ title: 'Staff Management', body: content, user });
}