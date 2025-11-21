# 🚀 Quick Deploy Guide - Dream Avenue

## ⚡ 3-Minute Netlify Deployment

### Step 1: Connect Git Repository (1 min)
```
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub/GitLab/Bitbucket
4. Select "dream-avenue" repository
```

### Step 2: Add Environment Variables (1 min)
```
Click "Site settings" → "Environment variables" → "Add"

VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Get these from: Supabase Dashboard → Settings → API
```

### Step 3: Deploy (1 min)
```
Click "Deploy site"
Wait for build to complete (~2 min)
Site goes live automatically!
```

---

## ✅ Pre-Deploy Verification

Run this command to verify structure:
```bash
chmod +x verify-structure.sh
./verify-structure.sh
```

Expected output: `✓ ALL CHECKS PASSED!`

---

## 📋 Build Settings (Auto-Configured)

These are automatically detected from `netlify.toml`:

| Setting           | Value           |
|-------------------|-----------------|
| Build command     | `npm run build` |
| Publish directory | `dist`          |
| Node version      | `18`            |

✅ **No manual configuration needed!**

---

## 🔑 Get Supabase Credentials

```
1. Go to https://app.supabase.com/
2. Select your project
3. Click Settings (⚙️) → API
4. Copy:
   - Project URL → VITE_SUPABASE_URL
   - anon public key → VITE_SUPABASE_ANON_KEY
```

⚠️ **Use "anon public" key, NOT "service_role"**

---

## 🎯 Deployment Checklist

Before deploying:
- [ ] Supabase project is set up
- [ ] Database tables exist
- [ ] RLS policies configured
- [ ] Environment variables ready
- [ ] Git repository pushed to remote

After deploying:
- [ ] Site loads at Netlify URL
- [ ] Homepage displays correctly
- [ ] Booking form works
- [ ] Admin login works
- [ ] No console errors

---

## 🐛 Common Issues & Fixes

### Build Fails with "Module not found"
```bash
# Run locally first
npm install
npm run build

# If it works locally, clear Netlify cache:
# Settings → Build & deploy → Clear cache and retry
```

### Site Loads but Shows Blank Page
```bash
# Check browser console for errors
# Common cause: Missing environment variables

# Fix: Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

### 404 on Routes
```bash
# Verify /public/_redirects contains:
/* /index.html 200

# Or check netlify.toml has redirects configured
```

### Supabase Connection Fails
```bash
# Check environment variables:
# 1. No trailing slash in URL
# 2. Using anon key (not service_role)
# 3. Variables start with VITE_ prefix
```

---

## 📊 Expected Build Output

```
npm run build
✓ vite v6.3.5 building for production...
✓ 124 modules transformed.
dist/index.html                   1.2 kB
dist/assets/index-xxx.css        45.3 kB
dist/assets/index-xxx.js        234.5 kB
✓ built in 45s
```

---

## 🎉 Success!

When deployed successfully:
- ✅ Build completes in ~2-3 minutes
- ✅ Deploy log shows "Site is live"
- ✅ URL opens the homepage
- ✅ Booking form is interactive
- ✅ Admin panel accessible

---

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com/
- **Vite Docs**: https://vitejs.dev/
- **Supabase Docs**: https://supabase.com/docs

---

## 🔄 Automatic Deployments

Once connected:
- ✅ Every push to `main` triggers deploy
- ✅ Preview deploys for pull requests
- ✅ Instant rollbacks available

Configure in: **Settings → Build & deploy → Build settings**

---

**Ready to deploy?** Follow the 3 steps at the top! 🚀
