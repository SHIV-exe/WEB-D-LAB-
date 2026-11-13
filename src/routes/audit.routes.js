// src/routes/audit.routes.js
import { query } from '../db/index.js';
import { renderAuditLog } from '../views/audit/index.js';
import { sendHtml } from '../lib/http.js';

export function showAuditLog(req, res) {
  // Fetch the 100 most recent logs, joining with users to get their name
  const logs = query(`
    SELECT a.*, u.full_name as user_name
    FROM audit_log a
    JOIN users u ON a.user_id = u.id
    ORDER BY a.timestamp DESC
    LIMIT 100
  `);

  sendHtml(res, renderAuditLog({ user: req.user, logs }));
}