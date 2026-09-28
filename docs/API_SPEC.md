# API Specification: Ticket QR Code Generator Worker

**Project:** Ticket QR Code Generator Worker  
**Ticket ID:** ENG-139055  
**Version:** 1.0.0  
**Data Format:** JSON (`application/json`)  
**QR Representation:** SVG markup string (`svgContent`)  

---

## Overview

This document specifies the RESTful API contracts used by the Ticket QR Code Generator Worker. The API supports ticket retrieval, search filtering, ticket creation, and asynchronous QR code generation.

---

## Standard Error Response Schema

All error responses share a standard JSON payload structure:

```json
{
  "error": "STRING_ERROR_CODE",
  "message": "Human-readable explanation of the error.",
  "errors": {
    "fieldName": "Specific validation failure message."
  }
}
```

Common HTTP status codes used:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Request validation failed.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Unique constraint violation (e.g., duplicate ticket number).
- `500 Internal Server Error`: Unexpected server/worker failure.

---

## Endpoints

### 1. `GET /api/tickets`

Retrieves a list of tickets, ordered by creation date descending. Supports optional text search.

#### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `search` | `string` | No | Search query matching against `ticketNumber`, `title`, or `holderName` (case-insensitive). |

#### Response `200 OK` (Records Found)
```json
{
  "data": [
    {
      "id": "c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11",
      "ticketNumber": "TKT-1001",
      "title": "General Admission Pass",
      "holderName": "Jane Doe",
      "qrCode": {
        "id": "e9b2c3a1-7d12-4c55-901e-2d3b4c5e6f7a",
        "ticketId": "c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11",
        "qrData": "TKT-1001:c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11",
        "svgContent": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" role=\"img\" aria-label=\"QR Code for Ticket TKT-1001\"><rect width=\"100%\" height=\"100%\" fill=\"#ffffff\"/><path d=\"...\" fill=\"#000000\"/></svg>",
        "status": "GENERATED",
        "generatedAt": "2026-09-28T09:00:00.000Z"
      },
      "createdAt": "2026-09-28T09:00:00.000Z",
      "updatedAt": "2026-09-28T09:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### Response `200 OK` (Empty State / No Results Found)
*Returned when the database is empty or no search results match the query.*
```json
{
  "data": [],
  "total": 0
}
```

---

### 2. `GET /api/tickets/:id`

Retrieves a single ticket and its associated QR code by UUID.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string (UUID)` | Yes | Unique identifier of the ticket. |

#### Response `200 OK`
```json
{
  "id": "c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11",
  "ticketNumber": "TKT-1001",
  "title": "General Admission Pass",
  "holderName": "Jane Doe",
  "qrCode": {
    "id": "e9b2c3a1-7d12-4c55-901e-2d3b4c5e6f7a",
    "ticketId": "c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11",
    "qrData": "TKT-1001:c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11",
    "svgContent": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" role=\"img\" aria-label=\"QR Code for Ticket TKT-1001\"><rect width=\"100%\" height=\"100%\" fill=\"#ffffff\"/><path d=\"...\" fill=\"#000000\"/></svg>",
    "status": "GENERATED",
    "generatedAt": "2026-09-28T09:00:00.000Z"
  },
  "createdAt": "2026-09-28T09:00:00.000Z",
  "updatedAt": "2026-09-28T09:00:00.000Z"
}
```

#### Response `404 Not Found`
```json
{
  "error": "NOT_FOUND",
  "message": "Ticket with ID 'c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11' not found."
}
```

---

### 3. `POST /api/tickets`

Validates ticket inputs, creates a new ticket record, and triggers QR code generation.

#### Request Headers
- `Content-Type: application/json`

#### Request Body
```json
{
  "ticketNumber": "TKT-1002",
  "title": "Technical Staff Pass",
  "holderName": "John Smith"
}
```

#### Field Specifications & Constraints
| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `ticketNumber` | `string` | Yes | 1–64 characters; trimmed; unique across all tickets. |
| `title` | `string` | Yes | 1–120 characters; trimmed; sanitized against XSS. |
| `holderName` | `string` | Yes | 1–120 characters; trimmed; sanitized against XSS. |

#### Response `201 Created`
```json
{
  "id": "d2e8c1b3-9c54-4f7b-b34e-5d4f23190b22",
  "ticketNumber": "TKT-1002",
  "title": "Technical Staff Pass",
  "holderName": "John Smith",
  "qrCode": {
    "id": "f0c3d4b2-8e23-4d66-a12f-3e4c5d6e7f8b",
    "ticketId": "d2e8c1b3-9c54-4f7b-b34e-5d4f23190b22",
    "qrData": "TKT-1002:d2e8c1b3-9c54-4f7b-b34e-5d4f23190b22",
    "svgContent": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" role=\"img\" aria-label=\"QR Code for Ticket TKT-1002\"><rect width=\"100%\" height=\"100%\" fill=\"#ffffff\"/><path d=\"...\" fill=\"#000000\"/></svg>",
    "status": "GENERATED",
    "generatedAt": "2026-09-28T09:05:00.000Z"
  },
  "createdAt": "2026-09-28T09:05:00.000Z",
  "updatedAt": "2026-09-28T09:05:00.000Z"
}
```

#### Response `400 Bad Request` (Validation Error)
*Returned when required fields are missing, empty, or invalid.*
```json
{
  "error": "VALIDATION_FAILED",
  "message": "Invalid input data.",
  "errors": {
    "ticketNumber": "Ticket number is required and cannot be empty.",
    "holderName": "Holder name is required."
  }
}
```

#### Response `409 Conflict` (Duplicate Ticket Number)
*Returned when `ticketNumber` already exists.*
```json
{
  "error": "DUPLICATE_TICKET_NUMBER",
  "message": "A ticket with number 'TKT-1002' already exists."
}
```

---

### 4. `POST /api/tickets/:id/generate-qr`

Triggers asynchronous QR code generation or regeneration for an existing ticket.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string (UUID)` | Yes | Unique identifier of the ticket. |

#### Response `200 OK`
```json
{
  "ticketId": "c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11",
  "qrCode": {
    "id": "e9b2c3a1-7d12-4c55-901e-2d3b4c5e6f7a",
    "ticketId": "c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11",
    "qrData": "TKT-1001:c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11",
    "svgContent": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" role=\"img\" aria-label=\"QR Code for Ticket TKT-1001\"><rect width=\"100%\" height=\"100%\" fill=\"#ffffff\"/><path d=\"...\" fill=\"#000000\"/></svg>",
    "status": "GENERATED",
    "generatedAt": "2026-09-28T09:10:00.000Z"
  }
}
```

#### Response `404 Not Found`
```json
{
  "error": "NOT_FOUND",
  "message": "Ticket with ID 'c1f7b0a2-8b43-4e6a-a23d-4c3e12089a11' not found."
}
```
