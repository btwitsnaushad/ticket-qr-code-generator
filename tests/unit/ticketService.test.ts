import { describe, it, expect, beforeEach } from 'vitest';
import { TicketService } from '../../src/services/ticketService';

describe('Ticket Service Unit Tests (Data & Persistence Store)', () => {
  let ticketService: TicketService;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  describe('createTicket', () => {
    it('should successfully create and store a ticket with a generated UUID, timestamps, and linked SVG QR code', async () => {
      const input = {
        ticketNumber: 'TKT-1001',
        title: 'VIP Pass',
        holderName: 'Jane Doe'
      };

      const ticket = await ticketService.createTicket(input);

      expect(ticket.id).toBeDefined();
      expect(ticket.ticketNumber).toBe('TKT-1001');
      expect(ticket.title).toBe('VIP Pass');
      expect(ticket.holderName).toBe('Jane Doe');
      expect(ticket.createdAt).toBeDefined();
      expect(ticket.updatedAt).toBeDefined();

      expect(ticket.qrCode).toBeDefined();
      expect(ticket.qrCode?.ticketId).toBe(ticket.id);
      expect(ticket.qrCode?.qrData).toBe(`TKT-1001:${ticket.id}`);
      expect(ticket.qrCode?.svgContent).toContain('<svg');
      expect(ticket.qrCode?.status).toBe('GENERATED');
    });

    it('should throw an error when attempting to create a ticket with a duplicate ticketNumber', async () => {
      const input = {
        ticketNumber: 'TKT-1001',
        title: 'Standard Pass',
        holderName: 'John Doe'
      };

      await ticketService.createTicket(input);

      await expect(ticketService.createTicket(input)).rejects.toThrow(
        "A ticket with number 'TKT-1001' already exists."
      );
    });
  });

  describe('getTickets & Search Filtering', () => {
    beforeEach(async () => {
      await ticketService.createTicket({ ticketNumber: 'TKT-101', title: 'General Admission', holderName: 'Alice Smith' });
      await ticketService.createTicket({ ticketNumber: 'TKT-102', title: 'VIP Access', holderName: 'Bob Jones' });
      await ticketService.createTicket({ ticketNumber: 'TKT-103', title: 'Staff Pass', holderName: 'Charlie Brown' });
    });

    it('should retrieve all stored tickets with total count', async () => {
      const result = await ticketService.getTickets();
      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it('should filter tickets by ticketNumber query', async () => {
      const result = await ticketService.getTickets('102');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].ticketNumber).toBe('TKT-102');
      expect(result.total).toBe(1);
    });

    it('should filter tickets by holderName query (case-insensitive)', async () => {
      const result = await ticketService.getTickets('alice');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].holderName).toBe('Alice Smith');
    });

    it('should filter tickets by title query', async () => {
      const result = await ticketService.getTickets('Staff');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Staff Pass');
    });

    it('should return empty list and zero total when no tickets match search query', async () => {
      const result = await ticketService.getTickets('non-existent-search-term');
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('getTicketById', () => {
    it('should retrieve a ticket by its ID', async () => {
      const created = await ticketService.createTicket({
        ticketNumber: 'TKT-500',
        title: 'Single Pass',
        holderName: 'Test User'
      });

      const found = await ticketService.getTicketById(created.id);
      expect(found).toBeDefined();
      expect(found?.ticketNumber).toBe('TKT-500');
    });

    it('should return null or undefined if ticket ID is not found', async () => {
      const found = await ticketService.getTicketById('00000000-0000-0000-0000-000000000000');
      expect(found).toBeNull();
    });
  });

  describe('regenerateQRCode', () => {
    it('should regenerate the QR code for an existing ticket', async () => {
      const created = await ticketService.createTicket({
        ticketNumber: 'TKT-999',
        title: 'Regen Pass',
        holderName: 'Regen User'
      });

      const updatedQR = await ticketService.regenerateQRCode(created.id);
      expect(updatedQR.ticketId).toBe(created.id);
      expect(updatedQR.status).toBe('GENERATED');
      expect(updatedQR.svgContent).toContain('<svg');
    });
  });
});
