# Cafe Management System

Morrow CMS is the frontend prototype for the Secure Software Development semester project. It currently demonstrates a waiter-focused order workflow and is intentionally static for Development Activity 1.

## Current Prototype

- `frontend/index.html` - landing page
- `frontend/login.html` - demo staff login
- `frontend/dashboard.html` - waiter order workspace
- `frontend/styles.css` - shared presentation styles
- `frontend/app.js` - page interactions and demo session guard
- `PLAN.md` - activity implementation plan
- `SUBMISSION.md` - activity submission checklist
- `docs/ARCHITECTURE.md` - path from prototype to full-stack system
- `backend/README.md` - future API structure

`vercel.json` routes the public Vercel URL to `frontend/`. The future API can be added under `backend/` without mixing server code into the browser bundle.

## Run Locally

Open `frontend/index.html` in a browser. For a local HTTP server, run `python -m http.server 8000` from this folder and open `http://localhost:8000/frontend/`.

## Future Full-Stack Direction

The frontend will later consume a REST API from a separate backend. MongoDB should be introduced when persistent users, menu items, orders, inventory, audit events, and reports are needed. The current prototype uses only in-browser demo state and stores no real data.
