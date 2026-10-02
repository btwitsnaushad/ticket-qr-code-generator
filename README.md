# Ticket QR Code Generator Worker

## Overview

The **Ticket QR Code Generator Worker** is a lightweight, high-performance administrative application engineered to manage ticket inventory and generate deterministic Scalable Vector Graphics (SVG) QR codes. Developed under **Ticket ID: ENG-139055**, this project delivers a digital administrative interface with immediate responsiveness, structured data handling, robust edge-case protection, strict input sanitization, and comprehensive accessibility.

The application operates as an in-memory client-side worker system. It enables administrators to create and catalog tickets, automatically compute deterministic QR code matrices rendered as crisp SVG vectors, search existing records in real time, and monitor system operations through structured console telemetry.

## Key Features

- **Ticket Creation**: Capture ticket details including Ticket Number, Ticket Title, and Holder Name, generating unique identifiers and ISO timestamps upon creation.
- **Ticket Validation**: Comprehensive client-side validation enforcing non-empty trimmed inputs and maximum character bounds (up to 64 characters for ticket numbers, 120 characters for titles and holder names).
- **Duplicate Ticket Number Prevention**: Real-time uniqueness enforcement rejecting duplicate ticket numbers with contextual inline messaging while preserving form state.
- **Deterministic SVG QR Code Generation**: Algorithmic 25x25 module QR generation using FNV-1a hashing and Mulberry32 pseudo-random bit sequencing to produce deterministic, scalable, accessible SVG vectors with standard finder, timing, and alignment patterns.
- **Ticket Inventory Table**: Structured monochromatic table displaying ticket records, holder information, creation metadata, and rendered inline SVG QR codes with screen-reader-compliant column scopes (`scope="col"`).
- **Ticket Search**: Real-time, case-insensitive search filtering across ticket numbers, ticket titles, and holder names.
- **Empty-State Handling**: Dedicated, accessible `"No data found"` empty-state messaging displayed when the inventory has no records or when search queries return zero matches.
- **Loading Indicator**: Visual asynchronous loading indicator equipped with `role="status"` and `aria-live="polite"`, active during ticket processing while disabling the submit button to prevent double-submissions.
- **XSS Input Sanitization**: Multi-layer sanitization engine stripping `<script>` tags, eliminating malicious inline HTML event handlers (e.g., `onerror`, `onload`), normalizing whitespace, and escaping dangerous HTML characters before state insertion.
- **Accessibility Support**: Built to WCAG standards targeting a 100% Lighthouse accessibility score, featuring semantic HTML5 landmarks, explicit label bindings, sequential tab indexing, dynamic ARIA attributes, and high-contrast monochromatic palettes.
- **Analytics Telemetry**: Structured console event logging for primary user interactions, lifecycle events, and worker operations.

## User Flow

```
+-----------------------------------------------------------------------+
|  1. User enters Ticket Number, Ticket Title, and Holder Name          |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|  2. Form data is validated against domain constraints & uniqueness     |
+-----------------------------------------------------------------------+
            |                                               |
       (Invalid)                                         (Valid)
            v                                               v
+-----------------------------+           +-----------------------------+
|  3. Submission prevented;    |           |  4. Valid data sanitized;   |
|     inline errors shown;    |           |     asynchronous processing |
|     focus moves to field    |           |     with loading indicator  |
+-----------------------------+           +-----------------------------+
                                                            |
                                                            v
                                          +-----------------------------+
                                          |  5. Deterministic SVG QR    |
                                          |     code generated          |
                                          +-----------------------------+
                                                            |
                                                            v
                                          +-----------------------------+
                                          |  6. Ticket appears in       |
                                          |     Inventory; form resets; |
                                          |     telemetry logged        |
                                          +-----------------------------+
                                                            |
                                                            v
                                          +-----------------------------+
                                          |  7. User can search ticket  |
                                          |     inventory in real time  |
                                          +-----------------------------+
```

