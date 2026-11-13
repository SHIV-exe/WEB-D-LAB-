// src/routes/dashboard.routes.js
import { query } from '../db/index.js';
import { renderDashboard } from '../views/dashboard/index.js';
import { sendHtml } from '../lib/http.js';

export function showDashboard(req, res) {
  // 1. Basic Stats
  const totalPatients = query('SELECT COUNT(*) as count FROM patients')[0].count;
  const availableBeds = query("SELECT COUNT(*) as count FROM beds WHERE status = 'available'")[0].count;
  const brokenEquipment = query("SELECT COUNT(*) as count FROM equipment WHERE status = 'broken'")[0].count;

  const stats = { totalPatients, availableBeds, brokenEquipment };

  // 2. Fetch Recent Encounters (Last 5)
  const recentEncounters = query(`
    SELECT e.id, e.started_at, e.chief_complaint, e.diagnosis, 
           p.first_name || ' ' || p.last_name as patient_name,
           u.full_name as doctor_name
    FROM encounters e
    JOIN patients p ON e.patient_id = p.id
    JOIN users u ON e.doctor_id = u.id
    ORDER BY e.started_at DESC
    LIMIT 5
  `);

  // 3. Fetch System Alerts
  const lowStockItems = query('SELECT item_name, quantity, reorder_level FROM inventory WHERE quantity <= reorder_level');
  const brokenEquipmentList = query("SELECT name, location FROM equipment WHERE status = 'broken'");

  // 4. Render the view
  const html = renderDashboard({
    user: req.user,
    stats: stats,
    recentEncounters,
    lowStockItems,
    brokenEquipmentList
  });

  sendHtml(res, html);
}