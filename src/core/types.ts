/**
 * Core domain types and interfaces for Ticket QR Code Generator Worker (ENG-139055)
 */

export interface QRCode {
  id: string;
  ticketId: string;
  qrData: string;
  svgContent: string;
  status: 'PENDING' | 'GENERATED' | 'FAILED';
  generatedAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  holderName: string;
  qrCode?: QRCode;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  ticketNumber: string;
  title: string;
  holderName: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export type AnalyticsAction =
  | 'TICKET_CREATED'
  | 'QR_CODE_GENERATED'
  | 'TICKET_SEARCHED'
  | 'LIST_REFRESHED';

export interface AnalyticsEvent {
  action: AnalyticsAction;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  error?: string;
  message?: string;
  errors?: ValidationErrors;
}
