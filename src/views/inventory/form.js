// src/views/inventory/form.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderInventoryForm({ user, error = null }) {
  const content = html`
    <div class="page-header">
      <h1>Add Inventory Item</h1>
      <p>Register new medical supplies or medications.</p>
    </div>

    <div class="card" style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); max-width: 800px;">
      ${error ? raw(html`<div class="alert-error">${error}</div>`) : ''}

      <form action="/inventory/new" method="POST">
        <div class="form-group">
          <label for="item_name">Item Name *</label>
          <input type="text" id="item_name" name="item_name" class="form-control" required placeholder="e.g., Amoxicillin, Surgical Masks">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label for="category">Category</label>
            <input type="text" id="category" name="category" class="form-control" placeholder="e.g., Medication, PPE">
          </div>
          <div class="form-group">
            <label for="location">Location</label>
            <input type="text" id="location" name="location" class="form-control" placeholder="e.g., Pharmacy, Storage A">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label for="quantity">Initial Quantity *</label>
            <input type="number" id="quantity" name="quantity" class="form-control" required min="0" value="0">
          </div>
          <div class="form-group">
            <label for="unit">Unit (e.g., boxes, vials)</label>
            <input type="text" id="unit" name="unit" class="form-control" placeholder="e.g., vials">
          </div>
          <div class="form-group">
            <label for="reorder_level">Reorder Level (Alert)</label>
            <input type="number" id="reorder_level" name="reorder_level" class="form-control" min="0" value="10">
          </div>
        </div>

        <div class="form-group">
          <label for="expiry_date">Expiry Date</label>
          <input type="date" id="expiry_date" name="expiry_date" class="form-control">
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <button type="submit" class="btn btn-primary">Save Item</button>
          <a href="/inventory" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `;

  return layout({ title: 'Add Inventory Item', body: content, user });
}