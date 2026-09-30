# Cafe Management System Prototype Plan

## Activity Goal
Build and host the first frontend prototype for the Cafe Management System. The prototype will be static and client-side only; real authentication, authorization, payments, and persistence will be implemented in later iterations.

## Primary User
**Waiter**

The waiter needs to see table availability, browse the menu quickly, add items to a table order, and send the order to the kitchen without being exposed to administrative or financial controls.

## Connected Pages
1. **Home** (`frontend/index.html`) - CMS purpose, security-aware positioning, primary navigation, and entry points.
2. **Login** (`frontend/login.html`) - waiter sign-in form with password visibility, validation, and a demo sign-in flow.
3. **Order Workspace** (`frontend/dashboard.html`) - active table context, searchable/filterable menu, order basket, quantity controls, and send-to-kitchen confirmation.

## JavaScript Interactions
1. Client-side login validation and show/hide password.
2. Menu category filter and item search.
3. Add menu items to an order with quantity updates and remove controls.
4. Table selection updates the active order context.
5. Send-to-kitchen confirmation state and toast feedback.

## Security-Aware Design Decisions
- Password is rendered as a password input and is never displayed or stored by this prototype.
- The waiter workspace exposes only order-taking actions, not user management, reports, refunds, or price administration.
- UI copy makes clear that frontend hiding is not backend authorization; server-side RBAC will be required later.
- No payment card fields or unnecessary customer personal data are collected.

## Proposed Structure
- `frontend/index.html`: Home page
- `frontend/login.html`: Login page
- `frontend/dashboard.html`: Waiter order workspace
- `frontend/styles.css`: Shared responsive visual system
- `frontend/app.js`: Page-aware interactions and demo state

## Validation and Hosting
- Open every page locally and exercise navigation and interactions.
- Run an HTML/CSS/JS syntax check where available.
- Deploy the static files to GitHub Pages, Netlify, or Vercel and record the public URL in the submission form.
- Ask a group member to complete the waiter flow without instructions; record one usability issue and its fix.
