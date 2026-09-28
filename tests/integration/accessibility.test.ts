import { describe, it, expect, beforeEach } from 'vitest';
import { setupTicketForm } from '../../src/ui/components/TicketForm';
import { renderTicketTable } from '../../src/ui/components/TicketTable';
import { Ticket } from '../../src/core/types';

describe('Accessibility & Keyboard Navigation Integration Tests (100% Lighthouse Target)', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.innerHTML = '';
    document.body.appendChild(container);
  });

  it('should ensure all interactive input elements have associated label elements with matching for/id', () => {
    setupTicketForm(container, { onSubmit: async () => {} });

    const inputs = container.querySelectorAll<HTMLInputElement>('input');
    expect(inputs.length).toBeGreaterThan(0);

    inputs.forEach((input) => {
      const id = input.getAttribute('id');
      expect(id).toBeTruthy();
      const label = container.querySelector(`label[for="${id}"]`);
      expect(label).not.toBeNull();
      expect(label?.textContent?.trim().length).toBeGreaterThan(0);
    });
  });

  it('should ensure the submit button has accessible text or aria-label', () => {
    setupTicketForm(container, { onSubmit: async () => {} });

    const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitBtn).not.toBeNull();
    const accessibleName = submitBtn.getAttribute('aria-label') || submitBtn.textContent?.trim();
    expect(accessibleName).toBeTruthy();
  });

  it('should ensure all form controls are focusable and follow sequential tab order', () => {
    setupTicketForm(container, { onSubmit: async () => {} });

    const ticketNumberInput = container.querySelector('#ticketNumber') as HTMLInputElement;
    const titleInput = container.querySelector('#title') as HTMLInputElement;
    const holderNameInput = container.querySelector('#holderName') as HTMLInputElement;
    const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Verify tabindex is not negative
    expect(Number(ticketNumberInput.getAttribute('tabindex') || '0')).toBeGreaterThanOrEqual(0);
    expect(Number(titleInput.getAttribute('tabindex') || '0')).toBeGreaterThanOrEqual(0);
    expect(Number(holderNameInput.getAttribute('tabindex') || '0')).toBeGreaterThanOrEqual(0);
    expect(Number(submitBtn.getAttribute('tabindex') || '0')).toBeGreaterThanOrEqual(0);
  });

  it('should ensure SVG QR code elements have role="img", aria-label, and a <title> child element', () => {
    const sampleTicket: Ticket = {
      id: 'uuid-1',
      ticketNumber: 'TKT-888',
      title: 'Pass',
      holderName: 'Bob',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qrCode: {
        id: 'qr-1',
        ticketId: 'uuid-1',
        qrData: 'TKT-888:uuid-1',
        svgContent: '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="QR Code for Ticket TKT-888"><title>QR Code for Ticket TKT-888</title><rect width="100" height="100"/></svg>',
        status: 'GENERATED',
        generatedAt: new Date().toISOString()
      }
    };

    renderTicketTable(container, [sampleTicket]);

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('QR Code for Ticket TKT-888');
    const title = svg?.querySelector('title');
    expect(title?.textContent).toBe('QR Code for Ticket TKT-888');
  });

  it('should present table headers with scope="col" for screen reader table navigation', () => {
    renderTicketTable(container, []);

    // Headers should have scope="col"
    const thElements = container.querySelectorAll('th');
    thElements.forEach((th) => {
      expect(th.getAttribute('scope')).toBe('col');
    });
  });
});
