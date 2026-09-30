# Full-Stack Architecture Roadmap

## Why MongoDB Is Not Needed Yet

Development Activity 1 assesses a hosted frontend prototype. There is no backend contract, real user account, persistent order flow, or production data to store yet. Adding MongoDB now would create configuration and deployment work without improving the required pages or interactions.

For this phase:

- Login is a demo client-side validation flow.
- The session guard uses browser storage only to demonstrate navigation behavior.
- Menu and table data are local prototype data.
- No real customer, payment, credential, or business data should be entered.

## Recommended Future Structure

```text
/
|-- frontend/
|   |-- index.html, login.html, dashboard.html # Activity 1 pages
|   |-- styles.css, app.js                     # Shared frontend assets
|   `-- README.md
|-- docs/
|   `-- ARCHITECTURE.md
|-- backend/
|   |-- src/
|   |   |-- config/                          # Environment and Mongo connection
|   |   |-- middleware/                      # Auth, RBAC, validation, error handling
|   |   |-- modules/
|   |   |   |-- auth/                        # Login, sessions, password reset
|   |   |   |-- users/                       # Roles and staff profiles
|   |   |   |-- menu/                        # Items, categories, availability
|   |   |   |-- orders/                      # Orders and status transitions
|   |   |   |-- inventory/                   # Stock and suppliers
|   |   |   |-- reports/                     # Aggregations and sales summaries
|   |   |   `-- audit/                       # Immutable critical-action events
|   |   |-- app.js                           # Express app and middleware
|   |   `-- server.js                        # Process entry point
|   |-- tests/
|   `-- README.md
|-- vercel.json                               # Routes the public URL to frontend/
`-- README.md
```

## Migration Sequence

1. Keep this prototype deployable while the backend is created separately.
2. Define API contracts for auth, menu, orders, inventory, and audit events.
3. Add Express, MongoDB driver or Mongoose, environment variables, and server-side validation.
4. Move the current inline prototype data behind API calls.
5. Replace browser-only login state with secure HTTP-only session cookies.
6. Enforce RBAC on every protected API route; frontend visibility is not authorization.
7. Add indexes, backups, audit retention, rate limiting, and security tests before production use.

## Initial MongoDB Collections

- `users`
- `menuItems`
- `orders`
- `inventoryItems`
- `suppliers`
- `auditEvents`

Payment card details must not be stored in MongoDB. Use a trusted payment provider and store only provider references needed for reconciliation.
