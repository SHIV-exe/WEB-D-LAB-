// src/routes/infrastructure.routes.js
import { query, run } from '../db/index.js';
import { renderInfrastructure } from '../views/infrastructure/index.js';
import { sendHtml, redirect, readBody } from '../lib/http.js';

export function showInfrastructure(req, res) {
  // Fetch beds sorted by ward and room
  const beds = query('SELECT * FROM beds ORDER BY ward, room, bed_number');
  
  // Fetch equipment sorted by name
  const equipment = query('SELECT * FROM equipment ORDER BY name');

  sendHtml(res, renderInfrastructure({ user: req.user, beds, equipment }));
}

export async function handleUpdateEquipmentStatus(req, res) {
  const equipmentId = req.params.id;
  const body = await readBody(req);
  const newStatus = body.get('status');

  // Update the database
  if (newStatus) {
    run('UPDATE equipment SET status = ? WHERE id = ?', [newStatus, equipmentId]);
  }

  // Redirect back to the infrastructure page
  redirect(res, '/infrastructure');
}