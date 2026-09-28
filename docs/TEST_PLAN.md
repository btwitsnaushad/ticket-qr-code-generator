# Test Plan: Ticket QR Code Generator Worker (ENG-139055)

**Project:** Ticket QR Code Generator Worker  
**Ticket ID:** ENG-139055  
**Methodology:** Test-Driven Development (TDD)  
**Test Runner:** Vitest + jsdom  
**Status:** Test Plan Authored & Test Suites Created (Pre-Implementation)  

---

## 1. Overview & TDD Strategy

Following the project requirements for **ENG-139055**, development adheres to a strict Test-Driven Development (TDD) workflow:
1. **Red Stage:** Tests are written first to formally define expected system behavior, domain contracts, validation constraints, and accessibility requirements.
2. **Green Stage (Next Step):** Minimal, robust implementation code will be written specifically to satisfy each test specification.
3. **Refactor Stage:** Clean up architecture, streamline code, and ensure monochromatic aesthetic guidelines and 100% Lighthouse targets are maintained.

No application feature or implementation code is written during this stage.

---

## 2. Requirement Traceability Matrix

| Requirement | Test Suite | Test File | Description |
| :--- | :--- | :--- | :--- |
| **Valid Ticket Creation** | Service / Integration | `tests/unit/ticketService.test.ts` | Validates ticket persistence, ID generation, timestamping, and QR code linkage. |
| **Required Field Validation** | Unit | `tests/unit/validator.test.ts` | Checks that `ticketNumber`, `title`, and `holderName` are required. |
| **Invalid / Empty Input** | Integration | `tests/integration/form-validation.test.ts` | Form blocks submission, highlights offending fields, displays inline errors, sets `aria-invalid`. |
| **Duplicate Ticket Number** | Unit / Service | `tests/unit/ticketService.test.ts`, `tests/unit/validator.test.ts` | Rejects duplicate ticket numbers with a 409 Conflict error. |
| **XSS / Input Sanitization** | Unit | `tests/unit/sanitizer.test.ts` | Strips script tags, HTML entities, event handlers before state storage and rendering. |
| **QR Code Generation & SVG Output** | Unit | `tests/unit/qrGenerator.test.ts` | Verifies deterministic payload encoding and valid SVG XML structure with `role="img"` and `<title>`. |
| **Empty Results ("No data found")** | Integration | `tests/integration/empty-state.test.ts` | Verifies `"No data found"` renders when database is empty or search returns 0 matches. |
| **Async Loading State** | Integration | `tests/integration/loading-indicator.test.ts` | Verifies visual loading indicator appears during async ops with `role="status"` and `aria-live="polite"`. |
| **Analytics Console Logging** | Unit | `tests/unit/analytics.test.ts` | Verifies structured console logs on ticket creation, QR generation, search, and list refresh. |
| **Keyboard Navigation & ARIA** | Integration | `tests/integration/accessibility.test.ts` | Verifies tab sequence, label-for bindings, high contrast, and accessible naming for 100% Lighthouse. |

---

## 3. Unit Test Specifications (`tests/unit/`)

### 3.1 `tests/unit/sanitizer.test.ts`
- **Goal:** Verify that all raw text inputs are strictly sanitized against Cross-Site Scripting (XSS).
- **Cases:**
  1. Strips `<script>` tags and internal executable code.
  2. Strips malicious HTML event handlers (e.g., `<img src="x" onerror="alert(1)">`).
  3. Escapes dangerous characters (`<`, `>`, `"`, `'`, `&`).
  4. Trims leading and trailing whitespace.
  5. Preserves legitimate alphanumeric characters, hyphens, spaces, and punctuation.
  6. Safely handles empty strings, nullish inputs, and non-string inputs.

### 3.2 `tests/unit/validator.test.ts`
- **Goal:** Verify field-level and form-level validation rules.
- **Cases:**
  1. Validates a complete, compliant ticket payload successfully.
  2. Flags missing or whitespace-only `ticketNumber` as invalid.
  3. Flags missing or whitespace-only `title` as invalid.
  4. Flags missing or whitespace-only `holderName` as invalid.
  5. Enforces maximum length constraints (64 chars for ticket number, 120 chars for title and holder).
  6. Enforces uniqueness constraint on `ticketNumber`.

