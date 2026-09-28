/**
 * Core text sanitization utility for XSS prevention.
 * Strips script tags, removes malicious event handlers, escapes dangerous HTML characters,
 * and normalizes whitespace before values enter application state.
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  let cleaned = text.trim();
  if (!cleaned) {
    return '';
  }

  // 1. Strip script tags and any enclosed executable code
  cleaned = cleaned.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<script\b[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/script>/gi, '');

  // 2. Strip HTML tags that contain malicious event handlers (onerror, onload, onclick, etc.)
  cleaned = cleaned.replace(/<[a-z0-9_-]+[^>]*?\bon\w+\s*=[^>]*?>/gi, '');

  // 3. Normalize internal whitespace
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

  // 4. Escape dangerous HTML special characters
  const htmlEntityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };

  cleaned = cleaned.replace(/[&<>"']/g, (char) => htmlEntityMap[char] || char);

  return cleaned.trim();
}
