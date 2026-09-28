# Prompt History: Ticket QR Code Generator Worker (ENG-139055)

## Prompt 1: Initial Architecture Planning
```text
I want to start this project by understanding the requirements properly before we build anything.

Please go through the requirements for Ticket QR Code Generator Worker (ENG-139055) and help me make the initial architecture plan.

For now, don't write any feature or implementation code. I only want to understand and plan:

- what the main user flow should be
- what should happen in normal and error situations
- what data we need to store
- how the database should be structured
- what the ERD should look like
- what API endpoints we will need and what request/response data they should use
- what validation and security checks are needed
- what accessibility requirements we need to keep in mind
- what the project structure should look like

Please stay within the requirements given for this ticket and don't add unnecessary features. If something is not clearly specified, point it out instead of assuming it.

Let's keep this as planning only for now. We will decide the implementation after reviewing the architecture.
```

---

## Prompt 2: Finalizing Architecture Decisions & Planning Documentation
```text
The architecture plan looks good overall. I want to finalize the few decisions that were left open before we move ahead.

For this project, let's use Vite with TypeScript for the application setup, and use SVG for rendering the QR code in the interface.

Now please update the architecture documentation with these decisions and create the planning files we discussed:

- `docs/ARCHITECTURE.md`
- `docs/API_SPEC.md`
- `PROMPTS.md`

In `PROMPTS.md`, keep the exact prompts from our conversation so far in the same order, starting with the architecture planning prompt as Prompt 1 and this prompt as Prompt 2.

Please keep everything within the existing ticket requirements. Don't add extra features, and don't create any implementation code or test files yet.

Once you're done, show me which files were created or updated so I can review them before we commit this step.
```

---

## Prompt 3: Test Plan & TDD Test Suites Creation
```text
The architecture and API planning is now committed and the working tree is clean.

Before we start building the actual features, I want to follow the TDD approach from the project requirements.

Please create the test plan and test files first, based on the finalized architecture and requirements we already agreed on.

Cover the important cases such as:

- valid ticket creation
- required field validation
- invalid or empty input
- duplicate ticket number
- XSS/input sanitization
- QR code generation and SVG output
- empty ticket/search results
- loading state during async operations
- analytics console logging
- keyboard navigation and ARIA requirements

Use the project stack we already decided on (Vite + TypeScript).

Do not implement the actual application features yet. I want the tests to describe the expected behaviour first, so that we can implement against them afterwards.

Also update `PROMPTS.md` by adding this exact prompt as Prompt 3, keeping the previous prompts unchanged.

When you finish, tell me which test files were created and what each one is checking.
```

---

## Prompt 4: Diagnostic Check & Setup Resolution
```text
I can see the test files and project setup have been created, but there are currently 16 problems showing in the project.

Before I accept these changes, I want to understand what is causing them.

Please check the current problems and run the test suite if possible.

Separate the results into two groups:

1. Problems that are expected because the actual application features have not been implemented yet.
2. Problems that are genuine setup, configuration, TypeScript, or test errors that should be fixed at this stage.

Please fix only the genuine setup/configuration/test errors. Do not implement the actual application features just to make the tests pass yet.

Also, don't remove or weaken any of the tests we created.

After checking, tell me:
- how many tests are currently passing
- how many are failing
- which failures are expected at this TDD stage
- whether the project setup is ready for implementation

Also add this exact prompt to `PROMPTS.md` as Prompt 4.
```

---

## Prompt 5: TDD Pre-Implementation Audit & Verification
```text
The setup check looks much better now and the TypeScript diagnostics are clean.

Before I accept these changes, I noticed that several files have been created under `src`, including the sanitizer, validator, QR worker, analytics, ticket service and UI component files.

Since we agreed to follow TDD and write the tests before implementing the actual features, I want to make sure we have not started the feature implementation too early.

Please review the files currently created under `src` and tell me which ones contain actual application logic and which ones are only types, test support, or necessary project setup.

If any actual feature implementation has been added at this stage, remove or revert only that implementation while keeping:
- the test files
- the test configuration
- the TypeScript/Vite setup
- the project documentation
- `PROMPTS.md`

Please do not change or weaken the tests.

After this check, run the test suite again and tell me the final test result, including which failures are expected because the features have not been implemented yet.

Also add this exact prompt to `PROMPTS.md` as Prompt 5.
```

---

## Prompt 6: Core Validation & Sanitization Implementation
```text
The TDD setup is now committed and the working tree is clean.

I want to start implementing the application in small pieces instead of building everything at once.

Let's start with the core input handling because the ticket creation flow depends on it.

Please implement the validation and sanitization logic in the existing `src/core/validator.ts` and `src/core/sanitizer.ts` files.

It should cover the behaviour already described in our tests and architecture, including:

- required ticket fields
- empty or whitespace-only values
- valid ticket numbers
- duplicate ticket numbers when existing numbers are provided
- reasonable input length validation
- sanitizing unsafe HTML/script content before it can be used by the application

Please keep the implementation focused only on validation and sanitization. Don't build the UI, database, QR generation, analytics, or other features yet.

After implementing it, run the relevant validator and sanitizer tests and show me the result. If a test fails, explain why rather than changing the test just to make it pass.

Also add this exact prompt to `PROMPTS.md` as Prompt 6, keeping all previous prompts unchanged.
```

---

## Prompt 7: Ticket Service Implementation
```text
I’ve finished the validation and input sanitization step, and the related changes are already committed.

Now I want to move to the next small part of the implementation: the ticket service.

Please implement only the ticket service behaviour described in the existing architecture, API specification, and TDD tests.

Before changing anything, review the existing ticket service tests and the current project structure so the implementation matches what we already planned.

For this step, focus on:

- creating a ticket with valid data
- generating a unique ticket identifier/number when required
- returning the created ticket in the expected structure
- preventing duplicate ticket numbers
- getting a ticket by its identifier
- returning an appropriate result when a ticket does not exist
- keeping the existing validation and sanitization behaviour intact

Please follow the existing TypeScript/Vite project structure and keep the implementation simple and focused.

Do not implement the UI, QR code generation, analytics, search interface, or other features yet. Those should remain for their own steps.

After implementing the ticket service, run only the relevant ticket-service tests first, then run the TypeScript check if needed.

If any test fails, explain the reason and fix the implementation rather than changing or weakening the existing tests.

Also update `PROMPTS.md` by adding this exact prompt as Prompt 7, keeping Prompts 1 through 6 unchanged.

When finished, tell me:
1. which files were changed,
2. which ticket-service behaviours were implemented,
3. the test result,
4. whether TypeScript has any errors.
```
