import { CreateTicketInput } from '../../core/types';

export interface TicketFormOptions {
  onSubmit: (data: CreateTicketInput) => Promise<void>;
}

/**
 * TicketForm Stub (Pre-implementation)
 */
export function setupTicketForm(_container: HTMLElement, _options: TicketFormOptions): void {
  throw new Error('Not implemented: setupTicketForm');
}
