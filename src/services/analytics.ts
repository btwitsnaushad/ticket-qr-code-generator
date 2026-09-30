import { AnalyticsAction, AnalyticsEvent } from '../core/types';

/**
 * Emits a structured telemetry event to the developer console.
 *
 * @param action The category of user or system action
 * @param payload Arbitrary event payload details
 * @returns The constructed AnalyticsEvent object
 */
export function trackAnalyticsEvent(
  action: AnalyticsAction,
  payload: Record<string, unknown>
): AnalyticsEvent {
  const timestamp = new Date().toISOString();
  const eventPayload = { ...payload, timestamp };
  const event: AnalyticsEvent = {
    action,
    payload: eventPayload,
    timestamp
  };

  console.log(`[Analytics] ${action}:`, eventPayload);
  return event;
}

/**
 * Logs ticket creation action to developer console.
 *
 * @param ticketNumber Standardized ticket number
 * @param id Unique identifier of the created ticket
 */
export function logTicketCreated(ticketNumber: string, id: string): void {
  const timestamp = new Date().toISOString();
  const payload = {
    ticketNumber,
    id,
    timestamp
  };
  console.log('[Analytics] Ticket Created:', payload);
}

/**
 * Logs QR code generation action to developer console.
 *
 * @param ticketId Unique identifier of the ticket
 * @param qrData Encoded QR payload string
 */
export function logQRCodeGenerated(ticketId: string, qrData: string): void {
  const timestamp = new Date().toISOString();
  const payload = {
    ticketId,
    qrData,
    format: 'SVG',
    timestamp
  };
  console.log('[Analytics] QR Code Generated:', payload);
}

/**
 * Logs ticket search action to developer console.
 *
 * @param query Search query string entered by the user
 * @param resultsCount Number of matching tickets returned
 */
export function logTicketSearched(query: string, resultsCount: number): void {
  const timestamp = new Date().toISOString();
  const payload = {
    query,
    resultsCount,
    timestamp
  };
  console.log('[Analytics] Ticket Searched:', payload);
}

/**
 * Logs ticket list refresh action to developer console.
 *
 * @param total Total number of tickets present after refresh
 */
export function logTicketListRefreshed(total: number): void {
  const timestamp = new Date().toISOString();
  const payload = {
    total,
    timestamp
  };
  console.log('[Analytics] Ticket List Refreshed:', payload);
}
