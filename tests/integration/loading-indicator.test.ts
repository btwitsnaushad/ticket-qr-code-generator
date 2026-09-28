import { describe, it, expect, beforeEach } from 'vitest';
import { renderLoadingIndicator, hideLoadingIndicator } from '../../src/ui/components/LoadingIndicator';
import { setupTicketForm } from '../../src/ui/components/TicketForm';

describe('Loading State Integration Tests (Async Operations & Slow Connectivity)', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.innerHTML = '';
    document.body.appendChild(container);
  });

  it('should render a loading indicator with role="status" and aria-live="polite"', () => {
    renderLoadingIndicator(container, 'Generating QR code...');

    const indicator = container.querySelector('[role="status"]');
    expect(indicator).not.toBeNull();
    expect(indicator?.getAttribute('aria-live')).toBe('polite');
    expect(indicator?.textContent).toContain('Generating QR code...');
  });

  it('should remove or hide the loading indicator when hideLoadingIndicator is invoked', () => {
    renderLoadingIndicator(container, 'Loading...');
    expect(container.querySelector('[role="status"]')).not.toBeNull();

    hideLoadingIndicator(container);
    expect(container.querySelector('[role="status"]')).toBeNull();
  });

  it('should disable submit button and mark form aria-busy="true" during asynchronous submission', async () => {
    let resolveAsync: () => void = () => {};
    const asyncOperation = new Promise<void>((resolve) => {
      resolveAsync = resolve;
    });

    setupTicketForm(container, {
      onSubmit: async () => {
        await asyncOperation;
      }
    });

    const form = container.querySelector('form') as HTMLFormElement;
    const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    const ticketNumberInput = container.querySelector('#ticketNumber') as HTMLInputElement;
    const titleInput = container.querySelector('#title') as HTMLInputElement;
    const holderNameInput = container.querySelector('#holderName') as HTMLInputElement;

    ticketNumberInput.value = 'TKT-777';
    titleInput.value = 'Fast Track';
    holderNameInput.value = 'Alex';

    // Submit form (which initiates async operation)
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // Verify loading and disabled state while promise is pending
    expect(submitBtn.disabled).toBe(true);
    expect(form.getAttribute('aria-busy')).toBe('true');
    const indicator = container.querySelector('[role="status"]');
    expect(indicator).not.toBeNull();

    // Resolve the async operation
    resolveAsync();
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify recovery after completion
    expect(submitBtn.disabled).toBe(false);
    expect(form.getAttribute('aria-busy')).toBe('false');
    expect(container.querySelector('[role="status"]')).toBeNull();
  });
});
