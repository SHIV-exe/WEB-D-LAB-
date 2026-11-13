// src/views/users/form.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderUserForm({ user, error = null }) {
  const content = html`
    <div class="page-header">
      <h1>Add New Staff Account</h1>
      <p>Create credentials for a new hospital employee.</p>
    </div>

    <div class="card" style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); max-width: 600px;">
      ${error ? raw(html`<div class="alert-error">${error}</div>`) : ''}

      <form action="/users/new" method="POST">
        <div class="form-group">
          <label for="full_name">Full Name *</label>
          <input type="text" id="full_name" name="full_name" class="form-control" required placeholder="e.g., Dr. Jane Doe">
        </div>

        <div class="form-group">
          <label for="username">Username *</label>
          <input type="text" id="username" name="username" class="form-control" required placeholder="e.g., jdoe123">
        </div>

        <div class="form-group">
          <label for="password">Temporary Password *</label>
          <input type="password" id="password" name="password" class="form-control" required minlength="6" placeholder="Minimum 6 characters">
        </div>

        <div class="form-group">
          <label for="role">Role *</label>
          <select id="role" name="role" class="form-control" required>
            <option value="">Select a role...</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="reception">Reception</option>
            <option value="maintenance">Maintenance</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <button type="submit" class="btn btn-primary">Create Account</button>
          <a href="/users" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `;

  return layout({ title: 'Add Staff', body: content, user });
}