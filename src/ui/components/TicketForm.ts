import { CreateTicketInput } from '../../core/types';
import { validateTicketInput } from '../../core/validator';
import { sanitizeText } from '../../core/sanitizer';
import { renderLoadingIndicator, hideLoadingIndicator } from './LoadingIndicator';

export interface TicketFormOptions {
  onSubmit: (data: CreateTicketInput) => Promise<void>;
  existingTicketNumbers?: string[];
}

/**
 * Sets up and mounts the TicketForm component inside the provided container.
 *
 * Implements:
 * - Monochromatic accessible form structure
 * - Form validation and inline error rendering with aria-invalid & aria-describedby
 * - Focus shifting to first invalid field on rejected submission
 * - Clearing invalid state upon typing valid input
 * - Asynchronous submission handling with loading indicator, submit button disabling, and aria-busy
 * - Full sequential tab navigation and accessible labels
 *
 * @param container The host element to mount the form into
 * @param options Configuration options including async onSubmit handler
 */
export function setupTicketForm(container: HTMLElement, options: TicketFormOptions): void {
  container.innerHTML = `
    <form class="ticket-form" novalidate aria-busy="false">
      <div class="form-group">
        <label for="ticketNumber">Ticket Number</label>
        <input
          type="text"
          id="ticketNumber"
          name="ticketNumber"
          placeholder="e.g. TKT-1001"
          aria-required="true"
          aria-invalid="false"
          aria-describedby="ticketNumber-error"
          tabindex="0"
        />
        <div id="ticketNumber-error" class="form-error" role="alert" aria-live="polite"></div>
      </div>

      <div class="form-group">
        <label for="title">Ticket Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="e.g. General Admission Pass"
          aria-required="true"
          aria-invalid="false"
          aria-describedby="title-error"
          tabindex="0"
        />
        <div id="title-error" class="form-error" role="alert" aria-live="polite"></div>
      </div>

      <div class="form-group">
        <label for="holderName">Holder Name</label>
        <input
          type="text"
          id="holderName"
          name="holderName"
          placeholder="e.g. Jane Doe"
          aria-required="true"
          aria-invalid="false"
          aria-describedby="holderName-error"
          tabindex="0"
        />
        <div id="holderName-error" class="form-error" role="alert" aria-live="polite"></div>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          id="submit-ticket-btn"
          class="btn btn-primary"
          tabindex="0"
          aria-label="Generate Ticket & QR Code"
        >
          Generate Ticket & QR Code
        </button>
      </div>
    </form>
  `;

  const form = container.querySelector<HTMLFormElement>('form')!;
  const submitBtn = container.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const ticketNumberInput = container.querySelector<HTMLInputElement>('#ticketNumber')!;
  const titleInput = container.querySelector<HTMLInputElement>('#title')!;
  const holderNameInput = container.querySelector<HTMLInputElement>('#holderName')!;

  const ticketNumberError = container.querySelector<HTMLElement>('#ticketNumber-error')!;
  const titleError = container.querySelector<HTMLElement>('#title-error')!;
  const holderNameError = container.querySelector<HTMLElement>('#holderName-error')!;

  // Clear errors when user inputs valid data
  const handleInputChange = (input: HTMLInputElement, errorEl: HTMLElement) => {
    if (input.value.trim().length > 0) {
      input.setAttribute('aria-invalid', 'false');
      errorEl.textContent = '';
    }
  };

  ticketNumberInput.addEventListener('input', () => handleInputChange(ticketNumberInput, ticketNumberError));
  titleInput.addEventListener('input', () => handleInputChange(titleInput, titleError));
  holderNameInput.addEventListener('input', () => handleInputChange(holderNameInput, holderNameError));

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    // Prevent re-submission while already busy
    if (form.getAttribute('aria-busy') === 'true') {
      return;
    }

    const rawPayload: CreateTicketInput = {
      ticketNumber: ticketNumberInput.value,
      title: titleInput.value,
      holderName: holderNameInput.value
    };

    const validation = validateTicketInput(rawPayload, options.existingTicketNumbers);

    if (!validation.isValid) {
      // 1. Highlight offending fields and show error messages
      if (validation.errors.ticketNumber) {
        ticketNumberInput.setAttribute('aria-invalid', 'true');
        ticketNumberError.textContent = validation.errors.ticketNumber;
      } else {
        ticketNumberInput.setAttribute('aria-invalid', 'false');
        ticketNumberError.textContent = '';
      }

      if (validation.errors.title) {
        titleInput.setAttribute('aria-invalid', 'true');
        titleError.textContent = validation.errors.title;
      } else {
        titleInput.setAttribute('aria-invalid', 'false');
        titleError.textContent = '';
      }

      if (validation.errors.holderName) {
        holderNameInput.setAttribute('aria-invalid', 'true');
        holderNameError.textContent = validation.errors.holderName;
      } else {
        holderNameInput.setAttribute('aria-invalid', 'false');
        holderNameError.textContent = '';
      }

      // 2. Shift focus to first invalid field
      if (validation.errors.ticketNumber) {
        ticketNumberInput.focus();
      } else if (validation.errors.title) {
        titleInput.focus();
      } else if (validation.errors.holderName) {
        holderNameInput.focus();
      }

      return;
    }

    // Input is valid: sanitize payload
    const sanitizedPayload: CreateTicketInput = {
      ticketNumber: sanitizeText(rawPayload.ticketNumber),
      title: sanitizeText(rawPayload.title),
      holderName: sanitizeText(rawPayload.holderName)
    };

    // Begin asynchronous submission state
    submitBtn.disabled = true;
    form.setAttribute('aria-busy', 'true');
    renderLoadingIndicator(container, 'Generating QR code...');

    try {
      await options.onSubmit(sanitizedPayload);

      // Reset form and clear validation states upon successful submission
      form.reset();
      ticketNumberInput.value = '';
      titleInput.value = '';
      holderNameInput.value = '';

      ticketNumberInput.setAttribute('aria-invalid', 'false');
      ticketNumberError.textContent = '';
      titleInput.setAttribute('aria-invalid', 'false');
      titleError.textContent = '';
      holderNameInput.setAttribute('aria-invalid', 'false');
      holderNameError.textContent = '';
    } catch (err) {
      console.error('Error during ticket submission:', err);
    } finally {
      submitBtn.disabled = false;
      form.setAttribute('aria-busy', 'false');
      hideLoadingIndicator(container);
    }
  });
}