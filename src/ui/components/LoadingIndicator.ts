/**
 * Renders an accessible visual loading indicator inside the specified container.
 *
 * Requirements:
 * - Marked with role="status" and aria-live="polite"
 * - Displays the provided message text (defaults to 'Loading...')
 * - Idempotent: updates existing indicator if already present
 *
 * @param container The DOM element where the indicator will be mounted
 * @param message The accessible loading message to display
 */
export function renderLoadingIndicator(container: HTMLElement, message: string = 'Loading...'): void {
  let indicator = container.querySelector<HTMLElement>('[data-component="loading-indicator"]');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.setAttribute('role', 'status');
    indicator.setAttribute('aria-live', 'polite');
    indicator.setAttribute('data-component', 'loading-indicator');
    indicator.className = 'loading-indicator';
    container.appendChild(indicator);
  }
  indicator.textContent = message;
}

/**
 * Removes or hides any loading indicators present in the specified container.
 *
 * @param container The DOM element containing the indicator to remove
 */
export function hideLoadingIndicator(container: HTMLElement): void {
  const indicators = container.querySelectorAll<HTMLElement>(
    '[data-component="loading-indicator"], .loading-indicator'
  );
  if (indicators.length > 0) {
    indicators.forEach((indicator) => indicator.remove());
  } else {
    // Fallback: check for role="status" that is not empty-state
    const statusEls = container.querySelectorAll<HTMLElement>('[role="status"]');
    statusEls.forEach((el) => {
      if (el.getAttribute('data-testid') !== 'empty-state') {
        el.remove();
      }
    });
  }
}