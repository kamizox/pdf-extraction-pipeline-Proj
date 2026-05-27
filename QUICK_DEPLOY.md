# Quick Deployment Guide - 5 Minutes ⚡

## 🎯 Goal
Deploy your Pakistan Flood ML Dashboard to production in 5 minutes.

---

## 📦 Step 1: Deploy Backend to Render (2 minutes)

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. Click **"New +"** → **"Web Service"**
4. **Connect repository:** `pdf-extraction-pipeline-Proj`
5. **Configure:**
   - Name: `pakistan-flood-ml-backend`
   - Branch: `main`
   - Build Command: `cd backend && pip install -r requirements.txt && pip install torch --index-url https://download.pytorch.org/whl/cpu && python generate_datasets.py`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Plan: **Free**
6. Click **"Create Web Service"**
7. **Wait 5-10 minutes** for first deployment
8. **Copy your URL:** `https://your-app.onrender.com` ← You'll need this!

---

## 🎨 Step 2: Deploy Frontend to Vercel (2 minutes)

1. **Go to:** https://vercel.com
2. **Sign up** with GitHub
3. Click **"Add New..."** → **"Project"**
4. **Import:** `pdf-extraction-pipeline-Proj`
5. **Configure:**
   - Framework: **Vite**
   - Root Directory: **`frontend`** (click Edit to select)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-app.onrender.com` (paste your Render URL from Step 1)
   - Select: Production, Preview, Development
7. Click **"Deploy"**
8. **Wait 2-3 minutes**
9. **Copy your URL:** `https://your-project.vercel.app`

---

## 🔗 Step 3: Connect Frontend & Backend (1 minute)

1. **Go back to Render dashboard**
2. **Open your backend service**
3. **Go to "Environment" tab**
4. **Add variable:**
   - Key: `FRONTEND_URL`
   - Value: `https://your-project.vercel.app` (your Vercel URL from Step 2)
5. Click **"Save Changes"**
6. Service will auto-redeploy (30 seconds)

---

## ✅ Step 4: Test Your Deployment

1. **Visit:** `https://your-project.vercel.app`
2. **Click "Run Analysis"**
3. **Should work!** 🎉

If not working:
- Check browser console (F12) for errors
- Verify URLs don't have trailing slashes
- Wait for Render backend to wake up (first request takes 30-60 seconds)

---

## 🚀 Done!

Your app is now live at:
- **Frontend:** `https://your-project.vercel.app`
- **Backend API:** `https://your-app.onrender.com/docs`

**Auto-deployment is enabled:**
- Push to `main` branch → Both services auto-deploy
- Pull requests → Vercel creates preview deployments

---

## 📝 What's Next?

- [ ] Share your live URL
- [ ] Add custom domain (optional)
- [ ] Monitor usage in dashboards
- [ ] Read full [DEPLOYMENT.md](DEPLOYMENT.md) for details

**Total Time:** ~5 minutes + 10 minutes waiting for builds

**Total Cost:** $0/month 💰
