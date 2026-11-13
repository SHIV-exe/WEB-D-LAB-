// src/lib/audit.js
import { run } from '../db/index.js';

export function logAction(userId, action, entity, entityId, req) {
  // Get the user's IP address (or 'unknown' if it's not available)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  
  run(
    'INSERT INTO audit_log (user_id, action, entity, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)',
    [userId, action, entity, entityId, ip]
  );
}