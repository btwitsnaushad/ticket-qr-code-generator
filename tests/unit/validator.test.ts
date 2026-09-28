import { describe, it, expect } from 'vitest';
import { validateTicketInput } from '../../src/core/validator';

describe('Validator Unit Tests (Input & Business Rules)', () => {
  const validPayload = {
    ticketNumber: 'TKT-1001',
    title: 'General Admission Pass',
    holderName: 'Jane Doe'
  };

  it('should pass validation for a complete, valid ticket payload', () => {
    const result = validateTicketInput(validPayload);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  describe('Ticket Number Validation', () => {
    it('should reject missing or empty ticketNumber', () => {
      const result = validateTicketInput({ ...validPayload, ticketNumber: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.ticketNumber).toBe('Ticket number is required and cannot be empty.');
    });

    it('should reject whitespace-only ticketNumber', () => {
      const result = validateTicketInput({ ...validPayload, ticketNumber: '    ' });
      expect(result.isValid).toBe(false);
      expect(result.errors.ticketNumber).toBe('Ticket number is required and cannot be empty.');
    });

    it('should reject ticketNumber exceeding 64 characters', () => {
      const longNumber = 'T'.repeat(65);
      const result = validateTicketInput({ ...validPayload, ticketNumber: longNumber });
      expect(result.isValid).toBe(false);
      expect(result.errors.ticketNumber).toBe('Ticket number cannot exceed 64 characters.');
    });
  });

  describe('Title Validation', () => {
    it('should reject missing or empty title', () => {
      const result = validateTicketInput({ ...validPayload, title: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Ticket title is required.');
    });

    it('should reject whitespace-only title', () => {
      const result = validateTicketInput({ ...validPayload, title: '   ' });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Ticket title is required.');
    });

    it('should reject title exceeding 120 characters', () => {
      const longTitle = 'A'.repeat(121);
      const result = validateTicketInput({ ...validPayload, title: longTitle });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Ticket title cannot exceed 120 characters.');
    });
  });

  describe('Holder Name Validation', () => {
    it('should reject missing or empty holderName', () => {
      const result = validateTicketInput({ ...validPayload, holderName: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.holderName).toBe('Holder name is required.');
    });

    it('should reject whitespace-only holderName', () => {
      const result = validateTicketInput({ ...validPayload, holderName: '   ' });
      expect(result.isValid).toBe(false);
      expect(result.errors.holderName).toBe('Holder name is required.');
    });

    it('should reject holderName exceeding 120 characters', () => {
      const longName = 'H'.repeat(121);
      const result = validateTicketInput({ ...validPayload, holderName: longName });
      expect(result.isValid).toBe(false);
      expect(result.errors.holderName).toBe('Holder name cannot exceed 120 characters.');
    });
  });

  describe('Duplicate Ticket Number Collision', () => {
    it('should reject a ticketNumber that already exists in the provided existing numbers set', () => {
      const existingTicketNumbers = ['TKT-1001', 'TKT-1002'];
      const result = validateTicketInput(validPayload, existingTicketNumbers);
      expect(result.isValid).toBe(false);
      expect(result.errors.ticketNumber).toBe('A ticket with this number already exists.');
    });

    it('should accept a new unique ticketNumber when existing numbers are present', () => {
      const existingTicketNumbers = ['TKT-1001', 'TKT-1002'];
      const result = validateTicketInput({ ...validPayload, ticketNumber: 'TKT-1003' }, existingTicketNumbers);
      expect(result.isValid).toBe(true);
      expect(result.errors.ticketNumber).toBeUndefined();
    });
  });
});
