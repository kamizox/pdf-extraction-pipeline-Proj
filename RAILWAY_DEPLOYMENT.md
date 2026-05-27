# Railway.app Deployment Guide - No Credit Card Required! 🚂

Deploy your Pakistan Flood ML Analytics Dashboard backend to Railway.app for **FREE** without a credit card.

---

## 🎯 Why Railway.app?

- ✅ **No credit card required** for free tier
- ✅ **$5 free credits per month** (enough for small projects)
- ✅ **500 hours of usage** per month on free tier
- ✅ **Automatic HTTPS**
- ✅ **Auto-deploy from GitHub**
- ✅ **Easy to use dashboard**
- ✅ **No cold starts** (unlike Render free tier)

---

## 📋 Part 1: Deploy Backend to Railway.app

### Step 1: Create Railway Account (1 minute)

1. Go to: **https://railway.app**
2. Click **"Login"** in the top right
3. Click **"Login with GitHub"**
4. Authorize Railway to access your GitHub account
5. **No credit card required!** ✅

### Step 2: Create New Project (30 seconds)

1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. If this is your first time:
   - Click **"Configure GitHub App"**
   - Select your repository: `pdf-extraction-pipeline-Proj`
   - Click **"Install & Authorize"**
4. Select your repository from the list

### Step 3: Configure Deployment (2 minutes)

Railway will automatically detect your project. Now configure it:

1. **Service Name:** Railway will auto-generate one (e.g., `pakistan-flood-ml-backend`)

2. **Root Directory:** 
   - Click on your service
   - Go to **"Settings"** tab
   - Scroll to **"Root Directory"**
   - Leave it **empty** (our config files handle the path)

3. **Build Configuration:**
   - Railway will use `nixpacks.toml` automatically
   - No manual configuration needed!

4. **Environment Variables:**
   - Click **"Variables"** tab
   - Add the following variables:

   ```
   PYTHON_VERSION = 3.11
   PORT = (Railway sets this automatically)
   ```

   - Don't add `FRONTEND_URL` yet (we'll add it after Vercel deployment)

### Step 4: Deploy! (5-10 minutes)

1. Railway will automatically start deploying
2. Watch the build logs in real-time
3. Wait for deployment to complete (5-10 minutes for first deploy)
4. Look for: **"Build successful"** and **"Deployment live"**

### Step 5: Get Your Backend URL (30 seconds)

1. Go to **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"**
4. Railway will create a URL like: `https://your-app.up.railway.app`
5. **Copy this URL** - you'll need it for Vercel!

### Step 6: Test Your Backend

Visit these URLs to verify deployment:

- **Main page:** `https://your-app.up.railway.app/`
- **API docs:** `https://your-app.up.railway.app/docs`
- **Health check:** `https://your-app.up.railway.app/health`
- **Dataset info:** `https://your-app.up.railway.app/api/dataset/info`

You should see JSON responses! ✅

---

## 🎨 Part 2: Deploy Frontend to Vercel (No Credit Card!)

### Step 1: Create Vercel Account (1 minute)

1. Go to: **https://vercel.com**
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your repositories
5. **No credit card required!** ✅

### Step 2: Import Project (30 seconds)

1. Click **"Add New..."** → **"Project"**
2. Find your repository: `pdf-extraction-pipeline-Proj`
3. Click **"Import"**

### Step 3: Configure Project (2 minutes)

**Framework Preset:** Vite (should auto-detect)

**Root Directory:** 
- Click **"Edit"** next to Root Directory
- Select **`frontend`** folder
- Click **"Continue"**

**Build Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `dist` (auto-filled)
- Install Command: `npm install` (auto-filled)

**Environment Variables:**
- Click **"Environment Variables"**
- Add variable:
  - **Name:** `VITE_API_URL`
  - **Value:** `https://your-app.up.railway.app` (your Railway URL from Part 1)
  - **Environments:** Select all (Production, Preview, Development)

### Step 4: Deploy! (2-3 minutes)

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Look for: **"Deployment Ready"**
4. You'll get a URL like: `https://your-project.vercel.app`

### Step 5: Test Your Frontend

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Dashboard should load
3. Click **"Run Analysis"**
4. Wait for results (may take a moment on first request)
5. Verify all charts display correctly

---

## 🔗 Part 3: Connect Frontend & Backend

### Update Railway Environment Variables

1. Go back to **Railway dashboard**
2. Click on your backend service
3. Go to **"Variables"** tab
4. Click **"New Variable"**
5. Add:
   - **Name:** `FRONTEND_URL`
   - **Value:** `https://your-project.vercel.app` (your Vercel URL)
6. Click **"Add"**
7. Service will automatically redeploy (30-60 seconds)

### Verify Connection

1. Visit your frontend: `https://your-project.vercel.app`
2. Open browser console (F12)
3. Click **"Run Analysis"**
4. Check for any CORS errors (there should be none!)
5. Verify results display correctly

---

## 🔄 Auto-Deployment Setup

### Railway Auto-Deploy (Already Configured!)

✅ Railway automatically deploys when you push to `main` branch
✅ Uses `nixpacks.toml` configuration
✅ No additional setup needed!

### Vercel Auto-Deploy (Already Configured!)

✅ Vercel automatically deploys when you push to `main` branch
✅ Creates preview deployments for pull requests
✅ No additional setup needed!

### GitHub Actions Integration

Your existing GitHub Actions workflow will:
1. Run tests on every push
2. Signal Railway and Vercel to deploy if tests pass
3. Both services deploy automatically

---

## 💰 Free Tier Limits

### Railway Free Tier

