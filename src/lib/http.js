// src/lib/http.js

/**
 * Reads the body of a POST request (like form data).
 * Returns an object with .get('name') to easily grab values.
 */
export async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    // Listen for chunks of data
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // When data is fully received
    req.on('end', () => {
      // Parse it as URL-encoded form data
      resolve(new URLSearchParams(body));
    });

    // Handle errors
    req.on('error', err => {
      reject(err);
    });
  });
}

/**
 * Sends an HTML response to the browser.
 */
export function sendHtml(res, html, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(html);
}

/**
 * Redirects the browser to a different URL.
 */
export function redirect(res, location, statusCode = 302) {
  res.writeHead(statusCode, { 'Location': location });
  res.end();
}

/**
 * Parses the Cookie header from the request into a JS object.
 */
export function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;

  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      // parts.shift() gets the key, parts.join('=') gets the value
      // (in case the value itself contains an '=')
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }

  return list;
}