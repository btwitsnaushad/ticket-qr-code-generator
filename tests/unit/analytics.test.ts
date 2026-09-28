import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackAnalyticsEvent, logTicketCreated, logQRCodeGenerated, logTicketSearched, logTicketListRefreshed } from '../../src/services/analytics';

describe('Analytics Console Telemetry Unit Tests', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should emit structured console log with [Analytics] prefix on generic trackAnalyticsEvent', () => {
    trackAnalyticsEvent('TICKET_CREATED', { ticketNumber: 'TKT-1001' });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const logArg = consoleSpy.mock.calls[0][0];
    expect(logArg).toContain('[Analytics] TICKET_CREATED:');
  });

  it('should log ticket creation action with ticketNumber, id, and timestamp', () => {
    logTicketCreated('TKT-1001', 'c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const callArgs = consoleSpy.mock.calls[0];
    const logHeader = callArgs[0];
    const payload = callArgs[1] as Record<string, unknown>;

    expect(logHeader).toContain('[Analytics] Ticket Created:');
    expect(payload).toMatchObject({
      ticketNumber: 'TKT-1001',
      id: 'c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11'
    });
    expect(payload.timestamp).toBeDefined();
  });

  it('should log QR code generation action with ticketId, qrData, and format', () => {
    logQRCodeGenerated('c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11', 'TKT-1001:uuid');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const callArgs = consoleSpy.mock.calls[0];
    expect(callArgs[0]).toContain('[Analytics] QR Code Generated:');
    expect(callArgs[1]).toMatchObject({
      ticketId: 'c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11',
      qrData: 'TKT-1001:uuid',
      format: 'SVG'
    });
  });

  it('should log search action with query and resultsCount', () => {
    logTicketSearched('Jane', 3);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const callArgs = consoleSpy.mock.calls[0];
    expect(callArgs[0]).toContain('[Analytics] Ticket Searched:');
    expect(callArgs[1]).toMatchObject({
      query: 'Jane',
      resultsCount: 3
    });
  });

  it('should log ticket list refresh with total count', () => {
    logTicketListRefreshed(15);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const callArgs = consoleSpy.mock.calls[0];
    expect(callArgs[0]).toContain('[Analytics] Ticket List Refreshed:');
    expect(callArgs[1]).toMatchObject({
      total: 15
    });
  });
});
