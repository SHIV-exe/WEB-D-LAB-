// src/views/layout.js
import { html, raw } from '../lib/html.js';
import { hasPermission } from '../auth/rbac.js';

export function layout({ title, body, user }) {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Pulse</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav class="navbar">
    <div class="nav-brand">
      <a href="/" class="brand-link">
        <span class="brand-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </span>
        <span class="brand-name">Pulse</span>
      </a>
    </div>
    
    <div class="nav-links">
      ${user ? raw(html`
        <a href="/dashboard">Dashboard</a>
        
        ${hasPermission(user.role, 'view_patients') 
          ? raw(html`<a href="/patients">Patients</a>`) : ''}
          
        ${hasPermission(user.role, 'view_infrastructure') 
          ? raw(html`<a href="/infrastructure">Infrastructure</a>`) : ''}

        ${hasPermission(user.role, 'view_inventory') 
          ? raw(html`<a href="/inventory">Inventory</a>`) : ''}

        ${hasPermission(user.role, 'view_maintenance') 
          ? raw(html`<a href="/maintenance">Maintenance</a>`) : ''}

        ${hasPermission(user.role, 'view_users') 
          ? raw(html`<a href="/users">Staff</a>`) : ''}

        ${hasPermission(user.role, 'view_audit') 
          ? raw(html`<a href="/audit">Audit Log</a>`) : ''}
        
        <span class="user-badge">
          ${user.full_name} (${user.role})
        </span>
        
        <form action="/logout" method="POST" class="logout-form">
          <button type="submit" class="btn-logout">Logout</button>
        </form>
      `) : raw(html`
        <a href="/login">Login</a>
      `)}
    </div>
  </nav>

  <main class="container">
    ${raw(body)}
  </main>

  <!-- Load the client-side JS here -->
  <script src="/js/app.js"></script>
</body>
</html>`;
}