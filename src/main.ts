import './ui/styles/design-tokens.css';
import './ui/styles/main.css';
import { TicketService } from './services/ticketService';
import { generateTicketQRCode } from './services/qrWorker';
import {
  logTicketCreated,
  logQRCodeGenerated,
  logTicketSearched,
  logTicketListRefreshed
} from './services/analytics';
import { setupTicketForm } from './ui/components/TicketForm';
import { renderTicketTable } from './ui/components/TicketTable';
import { CreateTicketInput } from './core/types';

/**
 * Bootstraps the Ticket QR Code Generator administrative interface.
 * Connects the TicketForm, TicketTable, TicketService, QR Worker, and Analytics Telemetry.
 */
export function initApp(): void {
  const root = document.getElementById('app');
  if (!root) {
    throw new Error('Root element #app not found in document.');
  }

  root.innerHTML = `
    <div class="app-container">
      <header class="app-header" role="banner">
        <div class="header-meta">
          <span class="badge">ENG-139055</span>
          <span class="header-status">Worker Active</span>
        </div>
        <h1>Ticket QR Code Generator</h1>
        <p>Monochromatic administrative portal for managing ticket inventory and deterministic SVG QR generation.</p>
      </header>

      <main class="app-main" id="main-content" role="main">
        <section class="card form-section" aria-labelledby="form-heading">
          <h2 id="form-heading">Generate New Ticket</h2>
          <div id="form-container"></div>
        </section>

        <section class="card records-section" aria-labelledby="inventory-heading">
          <div class="records-toolbar">
            <h2 id="inventory-heading">Ticket Inventory</h2>
            <div class="search-container">
              <label for="ticket-search" class="visually-hidden">Search Tickets</label>
              <input
                type="search"
                id="ticket-search"
                class="search-input"
                placeholder="Search ticket #, title, or holder..."
                aria-label="Search tickets"
                tabindex="0"
              />
            </div>
          </div>
          <div id="table-container"></div>
        </section>
      </main>
    </div>
  `;

  const ticketService = new TicketService();
  const formContainer = document.getElementById('form-container')!;
  const tableContainer = document.getElementById('table-container')!;
  const searchInput = document.getElementById('ticket-search') as HTMLInputElement;

  // Render initial tickets (empty state by default)
  const refreshTable = async (query?: string) => {
    const { data: tickets, total } = await ticketService.getTickets(query);
    renderTicketTable(tableContainer, tickets);
    return total;
  };

  // Mount form component
  setupTicketForm(formContainer, {
    onSubmit: async (payload: CreateTicketInput) => {
      // Simulate realistic worker processing latency (300ms)
      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        const ticket = await ticketService.createTicket(payload);

        // Generate full deterministic SVG QR representation
        const qrCode = await generateTicketQRCode(ticket.id, ticket.ticketNumber);
        ticket.qrCode = qrCode;

        // Emit telemetry
        logTicketCreated(ticket.ticketNumber, ticket.id);
        logQRCodeGenerated(ticket.id, qrCode.qrData);

        // Refresh table view
        const currentSearch = searchInput.value;
        const total = await refreshTable(currentSearch);
        logTicketListRefreshed(total);
      } catch (err) {
        // Surface duplicate or server error on the ticketNumber field
        const ticketNumberInput = formContainer.querySelector<HTMLInputElement>('#ticketNumber');
        const ticketNumberError = formContainer.querySelector<HTMLElement>('#ticketNumber-error');
        if (ticketNumberInput && ticketNumberError && err instanceof Error) {
          ticketNumberInput.setAttribute('aria-invalid', 'true');
          ticketNumberError.textContent = err.message;
          ticketNumberInput.focus();
        }
        throw err;
      }
    }
  });

  // Attach search filtering
  searchInput.addEventListener('input', async (e: Event) => {
    const query = (e.target as HTMLInputElement).value;
    const total = await refreshTable(query);
    logTicketSearched(query, total);
  });

  // Initial table render
  refreshTable().then((total) => {
    logTicketListRefreshed(total);
  });
}

// Auto-initialize when loaded in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
