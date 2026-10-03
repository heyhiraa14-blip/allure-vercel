ALLURE SALON — VERCEL DEPLOYMENT

This project moves the frontend to Vercel while keeping Google Apps Script + Google Sheets as the backend.

FILES
- index.html       Vercel frontend
- api/backend.js   Vercel API bridge
- Code.gs          Updated Google Apps Script backend

STEP 1 — Update Google Apps Script
1. Open your Apps Script project.
2. Replace Code.gs with the Code.gs in this folder.
3. Save.
4. Deploy > Manage deployments.
5. Edit the existing Web app deployment (or create a new one).
6. Execute as: Me
7. Who has access: Anyone
8. Deploy.
9. Copy the /exec URL.

STEP 2 — Deploy the frontend to Vercel
1. Put index.html and the api folder in a project folder.
2. Import the project into Vercel, or run `vercel` from this folder.
3. In Vercel Project Settings > Environment Variables add:
   GOOGLE_SCRIPT_URL = your Apps Script /exec URL
4. Redeploy.

The browser will use:
POST /api/backend
and the Vercel function forwards the request to Google Apps Script.

STEP 3 — Test
Open the Vercel URL.
The site should load services/coupons from Google Sheets.
Test a coupon.
Submit the contact form and check the Contacts sheet.

IMPORTANT
Do not put Google service-account credentials or private API keys in index.html.
Your existing Google Apps Script remains responsible for SpreadsheetApp access.
