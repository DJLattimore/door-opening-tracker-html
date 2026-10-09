# Supabase setup

The website is already configured with the project URL and publishable key. Complete these steps once before using it.

## 1. Create the protected table

1. Open the Supabase project.
2. Select **SQL Editor**.
3. Create a new query.
4. Copy all of `supabase-setup.sql` into the editor.
5. Select **Run**.

This creates the shared data table, an approved-email allowlist, access policies, and daily removal of flight days older than seven calendar days.

## 2. Create approved users

1. Open **Authentication → Users**.
2. Select **Add user → Create new user**.
3. Enter the user's email and a temporary password.
4. Repeat for each approved tracker user.

Then add those same lowercase email addresses to the allowlist. In **SQL Editor**, run:

```sql
insert into public.authorized_users (email)
values
  ('first.approved.user@example.com'),
  ('second.approved.user@example.com')
on conflict (email) do nothing;
```

Replace the example addresses with the actual approved login emails.

Finally, open the email provider settings under **Authentication → Providers → Email** and turn off public user registration. The tracker contains no public sign-up form, and the database allowlist provides an additional access check.

## 3. Deploy

Upload every file and folder in this project to the root of the GitHub repository. Keep `supabase-setup.sql` in the repository only if the repository is private or you are comfortable publishing the schema. The file contains no secret keys.

After GitHub Pages deploys, open the tracker and sign in. The first approved user to sign in seeds the shared database with the bundled employee roster. Later devices load the same flights, employee edits, calendar history, and notes.

## Synchronization behavior

- A save is uploaded automatically after a short delay.
- Other open devices check for changes every 30 seconds.
- **Refresh data** requests the newest saved version immediately.
- A local browser copy remains available as a temporary cache, but the authenticated Supabase record is authoritative.
- If two users edit at exactly the same time, the most recent complete save wins.

