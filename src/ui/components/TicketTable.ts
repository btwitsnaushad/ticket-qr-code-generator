import { Ticket } from '../../core/types';
import { renderEmptyState } from './EmptyState';

/**
 * Renders the monochromatic structured table of tickets and their SVG QR codes.
 *
 * Requirements:
 * - Table headers with scope="col" for screen reader navigation
 * - Renders each ticket row with ticketNumber, title, holderName, and svgContent
 * - If tickets is empty, renders user-friendly empty state with role="status" and data-testid="empty-state"
 * - Does not render table body rows when empty
 *
 * @param container The host element where the table will be rendered
 * @param tickets The array of tickets to display
 */
export function renderTicketTable(container: HTMLElement, tickets: Ticket[]): void {
  container.innerHTML = `
    <div class="table-container">
      <table class="ticket-table" aria-label="Tickets Table">
        <thead>
          <tr>
            <th scope="col">Ticket Number</th>
            <th scope="col">Title</th>
            <th scope="col">Holder Name</th>
            <th scope="col">QR Code</th>
          </tr>
        </thead>
        <tbody>
          ${tickets
      .map(
        (ticket) => `
            <tr data-ticket-id="${ticket.id}">
              <td class="col-ticket-number">${ticket.ticketNumber}</td>
              <td class="col-title">${ticket.title}</td>
              <td class="col-holder">${ticket.holderName}</td>
              <td class="col-qr">${ticket.qrCode?.svgContent || ''}</td>
            </tr>
          `
      )
      .join('')}
        </tbody>
      </table>
    </div>
  `;

  if (tickets.length === 0) {
    renderEmptyState(container, 'No data found');
  }
}