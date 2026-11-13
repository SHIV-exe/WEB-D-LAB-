// src/auth/sessions.js
import crypto from 'node:crypto';
import { query, run } from '../db/index.js';

// How long a session lasts before they have to log in again (24 hours in milliseconds)
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; 

/**
 * Creates a new session in the database.
 * Returns { sessionId, csrfToken, expiresAt }
 */
export function createSession(userId) {
  const sessionId = crypto.randomUUID(); // Generates a secure random UUID
  const csrfToken = crypto.randomBytes(32).toString('hex'); // Secure random string
  
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  run(
    'INSERT INTO sessions (id, user_id, csrf_token, expires_at) VALUES (?, ?, ?, ?)',
    [sessionId, userId, csrfToken, expiresAt]
  );

  return { sessionId, csrfToken, expiresAt };
}

/**
 * Retrieves a valid session and the associated user from the database.
 * Returns null if the session doesn't exist or is expired.
 */
export function getSession(sessionId) {
  if (!sessionId) return null;

  // Join the sessions and users tables to get the user's role and name
  const rows = query(`
    SELECT s.id, s.user_id, s.csrf_token, s.expires_at, u.role, u.full_name 
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ?
  `, [sessionId]);

  if (rows.length === 0) return null; // Session not found

  const session = rows[0];

  // Check if the session has expired
  if (new Date(session.expires_at) < new Date()) {
    destroySession(sessionId);
    return null;
  }

  return session;
}

/**
 * Deletes a session from the database.
 */
export function destroySession(sessionId) {
  if (!sessionId) return;
  run('DELETE FROM sessions WHERE id = ?', [sessionId]);
}

/**
 * Deletes all expired sessions from the database.
 * (Good for housekeeping, can be called occasionally)
 */
export function cleanExpiredSessions() {
  run('DELETE FROM sessions WHERE expires_at < ?', [new Date().toISOString()]);
}