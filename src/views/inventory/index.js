// src/views/inventory/index.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderInventory({ user, inventory }) {
  const content = html`
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>Hospital Inventory</h1>
        <p>Track medical supplies, equipment parts, and medications.</p>
      </div>
      <a href="/inventory/new" class="btn btn-primary">+ Add Item</a>
    </div>

    <div class="card" style="background: white; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; padding: 0;">
      <table class="table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Location</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Update Stock</th>
          </tr>
        </thead>
        <tbody>
          ${inventory.length === 0 ? raw(html`
            <tr>
              <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No inventory items found.
              </td>
            </tr>
          `) : raw(inventory.map(item => {
            const isLowStock = item.quantity <= item.reorder_level;
            
            return html`
              <tr>
                <td><strong>${item.item_name}</strong></td>
                <td>${item.category || 'N/A'}</td>
                <td>${item.location || 'N/A'}</td>
                <td style="font-weight: bold; color: ${isLowStock ? 'var(--danger-color)' : 'inherit'};">
                  ${item.quantity} ${item.unit || ''}
                </td>
                <td>
                  ${isLowStock 
                    ? raw(html`<span style="background: #f8d7da; color: #842029; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">LOW STOCK</span>`)
                    : raw(html`<span style="background: #d1e7dd; color: #0f5132; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">OK</span>`)
                  }
                </td>
                <td>
                  <form action="/inventory/${item.id}/update" method="POST" style="display: flex; gap: 0.5rem;">
                    <input type="number" name="quantity" value="${item.quantity}" class="form-control" style="width: 80px; padding: 0.25rem;">
                    <button type="submit" class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">Update</button>
                  </form>
                </td>
              </tr>
            `;
          }).join(''))}
        </tbody>
      </table>
    </div>
  `;

  return layout({
    title: 'Inventory',
    body: content,
    user
  });
}