- ✅ **$5 free credits per month**
- ✅ **500 hours of usage** (enough for 1 service running 24/7)
- ✅ **No cold starts** (always on!)
- ✅ **1 GB RAM**
- ✅ **1 GB disk space**
- ✅ **Automatic HTTPS**
- ⚠️ After $5 credits used, service pauses until next month

**Estimated usage:** ~$3-4/month for this project (within free tier!)

### Vercel Free Tier

- ✅ **100 GB bandwidth/month**
- ✅ **Unlimited deployments**
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Preview deployments**

**Total Cost: $0/month** (within free limits) 🎉

---

## 🐛 Troubleshooting

### Issue: Railway deployment fails

**Problem:** Build fails with error

**Solution:**
1. Check build logs in Railway dashboard
2. Verify `requirements.txt` is correct
3. PyTorch installation may take time - be patient
4. Click **"Redeploy"** to try again
5. Check that `nixpacks.toml` is in root directory

### Issue: Frontend can't connect to backend

**Problem:** CORS errors in browser console

**Solution:**
1. Verify `VITE_API_URL` in Vercel environment variables
2. Verify `FRONTEND_URL` in Railway environment variables
3. Make sure URLs don't have trailing slashes
4. Redeploy both services
5. Clear browser cache and try again

### Issue: Backend returns 404 for API endpoints

**Problem:** `/api/dataset/info` returns "Not Found"

**Solution:**
1. Check Railway logs for errors
2. Verify datasets were generated during build
3. Check that start command is correct: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Redeploy with **"Clear build cache"**

### Issue: Railway service paused

**Problem:** "Service paused due to usage limits"

**Solution:**
- You've used your $5 free credits for the month
- Service will resume next month automatically
- Or upgrade to paid plan ($5/month minimum)
- Or optimize your app to use fewer resources

### Issue: ML operations are slow

**Problem:** Analysis takes a long time

**Solution:**
- Railway free tier has 1 GB RAM
- ML operations are resource-intensive
- This is normal for free tier
- Consider upgrading if you need better performance

---

## 📊 Monitoring Your Deployment

### Railway Dashboard

Access: https://railway.app/dashboard

**What to monitor:**
- **Deployments:** View deployment history and logs
- **Metrics:** CPU, memory, network usage
- **Logs:** Real-time application logs
- **Usage:** Track your $5 monthly credits

### Vercel Dashboard

Access: https://vercel.com/dashboard

**What to monitor:**
- **Deployments:** View deployment history
- **Analytics:** Page views, performance (if enabled)
- **Logs:** Function logs and errors
- **Bandwidth:** Track monthly usage

---

## 🚀 Deployment Workflow

After initial setup, your workflow is:

```
1. Make code changes locally
   ↓
2. git commit -m "your changes"
   ↓
3. git push origin main
   ↓
4. GitHub Actions runs tests
   ↓
5. If tests pass:
   ├─► Railway auto-deploys backend (2-3 min)
   └─► Vercel auto-deploys frontend (2-3 min)
   ↓
6. Changes are LIVE! 🎉
```

**Total time from push to live: 3-5 minutes**

---

## 🔐 Security Best Practices

1. ✅ **Environment variables** - Never commit `.env` files
2. ✅ **HTTPS** - Both platforms provide automatic HTTPS
3. ✅ **CORS** - Properly configured in `backend/main.py`
4. ✅ **Secrets** - Use Railway/Vercel environment variables
5. ✅ **Dependencies** - Keep updated with `pip list --outdated`

---

## 📝 Custom Domain (Optional)

### Add Custom Domain to Railway

1. Go to Railway service **Settings**
2. Scroll to **"Domains"**
3. Click **"Custom Domain"**
4. Enter your domain (e.g., `api.yourdomain.com`)
5. Update DNS records as instructed
6. Railway automatically provisions SSL

### Add Custom Domain to Vercel

1. Go to Project **Settings** → **Domains**
2. Add your domain (e.g., `floodml.yourdomain.com`)
3. Update DNS records as instructed
4. Vercel automatically provisions SSL
5. Update `VITE_API_URL` if backend domain changed

---

## ✅ Deployment Checklist

- [ ] Railway account created (no credit card!)
- [ ] Backend deployed to Railway
- [ ] Backend URL copied
- [ ] Backend `/docs` endpoint accessible
- [ ] Backend `/api/dataset/info` returns data
- [ ] Vercel account created (no credit card!)
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL copied
- [ ] `VITE_API_URL` set in Vercel
- [ ] `FRONTEND_URL` set in Railway
- [ ] Frontend loads without errors
- [ ] Frontend connects to backend
- [ ] All 5 ML algorithms work
- [ ] Auto-deployment tested
- [ ] Monitoring dashboards bookmarked

---

## 🆘 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Railway Discord:** https://discord.gg/railway
- **GitHub Issues:** Create an issue in your repository

---

## 🎉 Success!

Your Pakistan Flood ML Analytics Dashboard is now live!

**Frontend:** `https://your-project.vercel.app`  
**Backend:** `https://your-app.up.railway.app`

**Features:**
- ✅ No credit card required
- ✅ Free hosting (within limits)
- ✅ Auto-deployment on push
- ✅ HTTPS enabled
- ✅ No cold starts (Railway)
- ✅ Global CDN (Vercel)

**Share your live dashboard with the world! 🌍**

---

## 📈 Next Steps

1. ✅ Test all features thoroughly
2. ✅ Share your live URL
3. ✅ Monitor usage in dashboards
4. ✅ Gather user feedback
5. ✅ Iterate and improve
6. 💡 Consider custom domain
7. 💡 Set up error monitoring (Sentry)
8. 💡 Optimize for performance

**Congratulations on your deployment! 🎊**
