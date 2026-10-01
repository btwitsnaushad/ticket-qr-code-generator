/**
 * Renders an accessible empty-state message inside the specified container.
 *
 * Requirements:
 * - Marked with role="status" and data-testid="empty-state"
 * - Displays the provided message text (defaults to 'No data found')
 *
 * @param container The host element to render into
 * @param message The empty state message to display
 */
export function renderEmptyState(container: HTMLElement, message: string = 'No data found'): void {
  let emptyState = container.querySelector<HTMLElement>('[data-testid="empty-state"]');
  if (!emptyState) {
    emptyState = document.createElement('div');
    emptyState.setAttribute('role', 'status');
    emptyState.setAttribute('aria-live', 'polite');
    emptyState.setAttribute('data-testid', 'empty-state');
    emptyState.className = 'empty-state';
    container.appendChild(emptyState);
  }
  emptyState.textContent = message;
}