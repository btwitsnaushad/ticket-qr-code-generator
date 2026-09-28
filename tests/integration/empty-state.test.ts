import { describe, it, expect, beforeEach } from 'vitest';
import { renderTicketTable } from '../../src/ui/components/TicketTable';
import { renderEmptyState } from '../../src/ui/components/EmptyState';
import { Ticket } from '../../src/core/types';

describe('Empty State Integration Tests ("No data found")', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.innerHTML = '';
    document.body.appendChild(container);
  });

  it('should render a user-friendly "No data found" message when tickets array is empty', () => {
    renderTicketTable(container, []);

    const emptyState = container.querySelector('[data-testid="empty-state"]');
    expect(emptyState).not.toBeNull();
    expect(emptyState?.textContent).toContain('No data found');
  });

  it('should have role="status" and accessibility attributes on the empty state element', () => {
    renderEmptyState(container, 'No data found');

    const emptyElement = container.querySelector('[role="status"]');
    expect(emptyElement).not.toBeNull();
    expect(emptyElement?.textContent).toContain('No data found');
  });

  it('should NOT render table rows when in empty state', () => {
    renderTicketTable(container, []);

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(0);
  });

  it('should render table rows when ticket data is provided and remove empty state', () => {
    const sampleTickets: Ticket[] = [
      {
        id: '1',
        ticketNumber: 'TKT-101',
        title: 'VIP Pass',
        holderName: 'Alice',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        qrCode: {
          id: 'qr-1',
          ticketId: '1',
          qrData: 'TKT-101:1',
          svgContent: '<svg></svg>',
          status: 'GENERATED',
          generatedAt: new Date().toISOString()
        }
      }
    ];

    renderTicketTable(container, sampleTickets);

    const emptyState = container.querySelector('[data-testid="empty-state"]');
    expect(emptyState).toBeNull();

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain('TKT-101');
    expect(rows[0].textContent).toContain('VIP Pass');
    expect(rows[0].textContent).toContain('Alice');
  });
});
