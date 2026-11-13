# Door Intelligence and employee miss tracking

## Arrival times

Flights display an Arrival time column in both All Flights and Late Door Openings. The importer tries common arrival headers, preferring actual, then ETA/Actual, generic arrival, estimated, and scheduled values. The source type appears beneath the time. Gate fields are never interpreted as times. The Edit flight form lets you enter or correct an arrival time.

No new sample flight report was supplied with this update. Reports using other arrival headers may need the header mapping extended. Missing times show a dash rather than an invented time. Previously imported records without a stored time need to be edited or re-imported from the source report.

## Gate Performance

In Door Intelligence, open Gate Performance. Gates are sorted by misses, with total misses, days with misses, total flights, measured flights, and miss rate. Unknown equipment/times are excluded from the measured denominator. Thresholds remain unchanged: longer than 02:30 for recognized narrow-body equipment and longer than 03:30 for 777/787 wide-body equipment.

Counts start with reports available when this update first opens, plus subsequent uploads. Previously deleted reports cannot be recovered. Daily aggregate snapshots are synchronized in the existing shared app_state data and exported with the JSON backup. They contain gate-level counts only. Automatic 14-day cleanup removes flights but keeps snapshots. Re-importing a report date replaces that date's aggregate counts, and edits to live flights recalculate them. Manually deleting a report removes both the report and its gate counts. Existing server cleanup preserves these aggregates because they are outside state.days. No new SQL is required.

## Employee Door Miss Tracker

Below Uniform Conversation Tracker in each employee profile, choose a manual count from 1 through 10. Blank means no count recorded, not a verified zero. This is independent of ECR # and independent of imported flight assignments. The profile count is saved and synchronized with all other employee fields; flight uploads and report expiration do not change it.

Employee Management Summary shows the number of employees with recorded counts and with 2+ misses. The Door Misses tab lists repeat issues by default and can show all recorded counts. Each row opens the editable profile. Counts are not automatically attributed to employees; managers update the counter like the ECR dropdown.

## Install

Export a backup before updating. Extract this ZIP and upload the contents of door-opening-tracker-html-main to the existing GitHub repository root. Preserve CNAME. Refresh all devices after deployment, sign in, and check that syncing says Saved. Welcome, new hires, password reset, report drag-and-drop, Keep, and existing employee/flight editing are retained.
