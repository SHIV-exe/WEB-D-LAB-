// src/lib/html.js

/**
 * Escapes dangerous HTML characters to prevent XSS attacks.
 * Always use this when outputting user-provided data.
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * A safe HTML template tag.
 * Any variable passed into ${} will be automatically escaped.
 * Example: html`<h1>${patientName}</h1>`
 */
export function html(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i - 1];
    
    // If there's no value (like the very first string chunk), just return the string
    if (value === undefined) return result + string;
    
    // Check if the value was explicitly marked as raw (trusted HTML)
    const isRaw = value && value.__raw === true;
    const safeValue = isRaw ? value.value : escapeHtml(value);
    
    return result + safeValue + string;
  }, '');
}

/**
 * Marks a string as safe/trusted HTML so the `html` tag won't escape it.
 * ONLY use this for your own layout code, NEVER for user input.
 */
export function raw(str) {
  return { __raw: true, value: str };
}