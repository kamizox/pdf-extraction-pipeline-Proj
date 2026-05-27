# Vercel Frontend Deployment Guide

Deploy your Pakistan Flood ML Analytics Dashboard frontend to Vercel for **FREE** - No credit card required!

**Backend URL:** https://pdf-extraction-pipeline-proj-production.up.railway.app

---

## 🎯 Quick Deployment Steps

### Step 1: Commit and Push Changes (1 minute)

```bash
# Add all changes
git add .

# Commit with message
git commit -m "Update frontend for production deployment"

# Push to GitHub
git push origin main
```

### Step 2: Create Vercel Account (1 minute)

1. Go to: **https://vercel.com**
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your repositories
5. ✅ **No credit card required!**

### Step 3: Import Project (30 seconds)

1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Find your repository: `pdf-extraction-pipeline-Proj`
4. Click **"Import"**

### Step 4: Configure Project (2 minutes)

#### Framework Preset
- Should auto-detect: **Vite**
- If not, select **Vite** from dropdown

#### Root Directory
1. Click **"Edit"** next to "Root Directory"
2. Select **`frontend`** folder
3. Click **"Continue"**

#### Build Settings (Auto-filled)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

✅ Leave these as default!

#### Environment Variables
1. Click **"Environment Variables"** section
2. Add variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://pdf-extraction-pipeline-proj-production.up.railway.app`
   - **Environments:** Select all three:
     - ☑ Production
     - ☑ Preview
     - ☑ Development

3. Click **"Add"**

### Step 5: Deploy! (2-3 minutes)

1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. Watch the build logs in real-time

You should see:
```
Building...
✓ Installing dependencies
✓ Building production bundle
✓ Optimizing assets
✓ Build completed in 2m 15s
✓ Deploying to Edge Network
✓ Deployment Ready!
```

### Step 6: Get Your Frontend URL

After deployment succeeds:
1. You'll see: **"Congratulations! 🎉"**
2. Your URL will be shown: `https://your-project.vercel.app`
3. Click **"Visit"** to open your dashboard
4. **Copy this URL** - you'll need it for Railway!

---

## 🔗 Connect Frontend & Backend

### Update Railway Environment Variables

1. Go to Railway dashboard: https://railway.app/dashboard
2. Click your backend service
3. Go to **"Variables"** tab
4. Click **"New Variable"**
5. Add:
   - **Variable Name:** `FRONTEND_URL`
   - **Variable Value:** `https://your-project.vercel.app` (your Vercel URL)
6. Click **"Add"**
7. Service will automatically redeploy (30-60 seconds)

---

## ✅ Test Your Deployment

### Step 1: Test Backend Connection

Visit your Vercel URL: `https://your-project.vercel.app`

You should see:
```
✓ Dashboard loads
✓ Summary cards display
✓ No console errors (press F12 to check)
```

### Step 2: Test ML Analysis

1. Click **"Run Analysis"** button
2. Select algorithm (or use "Auto")
3. Wait for results (2-5 seconds)
4. Verify charts display correctly

### Step 3: Test All Algorithms

Test each algorithm individually:
- ✅ ARIMA Time Series
- ✅ XGBoost Classification
- ✅ NLP Sentiment Analysis
- ✅ CNN Damage Prediction
- ✅ K-Means Clustering

All should work! 🎉

---

## 🎨 Vercel Dashboard Features

### Deployments Tab
- View all deployments
- See build logs
- Rollback to previous versions
- Preview deployments for PRs

### Settings Tab
- Environment variables
- Custom domains
- Build & output settings
- Git integration

### Analytics Tab (Optional)
- Page views
- Performance metrics
- User insights
- Enable for free!

---

## 🔄 Auto-Deployment

### How It Works

```
1. Make code changes locally
   ↓
2. git commit -m "your changes"
   ↓
3. git push origin main
   ↓
4. GitHub notifies Vercel
   ↓
5. Vercel builds and deploys (2-3 min)
   ↓
6. Changes are LIVE!
```

### Preview Deployments

When you create a pull request:
- Vercel creates a preview deployment
- Unique URL for testing
- Doesn't affect production
- Perfect for testing before merge!

---

## 🐛 Troubleshooting

### Issue: Build fails

**Check build logs:**
1. Go to Vercel dashboard
2. Click "Deployments"
3. Click failed deployment
4. View logs

