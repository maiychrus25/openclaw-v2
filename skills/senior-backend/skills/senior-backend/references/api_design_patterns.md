# API Design Patterns

This document outlines the standard API design patterns for the Senior Backend Architect.

## 0. Core Tech Stack and Architecture

**Mandatory Stack & Practices:**
- **Node.js**: The runtime environment.
- **Express.js**: The default web framework for all API services.
- **TypeScript**: All backend code must be strongly typed using TypeScript.
- **Global Error Handler**: A centralized Express error-handling middleware (`(err, req, res, next)`) must logically catch all exceptions and format the error envelopes consistently (see section 3), instead of handling responses ad-hoc inside individual controllers.

## 1. REST vs GraphQL

### When to use REST
- Simple CRUD operations
- When caching at the HTTP layer is critical
- Public APIs where simplicity and standard HTTP methods are preferred
- Microservice-to-microservice communication

### When to use GraphQL
- Complex data fetching with nested relationships
- When clients need to specify exactly what data they need (minimize over-fetching)
- Rapid frontend iteration without requiring backend endpoint changes
- Aggregating data from multiple microservices

## 2. API Versioning

Always version your APIs from day one. Breaking changes must bump the version.

- **URI Versioning (Preferred for simplicity):** `/api/v1/users`
- **Header Versioning:** `Accept: application/vnd.company.v1+json`

## 3. Standardized API Response Structure

Every single API response—both successful and failed—must follow a consistent envelope structure. Do not return raw arrays or plain strings.

### Success Response Envelope
The success response must wrap the requested payload in a `data` object (and typically nested under a key like `doc`, `docs`, or the entity name) and include a `meta` object with timestamp and pagination details if applicable.

```json
// or one document
{
  "status": "success",
  "message": "your-message",
  "data": {
    "doc": {
      "id": "123",
      "email": "user@example.com"
    }
  },
  "meta": {
    "timestamp": "2026-03-24T08:00:00Z"
  }
}

// or list document
{
  "status": "success",
  "message": "your-message",
  "data": {
    "docs": [
      {
        "id": "123",
        "email": "user@example.com"
      }
    ],
    meta: {
      itemCount: 10,
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 1,
      totalItems: 100
    }
  }
}
```

### Async Error Handling wrapper (catchAsync)
Never use raw `try/catch` in every Express controller. Always wrap controllers in a high-order function (like `catchAsync`) that automatically forwards rejected promises to the Global Error Handler.

```typescript
export const getUser = catchAsync(async (req, res, next) => {
  const user = await userService.findById(req.params.id);
  res.status(200).json({
    data: { doc: user },
    meta: { timestamp: new Date().toISOString() }
  });
});
```

### Error Response Envelope
Errors should be thrown via custom `AppError` classes and caught by the Global Error Handler. The error response must be consistent:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The provided input data is invalid.",
    "details": [
      {
        "field": "email",
        "issue": "Must be a valid email address"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-24T08:00:00Z",
    "requestId": "req-123456"
  }
}
```

### HTTP Status Codes
- **200 OK:** Successful GET, PUT, PATCH
- **201 Created:** Successful POST
- **204 No Content:** Successful partial DELETE or void operations
- **400 Bad Request:** Validation errors
- **401 Unauthorized:** Missing or invalid authentication token
- **403 Forbidden:** Authenticated, but lacks required permissions
- **404 Not Found:** Resource does not exist
- **422 Unprocessable Entity:** Syntactically correct but semantically invalid
- **429 Too Many Requests:** Rate limit exceeded
- **500 Internal Server Error:** Unexpected backend failure

## 4. Pagination

### Offset-based Pagination
Best for simple lists where skipping records is acceptable and data doesn't change frequently.
- Parameters: `?page=2&limit=20` or `?skip=20&limit=20`
- **Warning:** `skip` becomes very slow with large collections in NoSQL databases.

### Cursor-based Pagination (Recommended for large datasets)
Best for feeds, real-time data, and high-performance requirements.
- Parameters: `?cursor=eyJpZCI6IjYwZDVmLi4uIn0=&limit=20`
- Uses an encoded pointer to the last seen item.

## 5. Idempotency

Ensure sensitive operations (like payments or order creation) are idempotent using an `Idempotency-Key` header.
- Store the key and the response. If the same key is received, return the cached result instead of re-processing.
