import { CreateTicketInput, ValidationResult, ValidationErrors } from './types';

/**
 * Validates ticket input parameters against domain constraints and business rules.
 *
 * Rules:
 * - ticketNumber: required, non-whitespace, max 64 chars, unique across existing numbers.
 * - title: required, non-whitespace, max 120 chars.
 * - holderName: required, non-whitespace, max 120 chars.
 *
 * @param payload The ticket input fields to validate
 * @param existingNumbers Optional list of existing ticket numbers to check for uniqueness
 * @returns ValidationResult containing isValid flag and field-specific error messages
 */
export function validateTicketInput(
  payload: CreateTicketInput,
  existingNumbers?: string[]
): ValidationResult {
  const errors: ValidationErrors = {};

  // 1. Ticket Number Validation
  const rawTicketNumber = payload?.ticketNumber;
  if (typeof rawTicketNumber !== 'string' || rawTicketNumber.trim().length === 0) {
    errors.ticketNumber = 'Ticket number is required and cannot be empty.';
  } else {
    const trimmedNumber = rawTicketNumber.trim();
    if (trimmedNumber.length > 64) {
      errors.ticketNumber = 'Ticket number cannot exceed 64 characters.';
    } else if (existingNumbers && existingNumbers.includes(trimmedNumber)) {
      errors.ticketNumber = 'A ticket with this number already exists.';
    }
  }

  // 2. Title Validation
  const rawTitle = payload?.title;
  if (typeof rawTitle !== 'string' || rawTitle.trim().length === 0) {
    errors.title = 'Ticket title is required.';
  } else {
    const trimmedTitle = rawTitle.trim();
    if (trimmedTitle.length > 120) {
      errors.title = 'Ticket title cannot exceed 120 characters.';
    }
  }

  // 3. Holder Name Validation
  const rawHolderName = payload?.holderName;
  if (typeof rawHolderName !== 'string' || rawHolderName.trim().length === 0) {
    errors.holderName = 'Holder name is required.';
  } else {
    const trimmedHolderName = rawHolderName.trim();
    if (trimmedHolderName.length > 120) {
      errors.holderName = 'Holder name cannot exceed 120 characters.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
