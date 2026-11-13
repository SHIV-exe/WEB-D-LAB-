// src/routes/infrastructure.routes.js
import { query, run } from '../db/index.js';
import { renderInfrastructure } from '../views/infrastructure/index.js';
import { renderBedForm, renderEquipmentForm } from '../views/infrastructure/form.js';
import { sendHtml, redirect, readBody } from '../lib/http.js';

export function showInfrastructure(req, res) {
  const beds = query('SELECT * FROM beds ORDER BY ward, room, bed_number');
  const equipment = query('SELECT * FROM equipment ORDER BY name, serial_number');
  sendHtml(res, renderInfrastructure({ user: req.user, beds, equipment }));
}

export async function handleUpdateEquipmentStatus(req, res) {
  const equipmentId = req.params.id;
  const body = await readBody(req);
  const newStatus = body.get('status');
  if (newStatus) {
    run('UPDATE equipment SET status = ? WHERE id = ?', [newStatus, equipmentId]);
  }
  redirect(res, '/infrastructure');
}

export function showNewBedForm(req, res) {
  sendHtml(res, renderBedForm({ user: req.user }));
}

export async function handleCreateBed(req, res) {
  const body = await readBody(req);
  const ward = body.get('ward')?.trim();
  const room = body.get('room')?.trim();
  const bed_number = body.get('bed_number')?.trim();

  if (!ward || !room || !bed_number) {
    return sendHtml(res, renderBedForm({ user: req.user, error: 'All fields are required.' }), 400);
  }

  // Check for duplicates
  const existing = query('SELECT id FROM beds WHERE ward = ? AND room = ? AND bed_number = ?', [ward, room, bed_number]);
  if (existing.length > 0) {
    return sendHtml(res, renderBedForm({ user: req.user, error: 'This bed already exists.' }), 400);
  }

  run('INSERT INTO beds (ward, room, bed_number) VALUES (?, ?, ?)', [ward, room, bed_number]);
  redirect(res, '/infrastructure');
}

export function showNewEquipmentForm(req, res) {
  sendHtml(res, renderEquipmentForm({ user: req.user }));
}

export async function handleCreateEquipment(req, res) {
  const body = await readBody(req);
  const name = body.get('name')?.trim();
  const serial_number = body.get('serial_number')?.trim() || null;
  const category = body.get('category')?.trim() || null;
  const location = body.get('location')?.trim() || null;

  if (!name) {
    return sendHtml(res, renderEquipmentForm({ user: req.user, error: 'Equipment name is required.' }), 400);
  }

  run(
    'INSERT INTO equipment (name, serial_number, category, location) VALUES (?, ?, ?, ?)',
    [name, serial_number, category, location]
  );
  
  redirect(res, '/infrastructure');
}