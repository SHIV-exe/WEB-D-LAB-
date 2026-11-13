// server.js
import http from 'node:http';
import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';

import './src/db/index.js'; 

import { handleRequest, get, post } from './src/router.js';
import { sendHtml, redirect, parseCookies, sendError } from './src/lib/http.js';
import { getSession } from './src/auth/sessions.js';
import { hasPermission } from './src/auth/rbac.js';

import { showDashboard } from './src/routes/dashboard.routes.js';
import { showLoginPage, handleLoginPost, handleLogout } from './src/routes/auth.routes.js';
import { 
  showPatientList, showNewPatientForm, handleCreatePatient, showPatientDetail,
  showEditPatientForm, handleUpdatePatient, handleDischargePatient
} from './src/routes/patients.routes.js';
import { showNewEncounterForm, handleCreateEncounter } from './src/routes/encounters.routes.js';
import { 
  showInfrastructure, handleUpdateEquipmentStatus, showNewBedForm, handleCreateBed, showNewEquipmentForm, handleCreateEquipment
} from './src/routes/infrastructure.routes.js';
import { showInventory, handleUpdateQuantity } from './src/routes/inventory.routes.js';
import { showMaintenanceList, showNewMaintenanceForm, handleCreateTicket, handleUpdateTicketStatus } from './src/routes/maintenance.routes.js';
import { showAuditLog } from './src/routes/audit.routes.js';
import { showUserList, showNewUserForm, handleCreateUser } from './src/routes/users.routes.js';

try { process.loadEnvFile(); } catch (err) {}

const PORT = process.env.PORT || 3000;

export function requirePermission(req, res, action, handler) {
  const cookies = parseCookies(req);
  const session = getSession(cookies.session_id);

  if (!session) return redirect(res, '/login');
  if (!hasPermission(session.role, action)) return sendError(res, 403, 'Access Denied', 'You do not have permission to view this page.', session);
  
  req.user = session;
  handler(req, res);
}

get('/', (req, res) => redirect(res, '/dashboard'));

get('/login', showLoginPage);
post('/login', handleLoginPost);
post('/logout', handleLogout);

get('/dashboard', (req, res) => requirePermission(req, res, 'view_dashboard', showDashboard));

get('/patients', (req, res) => requirePermission(req, res, 'view_patients', showPatientList));
get('/patients/new', (req, res) => requirePermission(req, res, 'create_patients', showNewPatientForm));
post('/patients/new', (req, res) => requirePermission(req, res, 'create_patients', handleCreatePatient));
get('/patients/:id', (req, res) => requirePermission(req, res, 'view_patients', showPatientDetail));
get('/patients/:id/edit', (req, res) => requirePermission(req, res, 'edit_patients', showEditPatientForm));
post('/patients/:id/edit', (req, res) => requirePermission(req, res, 'edit_patients', handleUpdatePatient));
post('/patients/:id/discharge', (req, res) => requirePermission(req, res, 'edit_patients', handleDischargePatient));

get('/patients/:id/encounters/new', (req, res) => requirePermission(req, res, 'create_encounters', showNewEncounterForm));
post('/patients/:id/encounters/new', (req, res) => requirePermission(req, res, 'create_encounters', handleCreateEncounter));

// Infrastructure Routes
get('/infrastructure', (req, res) => requirePermission(req, res, 'view_infrastructure', showInfrastructure));
post('/infrastructure/equipment/:id/status', (req, res) => requirePermission(req, res, 'edit_infrastructure', handleUpdateEquipmentStatus));
get('/infrastructure/beds/new', (req, res) => requirePermission(req, res, 'edit_infrastructure', showNewBedForm));
post('/infrastructure/beds/new', (req, res) => requirePermission(req, res, 'edit_infrastructure', handleCreateBed));
get('/infrastructure/equipment/new', (req, res) => requirePermission(req, res, 'edit_infrastructure', showNewEquipmentForm));
post('/infrastructure/equipment/new', (req, res) => requirePermission(req, res, 'edit_infrastructure', handleCreateEquipment));

get('/inventory', (req, res) => requirePermission(req, res, 'view_inventory', showInventory));
post('/inventory/:id/update', (req, res) => requirePermission(req, res, 'edit_inventory', handleUpdateQuantity));

get('/maintenance', (req, res) => requirePermission(req, res, 'view_maintenance', showMaintenanceList));
get('/maintenance/new', (req, res) => requirePermission(req, res, 'create_maintenance', showNewMaintenanceForm));
post('/maintenance/new', (req, res) => requirePermission(req, res, 'create_maintenance', handleCreateTicket));
post('/maintenance/:id/status', (req, res) => requirePermission(req, res, 'edit_maintenance', handleUpdateTicketStatus));

get('/audit', (req, res) => requirePermission(req, res, 'view_audit', showAuditLog));

get('/users', (req, res) => requirePermission(req, res, 'view_users', showUserList));
get('/users/new', (req, res) => requirePermission(req, res, 'create_users', showNewUserForm));
post('/users/new', (req, res) => requirePermission(req, res, 'create_users', handleCreateUser));

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/css/') || req.url.startsWith('/js/') || req.url.startsWith('/img/')) {
    const filePath = path.join(process.cwd(), 'public', req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('File not found'); return; }
      const ext = path.extname(filePath);
      const mimeTypes = { '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(data);
    });
    return;
  }
  handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});