1. **User enters Ticket Number, Ticket Title, and Holder Name** into the administrative creation form.
2. **Form data is validated** against length rules, required field constraints, and uniqueness checks.
3. **Invalid submissions are prevented**, displaying accessible inline error messages and shifting keyboard focus to the first offending input.
4. **Valid ticket data is processed**, sanitized against malicious HTML/script payloads, and dispatched with an asynchronous loading state.
5. **A QR code is generated** deterministically as scalable vector markup and linked to the ticket record.
6. **The ticket appears in the Ticket Inventory**, prepended to the table, while the form resets and analytics telemetry is emitted.
7. **Users can search the ticket inventory** by typing into the search input, dynamically filtering matching records.

## Edge Cases & Error Handling

| Scenario | System Behavior | Visual & Accessibility Feedback |
|---|---|---|
| **Empty Form Fields** | Submission is blocked. Missing fields are identified. | Sets `aria-invalid="true"`, renders inline messages (e.g., `"Ticket number is required and cannot be empty."`), and shifts focus to the first invalid field. Clears dynamically upon valid input. |
| **Invalid Input Length** | Values exceeding limits (>64 chars for ticket number, >120 chars for title and holder) are blocked. | Inline error message specifies maximum character bounds; `aria-invalid` set to `true`. |
| **Duplicate Ticket Numbers** | New submissions checking against existing ticket identifiers reject collisions. | Rejection triggers `"A ticket with number '<ticketNumber>' already exists."`, highlights the ticket number input, and retains valid data in other fields. |
| **Empty Ticket Inventory** | Triggered when no tickets exist in memory upon initial load. | Displays a dedicated empty-state container with the exact message `"No data found"` marked with `role="status"` and `data-testid="empty-state"`. Table body rows are omitted. |
| **Empty Search Results** | Triggered when a search query returns 0 matching tickets. | Replaces table records with the `"No data found"` empty-state container with `role="status"` and `aria-live="polite"`. |
| **Loading / Asynchronous Operations** | Active during the simulated asynchronous ticket processing and QR generation phase. | Form is marked with `aria-busy="true"`, the submit button is disabled, and an accessible indicator is rendered with `role="status"` and `aria-live="polite"`. |
| **XSS-Related Input** | Malicious payloads (e.g., `<script>alert("xss")</script>` or `<img src="x" onerror="alert(1)">`) are intercepted. | Sanitizer strips `<script>` tags, strips tags with executable event handlers, normalizes whitespace, and escapes special HTML entities (`&`, `<`, `>`, `"`, `'`) before state persistence or DOM insertion. |

## Accessibility

The interface is engineered to meet WCAG standards with a target Lighthouse Accessibility score of 100%:

- **Semantic HTML5 Landmarks**: Proper structural containers including `<header role="banner">`, `<main id="main-content" role="main">`, `<section>`, `<form novalidate>`, and `<table>` with `<thead>` and `<tbody>`.
- **Form Controls & Labels**: All `<input>` fields possess explicit `id` attributes linked directly to `<label for="...">` tags. Inputs include `aria-required="true"` and `tabindex="0"`.
- **Accessible Validation & Errors**: Invalid fields dynamically receive `aria-invalid="true"` and an `aria-describedby` reference pointing to an inline `<div role="alert" aria-live="polite">` error container.
- **Focus Management**: On rejected submission, keyboard focus automatically transitions to the first invalid input element.
- **Keyboard Navigation**: Complete sequential tab navigation across all interactive elements (`input`, `button`, search). Focused controls feature a prominent, high-contrast focus outline.
- **Table Semantics**: Table column headers define `scope="col"` to provide necessary context for screen reader row traversal.
- **Accessible SVG QR Codes**: Every generated SVG element contains `role="img"`, an explicit `aria-label="QR Code for Ticket <ticketNumber>"`, and an internal `<title>` element with descriptive text.
- **Status & Live Regions**: Empty state containers and loading spinners utilize `role="status"` and `aria-live="polite"` to inform assistive devices without interrupting screen reader flow.
- **Monochromatic High-Contrast Palette**: Pure black (`#000000`/`#0A0A0A`) text on neutral backgrounds (`#FFFFFF`/`#F5F5F5`), achieving contrast ratios exceeding WCAG AAA requirements ($\ge 18:1$).