**Common issues:**
- Missing dependencies in `package.json`
- Build command incorrect
- Root directory not set to `frontend`

**Solution:**
1. Verify `frontend/package.json` exists
2. Check root directory is set to `frontend`
3. Redeploy

### Issue: Frontend can't connect to backend

**Symptoms:**
- "Network Error" in browser
- CORS errors in console (F12)
- Analysis doesn't run

**Solution:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify URL has no trailing slash
3. Check `FRONTEND_URL` is set in Railway
4. Redeploy both services
5. Clear browser cache

**Verify CORS:**
```bash
# Test from command line
curl -I https://pdf-extraction-pipeline-proj-production.up.railway.app/api/dataset/info
```

Should include:
```
Access-Control-Allow-Origin: https://your-project.vercel.app
```

### Issue: Environment variable not working

**Symptoms:**
- Frontend connects to localhost instead of Railway
- API calls fail

**Solution:**
1. Go to Vercel project settings
2. Click "Environment Variables"
3. Verify `VITE_API_URL` is set correctly
4. Make sure it's applied to "Production"
5. Redeploy (Vercel → Deployments → Redeploy)

**Important:** Environment variables are only applied during build time for Vite!

### Issue: Old deployment still showing

**Solution:**
1. Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Try incognito/private window
4. Check Vercel shows latest deployment as "Production"

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

1. Go to Vercel project settings
2. Click **"Domains"** tab
3. Click **"Add"**
4. Enter your domain: `floodml.yourdomain.com`
5. Follow DNS instructions
6. Vercel provisions SSL automatically (free!)

### Update Railway

After adding custom domain:
1. Go to Railway dashboard
2. Update `FRONTEND_URL` to your custom domain
3. Redeploy

---

## 📊 Performance Optimization

### Already Optimized!

Your Vite config includes:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Asset optimization
- ✅ Lazy loading

### Vercel Provides:
- ✅ Global CDN
- ✅ Edge caching
- ✅ Automatic compression
- ✅ HTTP/2 & HTTP/3

**Result:** Fast loading worldwide! ⚡

---

## 💰 Vercel Free Tier

### What You Get:
- ✅ **100 GB bandwidth/month**
- ✅ **Unlimited deployments**
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Preview deployments**
- ✅ **Analytics** (optional)
- ✅ **Custom domains**

### Limits:
- 100 GB bandwidth/month
- 100 GB-hours serverless function execution
- 6,000 build minutes/month

**For this project:** Well within free tier! ✅

**Cost:** $0/month 💰

---

## 🎯 Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Frontend URL copied
- [ ] `FRONTEND_URL` added to Railway
- [ ] Railway service redeployed
- [ ] Frontend loads without errors
- [ ] Backend connection works
- [ ] All 5 ML algorithms tested
- [ ] No CORS errors
- [ ] Auto-deployment tested (push a change)
- [ ] README updated with live URLs

---

## 📝 Update Your README

Add your live URLs to README.md:

```markdown
## 🌐 Live Demo

**Frontend:** https://your-project.vercel.app
**Backend API:** https://pdf-extraction-pipeline-proj-production.up.railway.app
**API Docs:** https://pdf-extraction-pipeline-proj-production.up.railway.app/docs

Try it now! No installation required.
```

---

## 🎉 Success!

Your Pakistan Flood ML Analytics Dashboard is now LIVE!

**Frontend:** `https://your-project.vercel.app`
**Backend:** `https://pdf-extraction-pipeline-proj-production.up.railway.app`

### Features:
- ✅ No credit card required
- ✅ Free hosting
- ✅ Auto-deployment
- ✅ HTTPS enabled
- ✅ Global CDN
- ✅ No cold starts
- ✅ Fast performance

### Share Your Dashboard:
- Add to your portfolio
- Share on LinkedIn
- Include in resume
- Show to potential employers
- Get user feedback

**Congratulations! 🎊**

---

## 📚 Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev
- **React Docs:** https://react.dev
- **Vercel Support:** https://vercel.com/support

---

## 🆘 Need Help?

1. Check Vercel build logs
2. Check browser console (F12)
3. Verify environment variables
4. Test backend URL directly
5. Ask in Vercel Discord: https://vercel.com/discord

---

**Your dashboard is ready to share with the world! 🌍**
