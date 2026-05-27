# Deployment Checklist ✅

Use this checklist to ensure successful deployment of your Pakistan Flood ML Analytics Dashboard.

---

## 📋 Pre-Deployment Checklist

### Code Preparation
- [x] ✅ Vite config updated for production build
- [x] ✅ Environment variables configured (.env files created)
- [x] ✅ Dashboard.jsx updated to use environment variable for API URL
- [x] ✅ Backend CORS updated to allow production origins
- [x] ✅ Health check endpoints added to backend
- [x] ✅ render.yaml created for Render deployment
- [x] ✅ vercel.json created for Vercel deployment
- [x] ✅ GitHub Actions updated for CI/CD
- [x] ✅ .gitignore updated

### Local Testing
- [ ] Backend runs locally without errors
- [ ] Frontend runs locally without errors
- [ ] All 5 ML algorithms work (ARIMA, XGBoost, NLP, CNN, K-Means)
- [ ] Dataset upload works
- [ ] No console errors in browser (F12)
- [ ] Production build works: `cd frontend && npm run build && npm run preview`

### Git Repository
- [ ] All changes committed to Git
- [ ] Pushed to GitHub main/master branch
- [ ] Repository is public (or Vercel/Render have access)
- [ ] No sensitive data in repository (.env files not committed)

---

## 🚀 Backend Deployment (Render.com)

### Account Setup
- [ ] Created Render account at https://render.com
- [ ] Connected GitHub account to Render
- [ ] Authorized Render to access your repository

### Service Configuration
- [ ] Created new Web Service
- [ ] Connected correct repository
- [ ] Selected correct branch (main/master)
- [ ] Configured build command:
  ```bash
  cd backend && pip install -r requirements.txt && pip install torch --index-url https://download.pytorch.org/whl/cpu && python generate_datasets.py
  ```
- [ ] Configured start command:
  ```bash
  cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
  ```
- [ ] Selected Free plan
- [ ] Set Python version to 3.11

### Deployment
- [ ] Clicked "Create Web Service"
- [ ] Waited for first deployment (5-10 minutes)
- [ ] Deployment succeeded (green checkmark)
- [ ] Copied backend URL (e.g., `https://your-app.onrender.com`)

### Verification
- [ ] Backend URL loads: `https://your-app.onrender.com/`
- [ ] API docs accessible: `https://your-app.onrender.com/docs`
- [ ] Health check works: `https://your-app.onrender.com/health`
- [ ] Dataset info works: `https://your-app.onrender.com/api/dataset/info`
- [ ] All 5 datasets listed in response

---

## 🎨 Frontend Deployment (Vercel)

### Account Setup
- [ ] Created Vercel account at https://vercel.com
- [ ] Connected GitHub account to Vercel
- [ ] Authorized Vercel to access your repository

### Project Configuration
- [ ] Imported correct repository
- [ ] Selected Vite as framework preset
- [ ] Set root directory to `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Install command: `npm install`

### Environment Variables
- [ ] Added `VITE_API_URL` environment variable
- [ ] Set value to Render backend URL (no trailing slash)
- [ ] Applied to Production, Preview, and Development

### Deployment
- [ ] Clicked "Deploy"
- [ ] Waited for deployment (2-3 minutes)
- [ ] Deployment succeeded
- [ ] Copied frontend URL (e.g., `https://your-project.vercel.app`)

### Verification
- [ ] Frontend URL loads
- [ ] Dashboard displays correctly
- [ ] No console errors (F12)
- [ ] Loading spinner appears when clicking "Run Analysis"

---

## 🔗 Connect Frontend & Backend

### Update Backend CORS
- [ ] Went back to Render dashboard
- [ ] Opened backend service
- [ ] Clicked "Environment" tab
- [ ] Added `FRONTEND_URL` variable with Vercel URL
- [ ] Clicked "Save Changes"
- [ ] Waited for auto-redeploy (30-60 seconds)

### Test Connection
- [ ] Visited frontend URL
- [ ] Clicked "Run Analysis"
- [ ] Analysis runs successfully (may take 30-60 seconds on first request)
- [ ] Results display in dashboard
- [ ] No CORS errors in console

---

