# Surprise & Delight integration

Choose Surprise & Delight in the Workspace dropdown. Its tabs are Overview, Travelers, Missed Connections, and Upload List. The Combined Summary also includes a shortcut and counts.

CSV and Excel traveler lists support drag-and-drop and file browsing. Columns map to Date, First/Last Name, PNR, Flight Number, Destination, and Company. Imports add new travelers and skip exact traveler/date/reservation/flight/destination duplicates, including duplicates in the same upload. Travelers sharing a PNR are not collapsed into one person. Traveler CSV exports preserve distribution status when re-imported.

Use Mark distributed or Undo to update card status. Search or filter the list. Missed Connections saves the date, reason a card was not distributed, and optional details. Clearing the traveler list requires confirmation and leaves missed connection notes intact; deleting a note also requires confirmation.

Records are stored in state.surpriseDelight inside the existing shared Supabase app_state row, cached locally, and included in the main JSON export. The same signed-in access rules apply: anyone authorized to read the shared tracker can see traveler names, PNRs, companies, and notes. Do not import passenger data unless this use and audience are approved by your organization. No access policies or authentication configuration are changed by this update.

Flight report cleanup does not delete Surprise & Delight records. Traveler records remain until manually cleared. Existing records in the standalone app are not silently copied: Upload List → Import previous browser tracker can copy records from the standalone app's old storage key, only if they are present on the same website/browser. Otherwise export the traveler CSV from the old app and import it here. Old missed connection notes on a different origin/device are not transferred by traveler CSV.

To deploy, export a current backup, extract the ZIP, and upload the contents of door-opening-tracker-html-main to your existing GitHub repository root. Keep CNAME. Refresh all devices to the new version. No SQL update is needed. Wait for Saved after making changes; a local cache alone does not confirm cross-device sync.
