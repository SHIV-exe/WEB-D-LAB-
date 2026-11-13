// src/auth/rbac.js
const PERMISSIONS = {
  admin: ['*'], 
  
  doctor: [
    'view_dashboard', 'view_patients', 'edit_patients', 'create_patients',
    'view_encounters', 'edit_encounters', 'create_encounters',
    'view_infrastructure', 'view_inventory', 'view_audit',
    'view_maintenance', 'create_maintenance' // <-- NEW
  ],
  
  nurse: [
    'view_dashboard', 'view_patients', 'edit_patients',
    'view_encounters', 'edit_encounters',
    'view_infrastructure', 'view_inventory', 'edit_inventory',
    'view_maintenance', 'create_maintenance' // <-- NEW
  ],
  
  reception: [
    'view_dashboard', 'view_patients', 'create_patients', 'edit_patients',
    'view_infrastructure'
  ],
  
  maintenance: [
    'view_dashboard', 'view_infrastructure', 'edit_infrastructure',
    'view_inventory', 'edit_inventory',
    'view_maintenance', 'edit_maintenance' // <-- NEW
  ]
};

export function hasPermission(role, action) {
  if (!role || !PERMISSIONS[role]) {
    return false;
  }
  const allowedActions = PERMISSIONS[role];
  if (allowedActions.includes('*')) {
    return true;
  }
  return allowedActions.includes(action);
}