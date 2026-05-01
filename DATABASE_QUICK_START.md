# ⚡ Database Quick Start - 5 Minute Setup

**For:** Bitcoin Sovereign Academy
**Time:** 5-15 minutes
**Follow:** DATABASE_SETUP_GUIDE.md for detailed instructions

---

## 📝 Quick Checklist

```
[ ] 1. Create Supabase account → https://supabase.com
[ ] 2. New Project → Name: bitcoin-sovereign-academy
[ ] 3. Copy database password (save it!)
[ ] 4. SQL Editor → New Query
[ ] 5. Paste entire /database/schema.sql file
[ ] 6. Run query (Cmd/Ctrl + Enter)
[ ] 7. Verify 7 tables in Table Editor
[ ] 8. Copy Project URL from Settings → API
[ ] 9. Copy anon key from Settings → API
[ ] 10. Copy service_role key from Settings → API
[ ] 11. Copy Database URI from Settings → Database
[ ] 12. Update .env file with all credentials
[ ] 13. Update Vercel environment variables
[ ] 14. Test with dummy user insert (optional)
[ ] 15. Deploy to Vercel (git push)
```

---

## 🎯 Critical Credentials Needed

After creating your Supabase project, you need these 4 values:

1. **SUPABASE_URL**
   - Location: Settings → API → Project URL
   - Format: `https://xxxxxxxxxxxxx.supabase.co`

2. **SUPABASE_ANON_KEY**
   - Location: Settings → API → Project API keys → anon public
   - Format: `<YOUR-SUPABASE-KEY>` (very long)

3. **SUPABASE_SERVICE_ROLE_KEY** ⚠️ SECRET!
   - Location: Settings → API → Project API keys → service_role
   - Format: `<YOUR-SUPABASE-KEY>` (very long, different from anon)

4. **DATABASE_URL**
   - Location: Settings → Database → Connection string → URI
   - Format: `postgresql://postgres.[ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`

---

## 🔐 Generate JWT_SECRET

You also need a random JWT secret (32+ characters):

**Option 1:** Use this command in terminal:
```bash
openssl rand -base64 32
```

**Option 2:** Go to: https://generate-secret.vercel.app/32

**Option 3:** Mash keyboard randomly for 32+ characters :)

---

## 📄 .env File Template

Create `/Users/dalia/projects/bitcoin-sovereign-academy/.env`:

```bash
# Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=<YOUR-SUPABASE-KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR-SUPABASE-KEY>
DATABASE_URL=postgresql://postgres.[ref]:[password]@...

# JWT
JWT_SECRET=your-random-32-plus-character-string-here

# Email (later)
EMAIL_FROM=noreply@bitcoinsovereign.academy
RESEND_API_KEY=

# Stripe (later)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

⚠️ **IMPORTANT:** Never commit this file to GitHub! It should be in `.gitignore`.

---

## ☁️ Vercel Environment Variables

Go to: **https://vercel.com/dashboard** → Your Project → Settings → Environment Variables

Add the same 5 variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `JWT_SECRET`

For each, check **all 3 environments**: Production, Preview, Development

---

## ✅ How to Verify Success

1. **Tables exist:**
   - Supabase → Table Editor → See 7 tables (users, entitlements, payments, etc.)

2. **Connection works:**
   - SQL Editor → Run: `SELECT NOW();`
   - Should return current timestamp

3. **Can insert data:**
   - SQL Editor → Run:
     ```sql
     INSERT INTO users (email, password_hash, password_salt)
     VALUES ('test@example.com', 'hash', 'salt')
     RETURNING id;

     DELETE FROM users WHERE email = 'test@example.com';
     ```
   - Should show inserted ID, then delete successfully

---

## 🚀 What Happens Next?

Once database is deployed, I will:

1. **Create `/api/verify-access` endpoint**
   - Server-side token verification
   - Checks database for valid entitlements

2. **Update module pages**
   - Replace client-side checks with server calls
   - Prevents forged JWT tokens

3. **Replace in-memory storage**
   - Move from `Map()` to database queries
   - Data persists across server restarts

4. **Test end-to-end**
   - Create user → Make payment → Access content
   - Verify tokens work correctly

---

## 📞 Need Help?

**Stuck?** Tell me:
1. Which step are you on?
2. What error message do you see (if any)?
3. Screenshot if helpful

**Common Issues:**

- **"Can't find API keys"** → Settings → API tab → Scroll to "Project API keys"
- **"Schema failed to run"** → Copy the ENTIRE schema.sql file, not just part
- **"Vercel variables not working"** → Make sure you selected all 3 environments (Production, Preview, Development)
- **"Database password wrong"** → Settings → Database → Reset database password

---

**Ready to start?** Follow DATABASE_SETUP_GUIDE.md step-by-step!

🤖 Generated with Claude Code
