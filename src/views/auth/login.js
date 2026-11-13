// src/views/auth/login.js
import { layout } from '../layout.js';
import { html, raw } from '../../lib/html.js';

export function renderLogin({ error = null } = {}) {
  const content = html`
    <div class="login-container">
      <div class="login-card">
        <h1>Staff Login</h1>
        <p>Enter your credentials to access the hospital system.</p>

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