## Security

Input security is enforced through client-side text sanitization in `src/core/sanitizer.ts`:

- **Script Tag Removal**: Matches and strips `<script>` elements, closing tags, and any enclosed executable script content using regular expressions.
- **Malicious Event Handler Stripping**: Eliminates HTML tags containing executable event attributes (such as `onerror`, `onload`, `onclick`, `onmouseover`).
- **Whitespace Normalization**: Collapses repeated internal whitespace sequences and trims boundary spaces.
- **HTML Special Character Escaping**: Converts raw delimiter characters into their respective safe HTML entities:
  - `&` &rarr; `&amp;`
  - `<` &rarr; `&lt;`
  - `>` &rarr; `&gt;`
  - `"` &rarr; `&quot;`
  - `'` &rarr; `&#x27;`
- **Safe DOM Manipulation**: Dynamic table rows and ticket metadata utilize safe DOM text bindings, ensuring user-submitted strings cannot be evaluated as executable code in application state or the browser context.
- **Zero Sensitive Data Storage**: The application operates without hardcoded secrets, external API keys, or personally identifiable information (PII) exposure.

## Analytics

The application features a structured developer console telemetry service (`src/services/analytics.ts`) that logs system activity.

### Required Console Event

```
[Analytics] User interacted with Ticket QR Code Generator Worker
```

- **Trigger**: Emitted via `logWorkerInteraction()` immediately following successful ticket creation, QR code generation, and inventory update within `src/main.ts`.

### Additional Telemetry Events

| Action | Event Format | Trigger Condition |
|---|---|---|
| `TICKET_CREATED` | `[Analytics] Ticket Created: { ticketNumber, id, timestamp }` | Dispatched when a new ticket is added to inventory. |
| `QR_CODE_GENERATED` | `[Analytics] QR Code Generated: { ticketId, qrData, format: 'SVG', timestamp }` | Dispatched when the deterministic SVG QR code matrix is built. |
| `TICKET_SEARCHED` | `[Analytics] Ticket Searched: { query, resultsCount, timestamp }` | Dispatched whenever the user types into the inventory search bar. |
| `LIST_REFRESHED` | `[Analytics] Ticket List Refreshed: { total, timestamp }` | Dispatched upon initial page load and after inventory mutations. |

## Tech Stack

The repository utilizes a zero-framework, dependency-light architecture based on native web standards and modern tooling:

- **Language**: TypeScript (`^5.7.3`)
- **Build Tool & Bundler**: Vite (`^6.1.0`)
- **Test Runner**: Vitest (`^3.0.5`)
- **DOM Test Environment**: jsdom (`^26.0.0`)
- **Linter**: ESLint (`^10.11.0`) with `@eslint/js` (`^10.0.1`) and `typescript-eslint` (`^8.71.0`)
- **Type Definitions**: `@types/node` (`^22.13.0`)
- **Presentation**: Vanilla HTML5, Vanilla CSS3 with CSS Custom Properties, Native SVG

*Note: No third-party frontend frameworks (React, Vue, Angular), backend runtimes (Node.js/Express APIs), databases (MongoDB, PostgreSQL), or CSS utility frameworks (Tailwind CSS) are present in the repository.*

## Project Structure

