# Caption Admin

Admin area for the Caption Rating App.

## Setup

1. Install dependencies:
```
npm install
```

2. The `.env.local` file is already configured with the Supabase credentials.

3. Run locally:
```
npm run dev
```

## Deploying to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` = https://qihsgnfjqmkjmoowyfbn.supabase.co
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (the anon key)
4. Turn off Deployment Protection in Vercel settings

## Making yourself superadmin

Run this in the Supabase SQL editor (use the teacher's project):
```sql
UPDATE profiles SET is_superadmin = true WHERE email = 'your@email.com';
```
