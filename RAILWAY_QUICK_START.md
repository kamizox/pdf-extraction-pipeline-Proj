# Railway.app Quick Start - 5 Minutes ⚡

Deploy your backend to Railway.app **FREE** - No credit card required!

**✅ FIXED:** Now uses Dockerfile for reliable deployment!

---

## 🚂 Step 1: Deploy Backend to Railway (3 minutes)

### 1.1 Commit and Push Changes (if you just created Dockerfile)
```bash
git add Dockerfile .dockerignore railway.toml Procfile
git commit -m "Add Dockerfile for Railway deployment"
git push origin main
```

### 1.2 Create Account
1. Go to: **https://railway.app**
2. Click **"Login with GitHub"**
3. Authorize Railway
4. ✅ **No credit card needed!**

### 1.2 Create Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `pdf-extraction-pipeline-Proj`
4. Railway starts deploying automatically!

### 1.3 Generate Domain
1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. **Copy your URL:** `https://your-app.up.railway.app`

### 1.4 Wait for Deployment
- Watch build logs (8-12 minutes first time)
- Railway uses Dockerfile to build
- Look for: **"Deployment live"** ✅

**Note:** First build takes longer due to PyTorch installation. Subsequent builds are 2-3 minutes.

### 1.5 Test Backend
Visit: `https://your-app.up.railway.app/docs`

Should see FastAPI documentation! ✅

---

## 🎨 Step 2: Deploy Frontend to Vercel (2 minutes)

### 2.1 Create Account
1. Go to: **https://vercel.com**
2. Click **"Continue with GitHub"**
3. Authorize Vercel
4. ✅ **No credit card needed!**

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import: `pdf-extraction-pipeline-Proj`
3. Click **"Import"**

### 2.3 Configure
1. **Framework:** Vite (auto-detected)
2. **Root Directory:** Click "Edit" → Select `frontend`
3. **Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: `https://your-app.up.railway.app` (your Railway URL)
   - Select: All environments

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. **Copy your URL:** `https://your-project.vercel.app`

---

## 🔗 Step 3: Connect Services (1 minute)

### 3.1 Update Railway
1. Go to Railway dashboard
2. Click your service → **"Variables"** tab
3. Add variable:
   - Name: `FRONTEND_URL`
   - Value: `https://your-project.vercel.app` (your Vercel URL)
4. Service auto-redeploys (30 seconds)

---

## ✅ Step 4: Test Everything

1. Visit: `https://your-project.vercel.app`
2. Click **"Run Analysis"**
3. Wait for results
4. **It works!** 🎉

---

## 💰 Cost: $0/month

- **Railway:** $5 free credits/month (enough for this project)
- **Vercel:** 100 GB bandwidth/month free

---

## 🐛 Troubleshooting

### Build failed with "railpack error"?
**Solution:** We fixed this! Make sure you have:
- `Dockerfile` in project root
- `.dockerignore` in project root
- Committed and pushed these files

See **`RAILWAY_FIX.md`** for detailed troubleshooting.

### Frontend can't connect to backend?
1. Check `VITE_API_URL` in Vercel (no trailing slash)
2. Check `FRONTEND_URL` in Railway (no trailing slash)
3. Redeploy both services

### Railway deployment failed?
1. Check build logs in Railway dashboard
2. Click **"Redeploy"** to try again
3. Verify `nixpacks.toml` exists in root

### Backend returns 404?
1. Visit: `https://your-app.up.railway.app/docs`
2. Check Railway logs for errors
3. Verify datasets generated during build

---

## 📚 Full Documentation

For detailed instructions, see: **`RAILWAY_DEPLOYMENT.md`**

---

## 🎉 Done!

Your app is live at:
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-app.up.railway.app`

**Auto-deployment enabled:**
- Push to `main` → Both services auto-deploy
- Changes live in 3-5 minutes!

**Total time:** ~5 minutes + 10 minutes waiting for builds

**Total cost:** $0/month 💰

---

## 🚀 What's Next?

- [ ] Test all 5 ML algorithms
- [ ] Share your live URL
- [ ] Monitor usage in dashboards
- [ ] Add custom domain (optional)

**Congratulations! Your dashboard is LIVE! 🎊**
