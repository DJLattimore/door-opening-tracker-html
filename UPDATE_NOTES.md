# Employee profile update

- Adds OPEN to the CSM group lineup and removes Alyse Clayton from selectable active groups.
- Applies team transfers once to existing employee profiles: Alyse to Andres, original Andres to Josh, and original Josh to Prince. Existing Prince employees stay with Prince. Employee records receive a migration marker, preserved in shared storage, to prevent repeated transfers on refresh.
- Existing flight records retain their historical CSM values. Future agent assignments use the updated employee CSM.
- Adds New Hire (Yes/No), with Probation Expiry visible when Yes is selected. Switching to No hides the date without erasing an existing date.
- Adds the Uniform Conversation Tracker fields and dropdown options from the supplied workbook. ECR # offers blank or 1 through 9. Uniform Notes are separate from general employee Notes.
- New fields are stored inside employee profiles and synchronized by the existing Supabase connection. No new database tables or SQL changes are needed for these employee features.
- The supplied bid workbook still contains original CSM assignments. The requested team transfers take precedence; this update does not replace existing roster information with workbook rows or infer New Hire from Unassigned.

## Publish

Back up/export existing app data before publishing. Upload the contents of this folder to the existing GitHub repository root, preserving CNAME. After deployment, refresh the site and sign in to apply the one-time profile migration. Other open tabs/devices should also refresh to the updated app before making edits.

The existing 14-day report retention and Keep option are unchanged. If not already done, run supabase-retention-update.sql once as described in SUPABASE_SETUP.md.