## 🧪 Full Integration Testing

### Test All Features
- [ ] Homepage loads
- [ ] Dataset info displays correctly
- [ ] ARIMA analysis works
- [ ] XGBoost analysis works
- [ ] NLP analysis works
- [ ] CNN analysis works
- [ ] K-Means clustering works
- [ ] Auto analysis (all 5 models) works
- [ ] Charts render correctly
- [ ] Tab switching works
- [ ] No errors in browser console
- [ ] No errors in Render logs

### Performance Testing
- [ ] First request completes (may be slow due to cold start)
- [ ] Subsequent requests are faster
- [ ] Page loads in reasonable time
- [ ] Charts render smoothly

---

## 🔄 Auto-Deployment Testing

### GitHub Actions
- [ ] Made a small change (e.g., update README)
- [ ] Committed and pushed to main branch
- [ ] GitHub Actions workflow triggered
- [ ] Backend tests passed
- [ ] Frontend tests passed
- [ ] Build artifacts created

### Vercel Auto-Deploy
- [ ] Vercel detected push to main
- [ ] New deployment triggered automatically
- [ ] Deployment succeeded
- [ ] Changes visible on live site

### Render Auto-Deploy
- [ ] Render detected push to main
- [ ] New deployment triggered automatically
- [ ] Deployment succeeded
- [ ] Backend updated with changes

---

## 📊 Monitoring Setup

### Vercel Dashboard
- [ ] Accessed Vercel dashboard
- [ ] Viewed deployment logs
- [ ] Checked analytics (if available)
- [ ] Bookmarked dashboard URL

### Render Dashboard
- [ ] Accessed Render dashboard
- [ ] Viewed service logs
- [ ] Checked resource usage
- [ ] Bookmarked dashboard URL

---

## 🎉 Post-Deployment

### Documentation
- [ ] Updated README with live URLs
- [ ] Documented any deployment issues encountered
- [ ] Created internal documentation for team (if applicable)

### Sharing
- [ ] Shared live URL with stakeholders
- [ ] Added live URL to GitHub repository description
- [ ] Updated portfolio/resume with project link (if applicable)

### Optional Enhancements
- [ ] Set up custom domain on Vercel
- [ ] Set up custom domain on Render
- [ ] Configure UptimeRobot to prevent cold starts
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Enable Vercel Analytics
- [ ] Upgrade to paid tier if needed

---

## 🐛 Troubleshooting

If something doesn't work, check:

### Frontend Issues
- [ ] Environment variable `VITE_API_URL` is set correctly in Vercel
- [ ] No trailing slash in API URL
- [ ] Browser console for errors (F12)
- [ ] Vercel deployment logs

### Backend Issues
- [ ] Environment variable `FRONTEND_URL` is set in Render
- [ ] Build completed successfully
- [ ] Datasets generated during build
- [ ] Render service logs for errors
- [ ] Health check endpoint responds

### CORS Issues
- [ ] Both URLs are correct (no trailing slashes)
- [ ] Backend CORS includes frontend URL
- [ ] Both services redeployed after adding environment variables

### Performance Issues
- [ ] First request is slow (normal for Render free tier)
- [ ] Consider UptimeRobot to keep backend warm
- [ ] Check Render resource usage
- [ ] Consider upgrading to paid tier

---

## ✅ Final Verification

- [ ] ✅ Backend deployed and accessible
- [ ] ✅ Frontend deployed and accessible
- [ ] ✅ Frontend connects to backend successfully
- [ ] ✅ All 5 ML algorithms work
- [ ] ✅ No errors in production
- [ ] ✅ Auto-deployment configured
- [ ] ✅ Monitoring set up
- [ ] ✅ Documentation updated
- [ ] ✅ Live URLs shared

---

## 🎊 Congratulations!

Your Pakistan Flood ML Analytics Dashboard is now live in production!

**Frontend:** `https://your-project.vercel.app`  
**Backend:** `https://your-app.onrender.com`

**Next Steps:**
1. Monitor usage and performance
2. Gather user feedback
3. Iterate and improve
4. Consider scaling if needed

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Live URLs:**
- Frontend: _________________
- Backend: _________________

**Notes:**
_________________
_________________
_________________
