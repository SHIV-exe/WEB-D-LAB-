// src/routes/auth.routes.js
import { query } from '../db/index.js';
import { readBody, sendHtml, redirect, parseCookies } from '../lib/http.js';
import { verifyPassword } from '../auth/passwords.js';
import { createSession, destroySession } from '../auth/sessions.js';
import { renderLogin } from '../views/auth/login.js';

// 1. GET /login - Show the form
export function showLoginPage(req, res) {
  sendHtml(res, renderLogin());
}

// 2. POST /login - Check credentials
export async function handleLoginPost(req, res) {
  const body = await readBody(req);
  const username = body.get('username');
  const password = body.get('password');

  // Find the user in the database
  const rows = query('SELECT * FROM users WHERE username = ?', [username]);
  const user = rows[0];

  // Check if user exists AND if the password matches
  // We deliberately use the same error message for both to prevent hackers 
  // from guessing which usernames actually exist.
  if (!user || !verifyPassword(password, user.password_hash, user.password_salt)) {
    return sendHtml(res, renderLogin({ error: 'Invalid username or password.' }), 401);
  }

  // Create a session in the database
  const { sessionId } = createSession(user.id);

  // Set the cookie in the browser
  // HttpOnly: prevents JS from reading the cookie (stops XSS)
  // SameSite=Strict: prevents the cookie from being sent on cross-site requests (stops CSRF)
  // Max-Age=86400: cookie expires in 24 hours
  res.setHeader('Set-Cookie', `session_id=${sessionId}; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400`);
  
  // Send them to the dashboard
  redirect(res, '/dashboard');
}

// 3. POST /logout - Destroy the session
export function handleLogout(req, res) {
  const cookies = parseCookies(req);
  const sessionId = cookies.session_id;

  // If they have a session, delete it from the database
  if (sessionId) {
    destroySession(sessionId);
  }

  // Tell the browser to delete the cookie immediately (Max-Age=0)
  res.setHeader('Set-Cookie', `session_id=; HttpOnly; Path=/; Max-Age=0`);
  
  redirect(res, '/login');
}