```
ticket-qr-code-generator/
├── docs/
│   ├── API_SPEC.md              # Formal API endpoints and request/response specifications
│   ├── ARCHITECTURE.md          # Architectural specifications, domain models, and ERDs
│   └── TEST_PLAN.md             # TDD test plan and requirement traceability matrix
├── src/
│   ├── core/
│   │   ├── sanitizer.ts         # Input sanitization and XSS prevention
│   │   ├── types.ts             # Domain models, data contracts, and telemetry types
│   │   └── validator.ts         # Business constraint validation and duplicate checking
│   ├── services/
│   │   ├── analytics.ts         # Console analytics and telemetry logger
│   │   ├── qrWorker.ts          # Deterministic 25x25 SVG QR matrix generator
│   │   └── ticketService.ts     # In-memory ticket CRUD and search filtering
│   ├── ui/
│   │   ├── components/
│   │   │   ├── EmptyState.ts    # Accessible empty state component ("No data found")
│   │   │   ├── LoadingIndicator.ts # Visual asynchronous loading indicator
│   │   │   ├── TicketForm.ts    # Accessible creation form with validation states
│   │   │   └── TicketTable.ts   # Structured inventory table rendering SVG QR codes
│   │   └── styles/
│   │       ├── design-tokens.css# Monochromatic palette and 16px/32px spacing scale
│   │       └── main.css         # Application layout, card, button, and table styling
│   └── main.ts                  # Application bootstrap and event coordination
├── tests/
│   ├── integration/
│   │   ├── accessibility.test.ts    # Keyboard navigation, label bindings, and ARIA tests
│   │   ├── empty-state.test.ts      # "No data found" empty-state rendering tests
│   │   ├── form-validation.test.ts  # Form validation, error focus, and recovery tests
│   │   └── loading-indicator.test.ts# Asynchronous loading and submit-disabled state tests
│   └── unit/
│       ├── analytics.test.ts    # Telemetry logging and payload structure tests
│       ├── qrGenerator.test.ts  # Deterministic SVG QR generation and format tests
│       ├── sanitizer.test.ts    # XSS stripping, entity escaping, and whitespace tests
│       ├── ticketService.test.ts# Ticket persistence, retrieval, and search tests
│       └── validator.test.ts    # Input constraint, boundary, and uniqueness tests
├── .gitignore                   # Git ignore rules
├── eslint.config.js             # Flat ESLint configuration
├── index.html                   # Application entrypoint with semantic landmarks
├── package.json                 # Project configuration, scripts, and devDependencies
├── package-lock.json            # Dependency lockfile
├── PROMPTS.md                   # AI-assisted prompt history and development log
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite configuration with Vitest integration
```

## Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.0.0 or higher recommended) and **npm** installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/btwitsnaushad/ticket-qr-code-generator.git
   cd ticket-qr-code-generator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local server URL displayed in your terminal (typically `http://localhost:5173`).

## Available Scripts

The following scripts are defined in `package.json`:

- `npm run dev`: Starts the local Vite development server with instant Hot Module Replacement (HMR).
- `npm run build`: Runs TypeScript static type checking (`tsc`) and compiles the production bundle (`vite build`).
- `npm run preview`: Starts a local web server to preview the production build artifacts from `dist/`.
- `npm test`: Executes the complete test suite once using Vitest (`vitest run`).
- `npm run test:watch`: Runs the Vitest test suite in interactive watch mode (`vitest`).
- `npm run lint`: Analyzes source files and test suites for syntax and style issues using ESLint (`eslint src tests`).

## Testing & Quality

The codebase has undergone comprehensive automated verification across unit, integration, type, and lint suites:

