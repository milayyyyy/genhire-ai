# Supabase Setup Guide for GenHire AI

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Select an organization and enter project name: `GenHire AI-ai`
4. Set a strong database password
5. Choose a region closest to your users
6. Click "Create new project"

## Step 2: Get API Keys

1. Go to Project Settings → API
2. Copy your `Project URL`
3. Copy your `anon` public key
4. Copy your `service_role` secret key (keep this safe, only for server-side!)

## Step 3: Configure Environment Variables

Create or update `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_for_auth_compatibility
```

## Step 4: Initialize Database

1. Run the initialization script to seed categories:
   ```bash
   npm run supabase:init
   ```
2. You should create the following tables in Supabase SQL Editor:
   - `users`: `id` (uuid), `email`, `first_name`, `last_name`, `user_type`, `is_active`, `is_email_verified`, `created_at`, `updated_at`, `last_login`
   - `question_categories`: `id` (uuid), `name`, `description`, `icon`, `color`, `sort_order`, `is_active`
   - `interviews`: `id` (uuid), `userId`, `overall_score`, `topic`, `interviewType`, `timestamp`, `analysis` (jsonb)
   - `subscriptions`: `userId`, `plan`, `status`, `updated_at`, `created_at`
   - `usage_tracking`: `id` (userId), `userId`, `lastReset`, and month keys as jsonb

## Step 5: Auth Settings

1. Go to Authentication → Providers
2. Enable Email provider
3. (Optional) Enable Google provider and enter your Client ID and Secret if you want to support Google Login.
