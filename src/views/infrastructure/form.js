// src/views/infrastructure/forms.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderBedForm({ user, error = null }) {
  const content = html`
    <div class="page-header">
      <h1>Add New Bed</h1>
      <p>Register a new hospital bed in the system.</p>
    </div>

    <div class="card" style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); max-width: 600px;">
      ${error ? raw(html`<div class="alert-error">${error}</div>`) : ''}

      <form action="/infrastructure/beds/new" method="POST">
        <div class="form-group">
          <label for="ward">Ward / Department *</label>
          <input type="text" id="ward" name="ward" class="form-control" required placeholder="e.g., ICU, General, Pediatrics">
        </div>
        <div class="form-group">
          <label for="room">Room Number *</label>
          <input type="text" id="room" name="room" class="form-control" required placeholder="e.g., 101">
        </div>
        <div class="form-group">
          <label for="bed_number">Bed Letter/Number *</label>
          <input type="text" id="bed_number" name="bed_number" class="form-control" required placeholder="e.g., A, B, 1">
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <button type="submit" class="btn btn-primary">Add Bed</button>
          <a href="/infrastructure" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `;
  return layout({ title: 'Add Bed', body: content, user });
}

export function renderEquipmentForm({ user, error = null }) {
  const content = html`
    <div class="page-header">
      <h1>Add New Equipment</h1>
      <p>Register a new piece of medical equipment.</p>
    </div>

    <div class="card" style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); max-width: 600px;">
      ${error ? raw(html`<div class="alert-error">${error}</div>`) : ''}

      <form action="/infrastructure/equipment/new" method="POST">
        <div class="form-group">
          <label for="name">Equipment Name *</label>
          <input type="text" id="name" name="name" class="form-control" required placeholder="e.g., Wheelchair, Ventilator">
        </div>
        <div class="form-group">
          <label for="serial_number">Serial Number / Asset Tag</label>
          <input type="text" id="serial_number" name="serial_number" class="form-control" placeholder="e.g., WC-001">
        </div>
        <div class="form-group">
          <label for="category">Category</label>
          <input type="text" id="category" name="category" class="form-control" placeholder="e.g., Mobility, Life Support">
        </div>
        <div class="form-group">
          <label for="location">Location</label>
          <input type="text" id="location" name="location" class="form-control" placeholder="e.g., Storage, ICU">
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <button type="submit" class="btn btn-primary">Add Equipment</button>
          <a href="/infrastructure" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `;
  return layout({ title: 'Add Equipment', body: content, user });
}