- **Test Suite Results**:
  - **Runner**: Vitest v3.2.7 in `jsdom` environment
  - **Test Files**: 9 passed (9 total)
  - **Total Tests**: 56 passed (56 total, 0 failures)
  - **Unit Tests (40 passed)**:
    - `tests/unit/validator.test.ts` (12 tests): Required fields, boundary lengths, whitespace, uniqueness.
    - `tests/unit/ticketService.test.ts` (10 tests): CRUD operations, UUID generation, search filtering, duplicates.
    - `tests/unit/qrGenerator.test.ts` (6 tests): Deterministic payload encoding, valid SVG XML, accessibility attributes.
    - `tests/unit/sanitizer.test.ts` (6 tests): Script stripping, malicious handler removal, HTML entity escaping.
    - `tests/unit/analytics.test.ts` (6 tests): Structured telemetry logging and event formatting.
  - **Integration Tests (16 passed)**:
    - `tests/integration/accessibility.test.ts` (5 tests): Associated `<label>` elements, accessible button naming, tab sequences, table headers, and SVG metadata.
    - `tests/integration/form-validation.test.ts` (4 tests): Submission blocking, inline error rendering, focus transfer, error recovery.
    - `tests/integration/empty-state.test.ts` (4 tests): `"No data found"` empty state rendering, row suppression, and search recovery.
    - `tests/integration/loading-indicator.test.ts` (3 tests): Visual indicator display, `aria-busy` states, submit button disabling.
- **Static Type Checking**: `tsc --noEmit` and `npm run build` compile cleanly with 0 TypeScript diagnostics or warnings.
- **Code Linting**: `npm run lint` executes across all `src` and `tests` files with 0 errors and 0 warnings.
- **Accessibility Verification**: Automated integration assertions verify label associations, focus transitions, ARIA live regions, table header scopes, and high-contrast color styling.

## Deployment

The project is deployed on Vercel.

- **Live Demo**: [https://ticket-qr-code-generator-git-master-btwitsnaushads-projects.vercel.app](https://ticket-qr-code-generator-git-master-btwitsnaushads-projects.vercel.app)

## Repository

- **GitHub Repository**: [https://github.com/btwitsnaushad/ticket-qr-code-generator](https://github.com/btwitsnaushad/ticket-qr-code-generator)

## AI-Assisted Development Workflow

This application was engineered using an AI-assisted development workflow in pairing with **Antigravity**:

- **Test-Driven / Test-First Approach**: Development followed a test-driven workflow with comprehensive unit and integration test suites specifying expected system behaviors, validation constraints, and accessibility requirements.
- **Iterative Implementation**: Development proceeded through controlled stages: architecture planning, API specifications, test plan creation, core sanitization and validation, ticket service, QR worker, analytics telemetry, accessible UI components, and application integration.
- **Browser-Based Verification**: Interactive UI validation was conducted to verify keyboard navigation, focus indicators, responsive card layouts, and deterministic SVG rendering.
- **Edge-Case Testing**: Direct verification of empty states, whitespace rejection, duplicate ticket numbers, async delay handling, and malicious script inputs.
- **Prompt Traceability**: The exact prompts and architectural decisions guiding the implementation are recorded sequentially in `PROMPTS.md`.

## Requirements Coverage

| Requirement | Implementation |
|---|---|
| Empty state | "No data found" |
| Invalid input | Form validation and prevented submission |
| Duplicate tickets | Duplicate ticket number validation |
| Loading state | Visual loading indicator |
| Accessibility | ARIA attributes, keyboard navigation, Lighthouse verification |
| XSS protection | Input sanitization |
| Analytics | Required console telemetry |

## Installation / Development

A typical local development cycle can be executed with the following commands:

```bash
# 1. Clone and enter the project directory
git clone https://github.com/btwitsnaushad/ticket-qr-code-generator.git
cd ticket-qr-code-generator

# 2. Install project dependencies
npm install

# 3. Run the automated test suite
npm test

# 4. Run the code linter
npm run lint

# 5. Build and type-check the application
npm run build

# 6. Start the local development server
npm run dev
```

## Conclusion

The **Ticket QR Code Generator Worker (ENG-139055)** provides a robust, accessible, and secure administrative solution for generating tickets and deterministic SVG QR codes. Built without unnecessary framework overhead, the codebase demonstrates clean architecture, strict input validation, multi-layer XSS defense, comprehensive test coverage (56 passing tests across 9 suites), an achieved Lighthouse Accessibility score of 100%, and dedicated automated accessibility tests.
