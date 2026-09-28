import { Ticket, CreateTicketInput, QRCode } from '../core/types';
import { validateTicketInput } from '../core/validator';
import { sanitizeText } from '../core/sanitizer';

/**
 * Ticket Service
 * Manages ticket records in memory, providing validation, sanitization,
 * duplicate protection, unique UUID generation, and search filtering.
 */
export class TicketService {
  private tickets: Ticket[] = [];

  /**
   * Creates and stores a new ticket after validating and sanitizing inputs.
   * Generates a unique UUID and associates a generated QR code.
   *
   * @param input Data for the new ticket
   * @throws Error if validation fails or a duplicate ticket number exists
   */
  async createTicket(input: CreateTicketInput): Promise<Ticket> {
    const existingNumbers = this.tickets.map((t) => t.ticketNumber);
    const validation = validateTicketInput(input, existingNumbers);

    if (!validation.isValid) {
      if (validation.errors.ticketNumber === 'A ticket with this number already exists.') {
        throw new Error(`A ticket with number '${input.ticketNumber}' already exists.`);
      }
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError || 'Validation failed.');
    }

    const ticketNumber = sanitizeText(input.ticketNumber);
    const title = sanitizeText(input.title);
    const holderName = sanitizeText(input.holderName);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const qrCode: QRCode = {
      id: crypto.randomUUID(),
      ticketId: id,
      qrData: `${ticketNumber}:${id}`,
      svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="QR Code for Ticket ${ticketNumber}"><title>QR Code for Ticket ${ticketNumber}</title><rect width="100%" height="100%" fill="#ffffff"/></svg>`,
      status: 'GENERATED',
      generatedAt: now
    };

    const ticket: Ticket = {
      id,
      ticketNumber,
      title,
      holderName,
      qrCode,
      createdAt: now,
      updatedAt: now
    };

    this.tickets.unshift(ticket);
    return ticket;
  }

  /**
   * Retrieves all tickets, optionally filtered by a search query matching
   * ticket number, title, or holder name (case-insensitive).
   *
   * @param search Optional search string
   */
  async getTickets(search?: string): Promise<{ data: Ticket[]; total: number }> {
    let results = [...this.tickets];

    if (search && search.trim()) {
      const query = search.trim().toLowerCase();
      results = results.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(query) ||
          t.title.toLowerCase().includes(query) ||
          t.holderName.toLowerCase().includes(query)
      );
    }

    return {
      data: results,
      total: results.length
    };
  }

  /**
   * Retrieves a single ticket by its unique identifier.
   *
   * @param id Ticket UUID
   * @returns The matching Ticket or null if not found
   */
  async getTicketById(id: string): Promise<Ticket | null> {
    const found = this.tickets.find((t) => t.id === id);
    return found || null;
  }

  /**
   * Regenerates the QR code for an existing ticket.
   *
   * @param ticketId Ticket UUID
   * @throws Error if the ticket is not found
   */
  async regenerateQRCode(ticketId: string): Promise<QRCode> {
    const ticket = await this.getTicketById(ticketId);
    if (!ticket) {
      throw new Error(`Ticket with ID '${ticketId}' not found.`);
    }

    const now = new Date().toISOString();
    const qrCode: QRCode = {
      id: crypto.randomUUID(),
      ticketId: ticket.id,
      qrData: `${ticket.ticketNumber}:${ticket.id}`,
      svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="QR Code for Ticket ${ticket.ticketNumber}"><title>QR Code for Ticket ${ticket.ticketNumber}</title><rect width="100%" height="100%" fill="#ffffff"/></svg>`,
      status: 'GENERATED',
      generatedAt: now
    };

    ticket.qrCode = qrCode;
    ticket.updatedAt = now;
    return qrCode;
  }
}
