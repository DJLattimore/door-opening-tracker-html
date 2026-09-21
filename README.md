# ORD Door Operations Tracker

Static HTML/CSS/JavaScript application for GitHub Pages. No React, build command, backend, or database is required.

## Features

- Upload `.csv`, `.xlsx`, or `.xls` reports in the browser.
- Door-opening compliance: NB (`319`, `320`, `321`, `738`) at `02:30`; WB (`777` and the `787` family, including `789` equipment codes) at `03:30`.
- Flights over those limits automatically appear under the selected date's `Late Door Openings` tab.
- Edit every imported flight and document the agent, CSM, shift, reason, corrective action, follow-up, and pre-positioning notes.
- Add, edit, or delete employee profiles; assigning an agent fills the CSM automatically.
- Calendar groups each upload under its chosen date.
- Browser storage retains reports and notes for seven days, then removes them when the app next opens.
- JSON export for retained flights and follow-up records.

## GitHub Pages

1. Create or open the GitHub repository.
2. Upload **the contents of this folder** to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose `main`, `/ (root)`, then save.

The site will be available at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## Data and retention

All processing occurs in the browser. Saved reports are specific to that browser and computer; another PC will not see the same saved history. The seven-day cleanup runs when the page is opened or refreshed because this static site has no always-running server.
