// src/router.js
import { sendHtml } from './lib/http.js';

const routes = [];

export function get(path, handler) {
  routes.push({ method: 'GET', path, handler });
}

export function post(path, handler) {
  routes.push({ method: 'POST', path, handler });
}

// NEW: Helper to match dynamic routes (e.g., /patients/:id)
function matchRoute(routePath, requestPath) {
  const routeParts = routePath.split('/');
  const requestParts = requestPath.split('/');

  if (routeParts.length !== requestParts.length) return null;

  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      // It's a parameter (like :id). Save the value.
      params[routeParts[i].slice(1)] = requestParts[i];
    } else if (routeParts[i] !== requestParts[i]) {
      // Static part doesn't match
      return null;
    }
  }
  return params;
}

export async function handleRequest(req, res) {
  const baseUrl = `http://${req.headers.host || 'localhost'}`;
  const parsedUrl = new URL(req.url, baseUrl);
  
  const pathname = parsedUrl.pathname;
  const method = req.method;

  req.parsedUrl = parsedUrl;
  req.query = parsedUrl.searchParams;
  req.params = {}; // Initialize empty params

  // Find a matching route
  let matchedRoute = null;
  for (const route of routes) {
    if (route.method === method) {
      const params = matchRoute(route.path, pathname);
      if (params) {
        matchedRoute = route;
        req.params = params; // Attach dynamic params to req
        break;
      }
    }
  }

  if (matchedRoute) {
    try {
      await matchedRoute.handler(req, res);
    } catch (error) {
      console.error(`❌ Error handling ${method} ${pathname}:`, error);
      sendHtml(res, '<h1>500 Internal Server Error</h1><p>Something went wrong.</p>', 500);
    }
  } else {
    sendHtml(res, `
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>404 Not Found</h1>
        <p>The page <strong>${pathname}</strong> does not exist.</p>
        <a href="/">Go back home</a>
      </div>
    `, 404);
  }
}