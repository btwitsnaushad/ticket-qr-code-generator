import { AnalyticsAction, AnalyticsEvent } from '../core/types';

/**
 * Analytics Logger Stub (Pre-implementation)
 */
export function trackAnalyticsEvent(
  _action: AnalyticsAction,
  _payload: Record<string, unknown>
): AnalyticsEvent {
  throw new Error('Not implemented: trackAnalyticsEvent');
}

export function logTicketCreated(_ticketNumber: string, _id: string): void {
  throw new Error('Not implemented: logTicketCreated');
}

export function logQRCodeGenerated(_ticketId: string, _qrData: string): void {
  throw new Error('Not implemented: logQRCodeGenerated');
}

export function logTicketSearched(_query: string, _resultsCount: number): void {
  throw new Error('Not implemented: logTicketSearched');
}

export function logTicketListRefreshed(_total: number): void {
  throw new Error('Not implemented: logTicketListRefreshed');
}
