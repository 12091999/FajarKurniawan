# Deployment setup

## Environment

Set these variables in the local `.env.local` file and in Vercel's
**Project Settings → Environment Variables**:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (never a secret/service-role key) |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | Optional public bucket name; defaults to `portfolio-media` |

`.env.local` is ignored by Git. Do not commit credentials or send keys in chat.

## Supabase

The application uses the existing `profiles`, `projects`, `skills`, `messages`,
and `admins` schema and policies. It does not modify table definitions or RLS.
Admin authorization calls `public.is_admin()`, which must continue to verify
`auth.uid()` against `public.admins.user_id`.

Create a **public** Storage bucket named `portfolio-media` (or set the bucket
environment variable to the name you choose). Restrict uploads to JPEG, PNG,
and WebP with a 5 MB maximum. Before adding write policies, inspect the existing
`storage.objects` policies. The application needs authenticated administrators
to insert and delete objects; it does not need update/upsert permissions. If
those policies are absent, review and apply equivalent policies in the Supabase
SQL Editor, changing the bucket name if needed:

```sql
create policy "Portfolio admins can upload portfolio media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-media'
  and public.is_admin()
);

create policy "Portfolio admins can delete portfolio media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-media'
  and public.is_admin()
);
```

These are proposed additions only; no Storage policies are changed by the app.
Public URLs are used for portfolio images, so the bucket must be public for
visitors to display them.

The existing schema has no project `status`/`category` fields or skill `icon`
field. The dashboard therefore manages the available `featured`, `sort_order`,
and `tech_stack` fields rather than inventing columns. Public message insertion
is controlled by the existing `Visitors can send messages` policy. Its
`WITH CHECK (true)` allows unauthenticated clients to submit other writable
message columns as well; the UI only sends name, email, subject, and message.
Review a narrower insert policy and abuse/rate-limiting controls before
production. No existing policy is changed here.

## GitHub and Vercel

The repository includes a GitHub Actions validation workflow for locked install,
TypeScript, tests, and production build. To enable automatic Vercel previews and
production builds, connect this GitHub repository to the Vercel project and set
the environment variables above in Vercel. Next.js is auto-detected; no custom
build command is required. Review Vercel's selected production branch and
environment scope before enabling deployments.

No push, GitHub connection, production setting, or deployment is performed by
this project change.
