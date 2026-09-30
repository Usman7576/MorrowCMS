# Backend Scaffold

This directory is reserved for the future Express and MongoDB API. It is intentionally not wired into Activity 1 because the current assignment is a frontend-only prototype.

## Planned Layout

```text
backend/
|-- src/
|   |-- config/
|   |-- middleware/
|   |-- modules/
|   |   |-- auth/
|   |   |-- users/
|   |   |-- menu/
|   |   |-- orders/
|   |   |-- inventory/
|   |   |-- reports/
|   |   `-- audit/
|   |-- app.js
|   `-- server.js
`-- tests/
```

## Planned Responsibilities

- `app.js`: Express setup, security headers, JSON parsing, routes, and error handling.
- `server.js`: environment loading and HTTP process startup.
- `middleware/`: authentication, RBAC, validation, rate limiting, and request logging.
- `modules/`: feature-owned routes, controllers, services, schemas, and tests.
- `config/`: MongoDB connection and environment configuration.

Do not place real credentials, payment information, or production connection strings in this directory or in frontend files.
