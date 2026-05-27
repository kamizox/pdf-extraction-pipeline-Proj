# Deployment Guide - Pakistan Flood ML Analytics Dashboard

This guide will help you deploy the frontend to Vercel and the backend to Render.com for free.

---

## 📋 Prerequisites

- GitHub account with your repository pushed
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)

---

## 🚀 Part 1: Deploy Backend to Render.com

### Step 1: Create Render Account
1. Go to https://render.com
2. Click "Get Started" and sign up with GitHub
3. Authorize Render to access your GitHub repositories

### Step 2: Create New Web Service
1. Click "New +" button in the top right
2. Select "Web Service"
3. Connect your GitHub repository: `pdf-extraction-pipeline-Proj`
4. Click "Connect"

### Step 3: Configure Web Service
Fill in the following settings:

**Basic Settings:**
- **Name:** `pakistan-flood-ml-backend` (or your preferred name)
- **Region:** Oregon (US West) - or closest to you
- **Branch:** `main` (or `master`)
- **Root Directory:** Leave empty (render.yaml handles this)
- **Runtime:** Python 3

**Build & Deploy:**
- **Build Command:**
  ```bash
  cd backend && pip install -r requirements.txt && pip install torch --index-url https://download.pytorch.org/whl/cpu && python generate_datasets.py
  ```

- **Start Command:**
  ```bash
  cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- Select **Free** plan

### Step 4: Add Environment Variables (Optional)
Click "Advanced" and add:
- Key: `PYTHON_VERSION`, Value: `3.11.0`
- Key: `FRONTEND_URL`, Value: (leave empty for now, will add after Vercel deployment)

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for the first deployment
3. Once deployed, you'll see a URL like: `https://pakistan-flood-ml-backend.onrender.com`
4. **Copy this URL** - you'll need it for frontend configuration

### Step 6: Verify Backend
Visit your backend URL:
- Main page: `https://your-backend.onrender.com/`
- API docs: `https://your-backend.onrender.com/docs`
- Health check: `https://your-backend.onrender.com/health`
- Dataset info: `https://your-backend.onrender.com/api/dataset/info`

⚠️ **Note:** Free tier on Render spins down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up" and use GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository: `pdf-extraction-pipeline-Proj`
3. Click "Import"

### Step 3: Configure Project
**Framework Preset:** Vite

**Root Directory:** Click "Edit" and select `frontend`

**Build Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Add Environment Variable
Click "Environment Variables" and add:

- **Key:** `VITE_API_URL`
- **Value:** `https://your-backend.onrender.com` (paste your Render backend URL from Part 1)
- **Environment:** Production, Preview, Development (select all)

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for deployment
3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

### Step 6: Update Backend CORS
1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Add/Update environment variable:
   - Key: `FRONTEND_URL`
   - Value: `https://your-project.vercel.app` (your Vercel URL)
5. Click "Save Changes"
6. Service will automatically redeploy

### Step 7: Test Your Deployment
1. Visit your Vercel URL: `https://your-project.vercel.app`
2. The dashboard should load
3. Click "Run Analysis" - it should connect to your Render backend
4. Check browser console (F12) for any errors

---

## 🔄 Part 3: Set Up Auto-Deployment

### Vercel Auto-Deploy (Already Configured)
✅ Vercel automatically deploys on every push to `main` branch
✅ Preview deployments created for pull requests

### Render Auto-Deploy (Already Configured)
✅ Render automatically deploys on every push to `main` branch
✅ Uses `render.yaml` configuration

---

## 🔧 Troubleshooting

### Frontend can't connect to backend
**Problem:** CORS errors in browser console

**Solution:**
1. Verify `VITE_API_URL` is set correctly in Vercel
2. Verify `FRONTEND_URL` is set in Render
3. Check both URLs don't have trailing slashes
4. Redeploy both services

### Backend deployment fails
**Problem:** Build fails on Render

**Solution:**
1. Check build logs in Render dashboard
2. Verify `requirements.txt` is correct
3. PyTorch installation may timeout - this is normal, retry deployment
4. Free tier has limited resources - some ML operations may be slow

### Backend is slow or times out
**Problem:** First request takes 30-60 seconds

**Solution:**
- This is normal for Render free tier (cold starts)
- Consider upgrading to paid tier for always-on service
- Or use a service like UptimeRobot to ping your backend every 14 minutes

### Datasets not found
**Problem:** Backend returns "File not found" errors

**Solution:**
1. Check that `generate_datasets.py` ran successfully in build logs
2. Verify `backend/datasets/` folder exists
3. Redeploy with "Clear build cache" option

---

## 📊 Monitoring Your Deployment

### Vercel Dashboard
- View deployment logs
- Monitor build times
- Check analytics (page views, performance)
- Access: https://vercel.com/dashboard

### Render Dashboard
- View service logs
- Monitor resource usage
- Check deployment history
- Access: https://dashboard.render.com

---

## 💰 Cost Breakdown

### Vercel Free Tier
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN

### Render Free Tier
- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic HTTPS
- ✅ Auto-deploy from Git
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 512 MB RAM (may be tight for ML operations)

**Total Cost: $0/month** 🎉

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Keep dependencies updated** - run `npm audit` and `pip list --outdated`
4. **Monitor logs** for suspicious activity
5. **Use HTTPS only** - both Vercel and Render provide this automatically

---

## 🚀 Next Steps

After successful deployment:

1. ✅ Test all 5 ML algorithms (ARIMA, XGBoost, NLP, CNN, K-Means)
2. ✅ Share your live URL with users
3. ✅ Set up custom domain (optional)
4. ✅ Monitor usage and performance
5. ✅ Consider upgrading if you need:
   - Faster cold starts (Render paid tier)
   - More bandwidth (Vercel Pro)
   - Better performance (both)

---

## 📝 Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., `floodml.yourdomain.com`)
3. Update DNS records as instructed
4. Vercel automatically provisions SSL certificate

### Add Custom Domain to Render
1. Go to Service Settings → Custom Domain
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS records as instructed
4. Update `VITE_API_URL` in Vercel to use new domain

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **GitHub Issues:** Create an issue in your repository
- **Community:** Stack Overflow with tags `vercel`, `render`, `fastapi`, `vite`

---

## ✅ Deployment Checklist

Before going live:

- [ ] Backend deployed successfully on Render
- [ ] Backend `/docs` endpoint accessible
- [ ] Backend `/api/dataset/info` returns data
- [ ] Frontend deployed successfully on Vercel
- [ ] Frontend loads without errors
- [ ] Frontend can connect to backend API
- [ ] All 5 ML algorithms work
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Auto-deployment working
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

---

**Congratulations! Your Pakistan Flood ML Analytics Dashboard is now live! 🎉**
