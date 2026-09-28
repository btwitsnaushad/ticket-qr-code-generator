import { describe, it, expect } from 'vitest';
import { generateTicketQRCode } from '../../src/services/qrWorker';

describe('QR Generator Worker Unit Tests (SVG & Data Format)', () => {
  const sampleTicketId = 'c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11';
  const sampleTicketNumber = 'TKT-1001';

  it('should generate standardized qrData format matching ${ticketNumber}:${ticketId}', async () => {
    const qrCode = await generateTicketQRCode(sampleTicketId, sampleTicketNumber);
    expect(qrCode.qrData).toBe(`${sampleTicketNumber}:${sampleTicketId}`);
  });

  it('should generate valid Scalable Vector Graphics (SVG) markup', async () => {
    const qrCode = await generateTicketQRCode(sampleTicketId, sampleTicketNumber);
    expect(qrCode.svgContent).toBeDefined();
    expect(qrCode.svgContent).toContain('<svg');
    expect(qrCode.svgContent).toContain('</svg>');
    expect(qrCode.svgContent).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('should include accessibility attributes in the generated SVG markup', async () => {
    const qrCode = await generateTicketQRCode(sampleTicketId, sampleTicketNumber);
    expect(qrCode.svgContent).toContain('role="img"');
    expect(qrCode.svgContent).toContain(`aria-label="QR Code for Ticket ${sampleTicketNumber}"`);
    expect(qrCode.svgContent).toContain(`<title>QR Code for Ticket ${sampleTicketNumber}</title>`);
  });

  it('should include scalable viewBox attributes in the SVG', async () => {
    const qrCode = await generateTicketQRCode(sampleTicketId, sampleTicketNumber);
    expect(qrCode.svgContent).toContain('viewBox=');
  });

  it('should return GENERATED status and a valid ISO timestamp', async () => {
    const qrCode = await generateTicketQRCode(sampleTicketId, sampleTicketNumber);
    expect(qrCode.status).toBe('GENERATED');
    expect(qrCode.ticketId).toBe(sampleTicketId);
    expect(new Date(qrCode.generatedAt).toISOString()).toBe(qrCode.generatedAt);
  });

  it('should throw an error if ticketId or ticketNumber is missing or invalid', async () => {
    await expect(generateTicketQRCode('', sampleTicketNumber)).rejects.toThrow('Valid ticket ID is required');
    await expect(generateTicketQRCode(sampleTicketId, '')).rejects.toThrow('Valid ticket number is required');
  });
});
