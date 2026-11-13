// src/routes/maintenance.routes.js
import { query, run } from '../db/index.js';
import { renderMaintenanceList } from '../views/maintenance/index.js';
import { renderMaintenanceForm } from '../views/maintenance/form.js';
import { sendHtml, redirect, readBody } from '../lib/http.js';

export function showMaintenanceList(req, res) {
  // JOIN to get the equipment name/location, and the reporter's name
  const tickets = query(`
    SELECT t.*, e.name as equipment_name, e.location, u.full_name as reporter_name
    FROM maintenance_tickets t
    JOIN equipment e ON t.equipment_id = e.id
    JOIN users u ON t.reported_by = u.id
    ORDER BY 
      CASE t.priority 
        WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 WHEN 'low' THEN 4 
      END,
      t.created_at DESC
  `);

  sendHtml(res, renderMaintenanceList({ user: req.user, tickets }));
}

export function showNewMaintenanceForm(req, res) {
  // Only fetch equipment that isn't already in maintenance
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
    return sendHtml(res, renderMaintenanceForm({ 
      user: req.user, 
      equipment, 
      error: 'Equipment and issue description are required.' 
    }), 400);
  }

  // 1. Create the ticket
  run(
    'INSERT INTO maintenance_tickets (equipment_id, reported_by, issue, priority) VALUES (?, ?, ?, ?)',
    [equipment_id, req.user.user_id, issue, priority]
  );

  // 2. Automatically mark the equipment as 'maintenance' so it can't be used
  run("UPDATE equipment SET status = 'maintenance' WHERE id = ?", [equipment_id]);

  redirect(res, '/maintenance');
}

export async function handleUpdateTicketStatus(req, res) {
  const ticketId = req.params.id;
  const body = await readBody(req);
  const newStatus = body.get('status');

  if (newStatus) {
    // 1. Update the ticket
    run('UPDATE maintenance_tickets SET status = ?, resolved_at = ? WHERE id = ?', 
      [newStatus, newStatus === 'resolved' ? new Date().toISOString() : null, ticketId]
    );

    // 2. If resolved, set the equipment back to 'working'
    if (newStatus === 'resolved') {
      const ticket = query('SELECT equipment_id FROM maintenance_tickets WHERE id = ?', [ticketId])[0];
      if (ticket) {
        run("UPDATE equipment SET status = 'working' WHERE id = ?", [ticket.equipment_id]);
      }
    }
  }

  redirect(res, '/maintenance');
}