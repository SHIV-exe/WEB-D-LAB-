// src/views/errors/error.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderError({ user, status, title, message }) {
  // Determine the color based on the status code
  let color = 'var(--danger-color)'; // Red for 500
  if (status === 403) color = '#fd7e14'; // Orange for Forbidden
  if (status === 404) color = 'var(--primary-color)'; // Blue for Not Found

  const content = html`
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;">
      <h1 style="font-size: 6rem; margin: 0; color: ${color}; line-height: 1;">${status}</h1>
      <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--text-main);">${title}</h2>
      <p style="color: var(--text-muted); max-width: 500px; margin-bottom: 2rem; font-size: 1.1rem;">
        ${message}
      </p>
      
      <div style="display: flex; gap: 1rem;">
        <a href="/dashboard" class="btn btn-primary">Return to Dashboard</a>
        <a href="javascript:history.back()" class="btn btn-secondary">Go Back</a>
      </div>
    </div>
  `;

  return layout({
    title: `${status} ${title}`,
    body: content,
    user // If user is logged in, the navbar will show. If not, it shows 'Login'.
  });
}