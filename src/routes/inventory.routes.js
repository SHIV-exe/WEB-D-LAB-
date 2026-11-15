// src/routes/inventory.routes.js
import { query, run } from '../db/index.js';
import { renderInventory } from '../views/inventory/index.js';
import { renderInventoryForm } from '../views/inventory/form.js';
import { sendHtml, redirect, readBody } from '../lib/http.js';

export function showInventory(req, res) {
  const inventory = query('SELECT * FROM inventory ORDER BY category, item_name');
  sendHtml(res, renderInventory({ user: req.user, inventory }));
}

export async function handleUpdateQuantity(req, res) {
  const itemId = req.params.id;
  const body = await readBody(req);
  const newQuantity = parseInt(body.get('quantity'), 10);

  if (!isNaN(newQuantity) && newQuantity >= 0) {
    run('UPDATE inventory SET quantity = ? WHERE id = ?', [newQuantity, itemId]);
  }

  redirect(res, '/inventory');
}

export function showNewInventoryForm(req, res) {
  sendHtml(res, renderInventoryForm({ user: req.user }));
}

export async function handleCreateInventory(req, res) {
  const body = await readBody(req);
  const item_name = body.get('item_name')?.trim();
  const category = body.get('category')?.trim() || null;
  const location = body.get('location')?.trim() || null;
  const quantity = parseInt(body.get('quantity')) || 0;
  const unit = body.get('unit')?.trim() || null;
  const reorder_level = parseInt(body.get('reorder_level')) || 10;
  const expiry_date = body.get('expiry_date') || null;

  if (!item_name) {
    return sendHtml(res, renderInventoryForm({ user: req.user, error: 'Item name is required.' }), 400);
  }

  run(
    'INSERT INTO inventory (item_name, category, location, quantity, unit, reorder_level, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [item_name, category, location, quantity, unit, reorder_level, expiry_date]
  );

  redirect(res, '/inventory');
}