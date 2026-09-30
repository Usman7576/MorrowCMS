# Development Activity 1 Submission

## 1. Project Information

- **Project Name:** Cafe Management System (Morrow CMS)
- **Group Members:** M. Usman, 22L-7991, Team Lead; add remaining members and roles
- **Primary User Role:** Waiter

## 2. Live Website

- **Public URL:** Add the Vercel URL after deployment

## 3. Developed Pages

1. Home / Landing Page - `frontend/index.html`
2. Login / User Entry Page - `frontend/login.html`
3. Waiter Order Workspace - `frontend/dashboard.html`

## 4. JavaScript Interactions

1. Login validation and show/hide password
2. Menu search and category filtering
3. Add, increase, decrease, and remove order items with live totals
4. Table selection updates the active order
5. Send-to-kitchen confirmation and status update

## 5. Testing

- **Local browser test:** Passed Home -> Login -> Order Workspace navigation.
- **Interaction test:** Passed validation errors, password toggle, menu filtering/search, order totals, table switching, and kitchen handoff.
- **Diagnostics:** No errors reported in the HTML, CSS, or JavaScript files.
- **Problem discovered:** The selected project name was initially represented mainly by the product brand, so the assignment name was not immediately explicit.
- **Improvement made:** Added the exact label "Cafe Management System" to the landing page and footer.

## Vercel Deployment

1. Create a GitHub repository and upload the complete project, including `frontend/`, `backend/`, and `vercel.json`.
2. Open Vercel and choose **Add New Project**.
3. Import the GitHub repository.
4. Use the default project settings. No build command is required for this static prototype.
5. Deploy the project.
6. Open the generated URL and test all three pages and interactions.
7. Paste the working URL into the **Live Website** field above.

The included `vercel.json` routes the public root URL to `frontend/index.html`.
