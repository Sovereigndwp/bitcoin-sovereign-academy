# ⚡ 10-Minute Database Setup - No Technical Skills Needed

**I'll walk you through this step-by-step. Just follow along!**

---

## 🎯 Part 1: Create Supabase Account (2 minutes)

### Step 1: Open Supabase
1. Click this link: **https://supabase.com**
2. Click **"Start your project"** (green button)
3. Click **"Sign in with GitHub"** (easiest option)
4. ✅ You're logged in!

### Step 2: Create Project
1. Click **"New Project"** (big green button)
2. Fill in:
   - **Name:** `bitcoin-sovereign-academy`
   - **Database Password:** Click "Generate a password" button
   - **Region:** Select "US West" (or closest to you)
   - **Pricing Plan:** Free (already selected)
3. **IMPORTANT:** Click the 👁️ eye icon next to password to reveal it
4. Copy the password and paste it into a note somewhere (you'll need it in 5 min)
5. Click **"Create new project"**
6. Wait 2 minutes while it creates (you'll see a loading spinner)

✅ **Part 1 Done!** Project created.

---

## 🎯 Part 2: Copy Database Schema (3 minutes)

### Step 3: Open SQL Editor
1. On the left sidebar, click **"SQL Editor"** (looks like a database icon)
2. Click **"New Query"** button (top right)
3. You now have a blank text editor

### Step 4: Copy Schema File
1. On your computer, open this file:
   ```
   /Users/dalia/projects/bitcoin-sovereign-academy/database/schema.sql
   ```
2. Press `Cmd + A` (Mac) or `Ctrl + A` (Windows) to select all
3. Press `Cmd + C` (Mac) or `Ctrl + C` (Windows) to copy

### Step 5: Run Schema
1. Go back to Supabase SQL Editor tab
2. Click inside the text editor
3. Press `Cmd + V` (Mac) or `Ctrl + V` (Windows) to paste
4. You should see 318 lines of SQL code
5. Click **"Run"** button (bottom right corner)
6. Wait 10 seconds
7. You should see: ✅ **"Success. No rows returned"**

✅ **Part 2 Done!** Database created.

---

## 🎯 Part 3: Copy Your Credentials (2 minutes)

### Step 6: Get API Keys
1. Click **"Project Settings"** at the bottom of left sidebar (gear icon ⚙️)
2. Click **"API"** tab at the top
3. Scroll down to **"Project API keys"** section
4. You'll see 3 values - copy each one:

**Value 1: Project URL**
- Copy the URL (looks like `https://abcdefgh.supabase.co`)
- Paste it into a note, label it: `SUPABASE_URL`

**Value 2: anon public key**
- Click the 👁️ eye icon to reveal it
- Click the copy button (looks like two squares)
- Paste it into your note, label it: `SUPABASE_ANON_KEY`

**Value 3: service_role key**
- Scroll down a bit
- Click the 👁️ eye icon to reveal it
- Click the copy button
- Paste it into your note, label it: `SUPABASE_SERVICE_ROLE_KEY`

### Step 7: Get Database URL
1. Still in Project Settings, click **"Database"** tab
2. Scroll to **"Connection string"** section
3. Click **"URI"** tab (not Nodejs)
4. You'll see a long string starting with `postgresql://`
5. Replace `[YOUR-PASSWORD]` with the password you saved in Step 2
   - Find the part that says `:[YOUR-PASSWORD]@`
   - Delete `[YOUR-PASSWORD]`
   - Type your actual password there
6. Copy the entire string
7. Paste it into your note, label it: `DATABASE_URL`

✅ **Part 3 Done!** You now have all 4 credentials.

---

## 🎯 Part 4: Give Me Your Credentials (1 minute)

**Paste your 4 values here in the chat like this:**

```
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
DATABASE_URL=postgresql://postgres...
```

**I will:**
1. Create your `.env` file
2. Generate a secure JWT_SECRET for you
3. Show you exactly how to update Vercel
4. Then implement the JWT verification endpoint
5. Complete the final Week 1 security fix!

---

## ❓ Stuck? Here's Help

### "I don't see the SQL Editor"
- Look on the LEFT sidebar
- It's the icon that looks like `</>`
- It might say "SQL Editor" next to it

### "I don't see Project Settings"
- Scroll to the BOTTOM of the left sidebar
- Look for a gear icon ⚙️
- Click it

### "The Run button is grayed out"
- Make sure you pasted the schema into the text editor
- Click inside the editor first
- Then click Run

### "I see errors after clicking Run"
- Take a screenshot
- Send it to me
- I'll tell you exactly what to do

### "I can't find my password from Step 2"
- Go to Project Settings → Database
- Click "Reset database password"
- Generate a new one and save it this time!

---

## 🎉 That's It!

Once you paste those 4 credentials, I'll handle the rest:
- ✅ Configure your local environment
- ✅ Set up Vercel variables
- ✅ Implement JWT verification
- ✅ Complete Week 1 fixes (8/8) 🎉

**Ready? Start with Part 1!** 🚀

---

**Expected time:**
- Part 1: 2 minutes
- Part 2: 3 minutes
- Part 3: 2 minutes
- Part 4: 1 minute
- **Total: 8 minutes** (we'll call it 10 to be safe)

🤖 Generated with Claude Code
