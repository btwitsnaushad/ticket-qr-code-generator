import { describe, it, expect } from 'vitest';
import { sanitizeText } from '../../src/core/sanitizer';

describe('Sanitizer Unit Tests (XSS Prevention)', () => {
  it('should strip <script> tags and enclosed executable code', () => {
    const malicious = 'Test Ticket <script>alert("xss")</script>';
    const sanitized = sanitizeText(malicious);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert("xss")');
    expect(sanitized).toBe('Test Ticket');
  });

  it('should strip malicious HTML event handlers such as onerror and onload', () => {
    const malicious = '<img src="invalid.png" onerror="alert(1)">Jane Doe';
    const sanitized = sanitizeText(malicious);
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).not.toContain('<img');
    expect(sanitized).toBe('Jane Doe');
  });

  it('should escape dangerous HTML characters (&, <, >, ", \')', () => {
    const input = 'Pass & Ticket <VIP> "Exclusive" \'Staff\'';
    const sanitized = sanitizeText(input);
    expect(sanitized).not.toContain('<VIP>');
    expect(sanitized).toContain('&amp;');
    expect(sanitized).toContain('&lt;');
    expect(sanitized).toContain('&gt;');
    expect(sanitized).toContain('&quot;');
    expect(sanitized).toContain('&#x27;');
  });

  it('should trim leading and trailing whitespace', () => {
    const input = '   TKT-1001   ';
    const sanitized = sanitizeText(input);
    expect(sanitized).toBe('TKT-1001');
  });

  it('should preserve standard alphanumeric characters, hyphens, and spaces', () => {
    const clean = 'TKT-2026 General Admission 01';
    const sanitized = sanitizeText(clean);
    expect(sanitized).toBe('TKT-2026 General Admission 01');
  });

  it('should return empty string when input is null, undefined, or empty', () => {
    // @ts-expect-error Testing runtime resilience
    expect(sanitizeText(null)).toBe('');
    // @ts-expect-error Testing runtime resilience
    expect(sanitizeText(undefined)).toBe('');
    expect(sanitizeText('')).toBe('');
    expect(sanitizeText('   ')).toBe('');
  });
});
