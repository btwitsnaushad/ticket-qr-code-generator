import { Ticket, CreateTicketInput, QRCode } from '../core/types';

/**
 * Ticket Service Stub (Pre-implementation)
 */
export class TicketService {
  async createTicket(_input: CreateTicketInput): Promise<Ticket> {
    throw new Error('Not implemented: createTicket');
  }

  async getTickets(_search?: string): Promise<{ data: Ticket[]; total: number }> {
    throw new Error('Not implemented: getTickets');
  }

  async getTicketById(_id: string): Promise<Ticket | null> {
    throw new Error('Not implemented: getTicketById');
  }

  async regenerateQRCode(_ticketId: string): Promise<QRCode> {
    throw new Error('Not implemented: regenerateQRCode');
  }
}
