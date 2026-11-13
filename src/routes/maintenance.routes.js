// src/routes/maintenance.routes.js
import { query, run } from '../db/index.js';
import { renderMaintenanceList } from '../views/maintenance/index.js';
import { renderMaintenanceForm } from '../views/maintenance/form.js';
import { sendHtml, redirect, readBody, sendError } from '../lib/http.js'; // Added sendError

export function showMaintenanceList(req, res) {
  const statusFilter = req.query.get('status') || '';

  let sql = `
    SELECT t.*, e.name as equipment_name, e.serial_number, e.location, u.full_name as reporter_name
    FROM maintenance_tickets t
    JOIN equipment e ON t.equipment_id = e.id
    JOIN users u ON t.reported_by = u.id
    WHERE 1=1
  `;
  const params = [];

  if (statusFilter) {
    sql += ' AND t.status = ?';
    params.push(statusFilter);
  }

  sql += `
    ORDER BY 
      CASE t.priority 
        WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 WHEN 'low' THEN 4 
      END,
      t.created_at DESC
  `;

  const tickets = query(sql, params);
  sendHtml(res, renderMaintenanceList({ user: req.user, tickets, statusFilter }));
}

export function showNewMaintenanceForm(req, res) {
  const equipment = query("SELECT * FROM equipment WHERE status != 'maintenance'");
  sendHtml(res, renderMaintenanceForm({ user: req.user, equipment }));
}

export async function handleCreateTicket(req, res) {
  const body = await readBody(req);
  const equipment_id = body.get('equipment_id');
  const issue = body.get('issue')?.trim();
  const priority = body.get('priority') || 'normal';

  if (!equipment_id || !issue) {
    const equipment = query("SELECT * FROM equipment WHERE status != 'maintenance'");
    return sendHtml(res, renderMaintenanceForm({ user: req.user, equipment, error: 'Equipment and issue description are required.' }), 400);
  }

  run(
    'INSERT INTO maintenance_tickets (equipment_id, reported_by, issue, priority) VALUES (?, ?, ?, ?)',
    [equipment_id, req.user.user_id, issue, priority]
  );

  run("UPDATE equipment SET status = 'maintenance' WHERE id = ?", [equipment_id]);
  redirect(res, '/maintenance');
}

export async function handleUpdateTicketStatus(req, res) {
  const ticketId = req.params.id;
  const body = await readBody(req);
  const newStatus = body.get('status');

  // Fetch the current ticket to check its state
  const ticket = query('SELECT status, equipment_id FROM maintenance_tickets WHERE id = ?', [ticketId])[0];

  if (!ticket) {
    return sendError(res, 404, 'Not Found', 'Ticket not found.', req.user);
  }

  // BLOCK: Prevent reopening a resolved ticket
  if (ticket.status === 'resolved' && newStatus !== 'resolved') {
    return sendError(res, 400, 'Invalid Action', 'Resolved tickets cannot be reopened. Please create a new ticket if the issue persists.', req.user);
  }

  if (newStatus) {
    run('UPDATE maintenance_tickets SET status = ?, resolved_at = ? WHERE id = ?', 
      [newStatus, newStatus === 'resolved' ? new Date().toISOString() : null, ticketId]
    );

    // If resolved, set the equipment back to 'working'
    if (newStatus === 'resolved') {
      run("UPDATE equipment SET status = 'working' WHERE id = ?", [ticket.equipment_id]);
    }
  }

  redirect(res, '/maintenance');
}