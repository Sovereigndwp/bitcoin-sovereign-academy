# 🗄️ Database Setup Guide - Bitcoin Sovereign Academy

**Estimated Time:** 15-20 minutes
**Difficulty:** Easy (copy/paste)
**Required:** Supabase account (free)

---

## 📋 Quick Overview

You'll be setting up a PostgreSQL database on Supabase to store:
- User accounts
- Payment records
- Content access permissions (entitlements)
- Session tokens
- Webhook events

---

## ✅ Step 1: Create Supabase Project (3 minutes)

### 1.1 Sign Up / Log In

1. Go to: **https://supabase.com**
2. Click **"Start your project"** or **"Sign In"**
3. Sign in with GitHub (recommended) or email

### 1.2 Create New Project

1. Click **"New Project"** (green button)
2. Fill in project details:
   ```
   Name: bitcoin-sovereign-academy
   Database Password: [Click "Generate a password"]
   Region: [Choose closest to your users, e.g., US West]
   Pricing Plan: Free
   ```
3. **IMPORTANT:** Copy the generated password and save it somewhere safe!
4. Click **"Create new project"**
5. Wait 2-3 minutes while Supabase sets up your database

---

## ✅ Step 2: Deploy Database Schema (5 minutes)

### 2.1 Open SQL Editor

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

### 2.2 Copy Schema

1. On your local machine, open the file:
   ```
   /Users/dalia/projects/bitcoin-sovereign-academy/database/schema.sql
   ```
2. Copy **ALL** the contents (318 lines)

### 2.3 Run Schema

1. Paste the entire schema into the Supabase SQL Editor
2. Click **"Run"** button (or press `Cmd + Enter` on Mac / `Ctrl + Enter` on Windows)
3. Wait 5-10 seconds
4. You should see: ✅ **"Success. No rows returned"** (this is correct!)

---

## ✅ Step 3: Verify Tables Created (2 minutes)

### 3.1 Check Table Editor

1. In left sidebar, click **"Table Editor"**
2. Verify you see these 7 tables:
   - ✅ `entitlements`
   - ✅ `payments`
   - ✅ `promo_code_usage`
   - ✅ `promo_codes`
   - ✅ `sessions`
   - ✅ `users`
   - ✅ `webhook_events`

### 3.2 Verify Columns

1. Click on **"users"** table
2. You should see columns: `id`, `email`, `password_hash`, `created_at`, etc.
3. Click on **"entitlements"** table
4. You should see columns: `id`, `user_id`, `modules`, `paths`, `access_token`, etc.

✅ If you see all tables and columns, the schema deployed successfully!

---

## ✅ Step 4: Copy Database Credentials (3 minutes)

### 4.1 Get API Keys

1. In left sidebar, click **"Project Settings"** (gear icon at bottom)
2. Click **"API"** tab
3. Copy these values (you'll need them next):

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co

   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   (starts with "eyJ" - very long string)

   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   (also starts with "eyJ" - different from anon key)
   ```

   **IMPORTANT:** Keep the `service_role` key secret! Never commit it to GitHub.

### 4.2 Get Database Connection String

1. Still in **Project Settings**, click **"Database"** tab
2. Scroll down to **"Connection string"**
3. Select **"URI"** (not Nodejs or other)
4. You'll see something like:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
5. Copy this entire string

---

## ✅ Step 5: Update Environment Variables (5 minutes)

### 5.1 Create .env File Locally

1. In your project directory: `/Users/dalia/projects/bitcoin-sovereign-academy/`
2. Create a file named `.env` (if it doesn't exist)
3. Add these lines (replace with YOUR values from Step 4):

```bash
# Supabase Database
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Email (leave blank for now - we'll set this up later)
EMAIL_FROM=noreply@bitcoinsovereign.academy
RESEND_API_KEY=

# Stripe (leave blank for now)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

4. Save the file
5. **VERIFY:** Make sure `.env` is listed in your `.gitignore` file so it's NOT committed to GitHub!

### 5.2 Update Vercel Environment Variables

1. Go to: **https://vercel.com/dashboard**
2. Click on your **bitcoin-sovereign-academy** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left sidebar
5. Add each variable one by one:

   **Variable Name:** `SUPABASE_URL`
   **Value:** `https://xxxxxxxxxxxxx.supabase.co`
   **Environment:** Production, Preview, Development (check all 3)

   **Variable Name:** `SUPABASE_ANON_KEY`
   **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   **Environment:** Production, Preview, Development

   **Variable Name:** `SUPABASE_SERVICE_ROLE_KEY`
   **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   **Environment:** Production, Preview, Development

   **Variable Name:** `DATABASE_URL`
   **Value:** `postgresql://postgres.[ref]:[password]@...`
   **Environment:** Production, Preview, Development

   **Variable Name:** `JWT_SECRET`
   **Value:** (generate a random 32+ character string)
   **Environment:** Production, Preview, Development

6. Click **"Save"** for each variable

---

## ✅ Step 6: Test Connection (2 minutes)

### Option A: Quick Test via Supabase Dashboard

1. Go back to **SQL Editor** in Supabase
2. Create a new query
3. Paste this test query:
   ```sql
   -- Test: Insert a dummy user (we'll delete it right after)
   INSERT INTO users (email, password_hash, password_salt)
   VALUES ('test@example.com', 'dummy_hash', 'dummy_salt')
   RETURNING id, email, created_at;

   -- Clean up: Delete the test user
   DELETE FROM users WHERE email = 'test@example.com';
   ```
4. Click **"Run"**
5. You should see the inserted user details, then it gets deleted
6. ✅ If successful, your database is working!

### Option B: Test via API (After Deployment)

After you deploy your code to Vercel:
1. Try creating an account on your site
2. Check Supabase **Table Editor** → **users** table
3. You should see the new user appear

---

## ✅ Step 7: Deploy Updated Code (Optional - I can do this)

Once you confirm the environment variables are set:

```bash
# Add .env to .gitignore (if not already there)
echo ".env" >> .gitignore

# Commit any changes
git add .
git commit -m "Configure database environment variables"
git push origin main
```

This will trigger a Vercel deployment with your new database credentials.

---

## 🎉 You're Done!

Your database is now:
- ✅ Deployed to Supabase
- ✅ Schema created (7 tables)
- ✅ Credentials configured locally
- ✅ Credentials configured on Vercel
- ✅ Ready to store user data

---

## 🔍 What's Next?

Now that the database is set up, I can:
1. **Implement JWT verification endpoint** (`/api/verify-access`)
2. **Update module pages** to verify tokens server-side
3. **Replace in-memory storage** with real database queries
4. **Test the full authentication flow**

This will fix the last critical Week 1 security issue: **Client-Side JWT Bypass**.

---

## 🆘 Troubleshooting

### "Success. No rows returned" - Is this an error?
**No!** This is correct. The schema creates tables but doesn't insert data yet.

### I see "schema already exists" errors
Your schema was already deployed. Skip to Step 3 to verify tables exist.

### Can't find Project URL / API keys
1. Go to Supabase Dashboard
2. Click **Project Settings** (gear icon)
3. Click **API** tab
4. Scroll to **Project API keys**

### Forgot database password
1. Go to **Project Settings** → **Database**
2. Click **"Reset database password"**
3. Copy the new password
4. Update your `DATABASE_URL` in both `.env` and Vercel

---

**Need help?** Let me know which step you're on and I'll guide you through it!

🤖 Generated with Claude Code
