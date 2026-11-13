// src/routes/inventory.routes.js
import { query, run } from '../db/index.js';
import { renderInventory } from '../views/inventory/index.js';
import { sendHtml, redirect, readBody } from '../lib/http.js';

export function showInventory(req, res) {
  // Fetch all items, sorted by category and then name
  const inventory = query('SELECT * FROM inventory ORDER BY category, item_name');
  sendHtml(res, renderInventory({ user: req.user, inventory }));
}

export async function handleUpdateQuantity(req, res) {
  const itemId = req.params.id;
  const body = await readBody(req);
  const newQuantity = parseInt(body.get('quantity'), 10);

  // Server-side validation: ensure it's a valid number and not negative
  if (!isNaN(newQuantity) && newQuantity >= 0) {
    run('UPDATE inventory SET quantity = ? WHERE id = ?', [newQuantity, itemId]);
  }

  redirect(res, '/inventory');
}