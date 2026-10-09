# ORD Door Operations Tracker

Static HTML/CSS/JavaScript application for GitHub Pages with Supabase authentication and shared cross-device storage. No React or build command is required.

## Features

- Upload `.csv`, `.xlsx`, or `.xls` reports in the browser.
- Door-opening compliance: NB (`319`, `320`, `321`, `738`) at `02:30`; WB (`777` and the `787` family, including `789` equipment codes) at `03:30`.
- Flights over those limits automatically appear under the selected date's `Late Door Openings` tab.
- Edit every imported flight and document the agent, CSM, shift, reason, corrective action, follow-up, and pre-positioning notes.
- Add, edit, or delete employee profiles; assigning an agent fills the CSM automatically.
- Calendar groups each upload under its chosen date.
- Supabase synchronizes reports, employee edits, assignments, and notes across authenticated devices.
- Verified `@aa.com` users can create their own accounts; other domains require manual allowlist approval.
- A scheduled database cleanup keeps the most recent seven calendar days.
- JSON export for retained flights and follow-up records.

## GitHub Pages

1. Create or open the GitHub repository.
2. Upload **the contents of this folder** to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose `main`, `/ (root)`, then save.

The site will be available at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

Before using the deployed site, follow `SUPABASE_SETUP.md` and run `supabase-setup.sql` once in the Supabase SQL Editor.

## Data and retention

Spreadsheet parsing occurs in the browser. Authenticated application data is stored in Supabase and shared across devices. The browser retains a local cache for resilience, while the database remains authoritative after sign-in.
