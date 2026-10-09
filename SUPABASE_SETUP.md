# Supabase setup

The website is already configured with the project URL and publishable key. Complete these steps once before using it.

## 1. Create the protected table

1. Open the Supabase project.
2. Select **SQL Editor**.
3. Create a new query.
4. Copy all of `supabase-setup.sql` into the editor.
5. Select **Run**.

This creates the shared data table, an approved-email allowlist, access policies, and daily removal of flight days older than seven calendar days.

## 2. Configure account creation

1. Open **Authentication → URL Configuration**.
2. Set the Site URL to `https://djlattimore.github.io/door-opening-tracker-html/`.
3. Add the same address under Redirect URLs.
4. Open **Authentication → Providers → Email**.
5. Keep email registration enabled and keep email confirmation required.

Users can now select **Create account** and register with a verified `@aa.com` address. The database policy automatically grants confirmed `@aa.com` accounts access.

### Optional non-AA administrator or exception

Create the account under **Authentication → Users**, then add its lowercase email to the allowlist:

Then add those same lowercase email addresses to the allowlist. In **SQL Editor**, run:

```sql
insert into public.authorized_users (email)
values
  ('first.approved.user@example.com'),
  ('second.approved.user@example.com')
on conflict (email) do nothing;
```

Replace the example addresses with the actual approved exception emails. Accounts outside `@aa.com` cannot access tracker data unless listed here.

## 3. Deploy

Upload every file and folder in this project to the root of the GitHub repository. Keep `supabase-setup.sql` in the repository only if the repository is private or you are comfortable publishing the schema. The file contains no secret keys.

After GitHub Pages deploys, open the tracker and sign in. The first approved user to sign in seeds the shared database with the bundled employee roster. Later devices load the same flights, employee edits, calendar history, and notes.

## Synchronization behavior

- A save is uploaded automatically after a short delay.
- Other open devices check for changes every 30 seconds.
- **Refresh data** requests the newest saved version immediately.
- A local browser copy remains available as a temporary cache, but the authenticated Supabase record is authoritative.
- If two users edit at exactly the same time, the most recent complete save wins.