### 3.3 `tests/unit/qrGenerator.test.ts`
- **Goal:** Verify deterministic QR code encoding and SVG markup generation.
- **Cases:**
  1. Generates deterministic `qrData` following the standard format: `${ticketNumber}:${id}`.
  2. Outputs valid SVG markup containing `<svg>`, `<rect>`, or `<path>` elements.
  3. Includes accessible SVG metadata: `role="img"`, `aria-label`, and `<title>`.
  4. Generates SVG with viewBox and scalable dimensional attributes.
  5. Returns status `'GENERATED'` and a valid ISO timestamp upon completion.
  6. Handles error states appropriately and marks status as `'FAILED'` on unrecoverable generation errors.

### 3.4 `tests/unit/analytics.test.ts`
- **Goal:** Verify that primary user actions emit structured console telemetry.
- **Cases:**
  1. Logs `[Analytics] Ticket Created` with `ticketNumber`, `id`, and `timestamp`.
  2. Logs `[Analytics] QR Code Generated` with `ticketId`, `qrData`, and `timestamp`.
  3. Logs `[Analytics] Ticket Searched` with search `query`, `resultsCount`, and `timestamp`.
  4. Logs `[Analytics] Ticket List Refreshed` with `total` count and `timestamp`.
  5. Output format strictly matches the `AnalyticsEvent` contract.

### 3.5 `tests/unit/ticketService.test.ts`
- **Goal:** Verify ticket CRUD operations and business worker logic.
- **Cases:**
  1. `createTicket`: Creates and stores a ticket with a generated UUID, timestamps, and linked SVG QRCode.
  2. `createTicket`: Throws/rejects when `ticketNumber` already exists.
  3. `getTickets`: Retrieves all tickets ordered by creation date descending.
  4. `getTickets`: Filters tickets by search query matching ticket number, title, or holder name.
  5. `getTickets`: Returns `{ data: [], total: 0 }` when no records exist or match.
  6. `getTicketById`: Retrieves specific ticket or returns null/404 error when not found.
  7. `regenerateQRCode`: Asynchronously regenerates the QR code for an existing ticket.

---

## 4. Integration Test Specifications (`tests/integration/`)

### 4.1 `tests/integration/form-validation.test.ts`
- **Goal:** Verify UI form validation, error states, and submission blocking.
- **Cases:**
  1. Prevents form submission when required fields are missing.
  2. Highlights offending fields with error borders.
  3. Displays inline error messages tied to inputs via `aria-describedby`.
  4. Sets `aria-invalid="true"` on invalid inputs.
  5. Shifts focus to the first invalid field upon rejected submission.
  6. Clears invalid state when valid data is entered.
  7. Successfully submits valid data and resets form fields.

### 4.2 `tests/integration/empty-state.test.ts`
- **Goal:** Verify user-friendly `"No data found"` empty-state messaging.
- **Cases:**
  1. Displays `"No data found"` message when the ticket repository is initially empty.
  2. Does not render broken table headers or empty border grids in empty state.
  3. Displays `"No data found"` message when a search query returns 0 matches.
  4. Restores ticket listing when search input is cleared.
  5. Empty state component has `role="status"` for screen reader awareness.

### 4.3 `tests/integration/loading-indicator.test.ts`
- **Goal:** Verify visual loading indicator during asynchronous operations and network latency.
- **Cases:**
  1. Displays loading indicator immediately when an async ticket creation begins.
  2. Disables submit button while async operation is pending to prevent duplicate submissions.
  3. Loading indicator includes `role="status"`, `aria-live="polite"`, and `aria-busy="true"`.
  4. Hides loading indicator and re-enables submit button upon async completion.
  5. Displays loading indicator during simulated asynchronous search/fetch operations.

### 4.4 `tests/integration/accessibility.test.ts`
- **Goal:** Verify WCAG AAA monochromatic contrast, ARIA semantics, and keyboard navigation for 100% Lighthouse accessibility.
- **Cases:**
  1. All interactive elements (`<input>`, `<button>`) are reachable via sequential `Tab` key navigation.
  2. Focused elements display a visible, high-contrast focus outline.
  3. Every `<input>` has an associated `<label>` with matching `for` / `id`.
  4. Page includes exactly one `<h1>` heading with logical heading hierarchy.
  5. SVG QR codes include accessible descriptions (`role="img"`, `<title>`).
  6. Color styling uses strictly monochromatic palette meeting minimum contrast ratio $\ge 18:1$ for text and $\ge 4.5:1$ for controls.

---

## 5. Execution & TDD Progression

- Tests run using `npm test` (`vitest run`).
- In accordance with TDD:
  1. Currently, all tests will fail (or indicate missing implementation modules).
  2. Next implementation step will create pure core logic (`types.ts`, `sanitizer.ts`, `validator.ts`).
  3. Unit tests will turn green.
  4. Next, service logic and UI components will be implemented to turn integration tests green.
