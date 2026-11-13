// src/lib/http.js
import { renderError } from '../views/errors/error.js';

export async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => { resolve(new URLSearchParams(body)); });
    req.on('error', err => { reject(err); });
  });
}

export function sendHtml(res, html, statusCode = 200) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

export function redirect(res, location, statusCode = 302) {
  res.writeHead(statusCode, { 'Location': location });
  res.end();
}

export function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

// NEW: Helper to render styled error pages
export function sendError(res, status, title, message, user = null) {
  const html = renderError({ user, status, title, message });
  sendHtml(res, html, status);
}