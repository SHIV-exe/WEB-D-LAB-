// src/routes/users.routes.js
import { query, run } from '../db/index.js';
import { renderUserList } from '../views/users/list.js';
import { renderUserForm } from '../views/users/form.js';
import { sendHtml, redirect, readBody } from '../lib/http.js';
import { hashPassword } from '../auth/passwords.js';
import { logAction } from '../lib/audit.js';

export function showUserList(req, res) {
  const users = query('SELECT id, full_name, username, role, is_active FROM users ORDER BY full_name ASC');
  sendHtml(res, renderUserList({ user: req.user, users }));
}

export function showNewUserForm(req, res) {
  sendHtml(res, renderUserForm({ user: req.user }));
}

export async function handleCreateUser(req, res) {
  const body = await readBody(req);
  const full_name = body.get('full_name')?.trim();
  const username = body.get('username')?.trim();
  const password = body.get('password');
  const role = body.get('role');

  if (!full_name || !username || !password || !role) {
    return sendHtml(res, renderUserForm({ user: req.user, error: 'All fields are required.' }), 400);
  }

  // Check if username is already taken
  const existing = query('SELECT id FROM users WHERE username = ?', [username]);
  if (existing.length > 0) {
    return sendHtml(res, renderUserForm({ user: req.user, error: 'Username is already taken.' }), 400);
  }

  // Hash the password using our scrypt function from File #11
  const { hash, salt } = hashPassword(password);

  // Insert the new user
  const result = run(
    'INSERT INTO users (full_name, username, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)',
    [full_name, username, hash, salt, role]
  );

  // Log the action
  logAction(req.user.user_id, 'CREATE_USER', 'users', result.lastInsertRowid, req);

  redirect(res, '/users');
}