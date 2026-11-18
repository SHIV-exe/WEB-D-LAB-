// src/views/auth/login.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderLogin({ error = null } = {}) {
  const content = html`
    <div class="login-container">
      <div class="login-card">
        <div style="display: flex; justify-content: center; margin-bottom: 1.25rem;">
          <span class="brand-logo" style="width: 44px; height: 44px; border-radius: 12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </span>
        </div>
        <h1>Staff Login</h1>
        <p>Enter your credentials to access Pulse.</p>

        ${error ? raw(html`
          <div class="alert-error">
            ${error}
          </div>
        `) : ''}

        <form action="/login" method="POST">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" class="form-control" required autofocus>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" class="form-control" required>
          </div>

          <button type="submit" class="btn btn-primary btn-block">Login</button>
        </form>
      </div>
    </div>
  `;

  return layout({
    title: 'Login',
    body: content,
    user: null
  });
}