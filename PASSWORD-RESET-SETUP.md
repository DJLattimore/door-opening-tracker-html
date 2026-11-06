# Password reset setup

1. Deploy this update to GitHub Pages.
2. In Supabase Authentication → URL Configuration, set Site URL to the production site and add `https://aaordcsmnexgen.org/` to Redirect URLs. If using a different hostname or path, allow the exact URL where users open the tracker. Avoid broad wildcard entries.
3. Keep the Reset password email template's confirmation link intact. Configure custom SMTP for recipients outside the Supabase project team.
4. On the deployed site, select Forgot password, request a link for a test account, open it, set a new password, and sign in again. An expired link requires a new request.

This update does not change database tables, access policies, or the allowlist. Recovery tokens are not saved in local storage.
