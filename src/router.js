// src/router.js
import { sendError } from './lib/http.js'; // <-- NEW

const routes = [];

export function get(path, handler) {
  routes.push({ method: 'GET', path, handler });
}

export function post(path, handler) {
  routes.push({ method: 'POST', path, handler });
}

function matchRoute(routePath, requestPath) {
  const routeParts = routePath.split('/');
  const requestParts = requestPath.split('/');

  if (routeParts.length !== requestParts.length) return null;

  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      params[routeParts[i].slice(1)] = requestParts[i];
    } else if (routeParts[i] !== requestParts[i]) {
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
  req.params = {};

  let matchedRoute = null;
  for (const route of routes) {
    if (route.method === method) {
      const params = matchRoute(route.path, pathname);
      if (params) {
        matchedRoute = route;
        req.params = params;
        break;
      }
    }
  }

  if (matchedRoute) {
    try {
      await matchedRoute.handler(req, res);
    } catch (error) {
      console.error(`❌ Error handling ${method} ${pathname}:`, error);
      // UPDATED: Use styled 500 Error Page
      sendError(res, 500, 'Internal Server Error', 'Something went wrong on our end. Please try again later.', req.user || null);
    }
  } else {
    // UPDATED: Use styled 404 Error Page
    sendError(res, 404, 'Page Not Found', `The page '${pathname}' does not exist. Check the URL and try again.`, req.user || null);
  }
}