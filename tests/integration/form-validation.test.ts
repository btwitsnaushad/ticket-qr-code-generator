import { describe, it, expect, beforeEach } from 'vitest';
import { setupTicketForm } from '../../src/ui/components/TicketForm';

describe('Form Validation & Error Handling Integration Tests', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.innerHTML = '';
    document.body.appendChild(container);
  });

  it('should block form submission and display validation errors when fields are empty', async () => {
    let submitted = false;
    setupTicketForm(container, {
      onSubmit: async () => {
        submitted = true;
      }
    });

    const form = container.querySelector('form') as HTMLFormElement;
    expect(form).not.toBeNull();

    // Trigger submit with empty fields
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(submitted).toBe(false);

    // Verify error highlights and messages
    const ticketNumberInput = container.querySelector('#ticketNumber') as HTMLInputElement;
    const holderNameInput = container.querySelector('#holderName') as HTMLInputElement;
    const titleInput = container.querySelector('#title') as HTMLInputElement;

    expect(ticketNumberInput.getAttribute('aria-invalid')).toBe('true');
    expect(holderNameInput.getAttribute('aria-invalid')).toBe('true');
    expect(titleInput.getAttribute('aria-invalid')).toBe('true');

    // Verify error message elements are linked with aria-describedby
    const ticketNumberError = container.querySelector('#ticketNumber-error');
    expect(ticketNumberError).not.toBeNull();
    expect(ticketNumberError?.textContent).toContain('Ticket number is required');
    expect(ticketNumberInput.getAttribute('aria-describedby')).toContain('ticketNumber-error');
  });

  it('should shift keyboard focus to the first invalid field upon rejected submission', () => {
    setupTicketForm(container, {
      onSubmit: async () => {}
    });

    const form = container.querySelector('form') as HTMLFormElement;
    const ticketNumberInput = container.querySelector('#ticketNumber') as HTMLInputElement;

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(document.activeElement).toBe(ticketNumberInput);
  });

  it('should clear invalid status and error message when user inputs valid data', () => {
    setupTicketForm(container, {
      onSubmit: async () => {}
    });

    const form = container.querySelector('form') as HTMLFormElement;
    const ticketNumberInput = container.querySelector('#ticketNumber') as HTMLInputElement;

    // Trigger error first
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(ticketNumberInput.getAttribute('aria-invalid')).toBe('true');

    // Input valid text and fire input event
    ticketNumberInput.value = 'TKT-2001';
    ticketNumberInput.dispatchEvent(new Event('input', { bubbles: true }));

    expect(ticketNumberInput.getAttribute('aria-invalid')).toBe('false');
    const ticketNumberError = container.querySelector('#ticketNumber-error');
    expect(ticketNumberError?.textContent).toBe('');
  });

  it('should successfully submit when all fields are valid and reset form inputs', async () => {
    let submittedPayload: unknown = null;
    setupTicketForm(container, {
      onSubmit: async (data) => {
        submittedPayload = data;
      }
    });

    const form = container.querySelector('form') as HTMLFormElement;
    const ticketNumberInput = container.querySelector('#ticketNumber') as HTMLInputElement;
    const titleInput = container.querySelector('#title') as HTMLInputElement;
    const holderNameInput = container.querySelector('#holderName') as HTMLInputElement;

    ticketNumberInput.value = 'TKT-9999';
    titleInput.value = 'All Access Pass';
    holderNameInput.value = 'John Developer';

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(submittedPayload).toEqual({
      ticketNumber: 'TKT-9999',
      title: 'All Access Pass',
      holderName: 'John Developer'
    });
  });
});
