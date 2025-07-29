# Railway Setup - Step by Step Guide

## 🎯 Overview
You'll create **TWO services** in Railway:
1. **Backend Service** (Root Directory: `backend`)  
2. **Frontend Service** (Root Directory: `frontend`)

---

## 🚀 Step 1: Create Backend Service

### 1.1 Create New Project
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select your `teomed-app` repository
5. Click **"Deploy Now"**

### 1.2 Configure Backend Build Settings
1. **Click on the deployed service**
2. Go to **"Settings"** tab
3. In **"Environment"** section, scroll down to **"Build"**
4. Set these values:
   ```
   Root Directory: backend
   Dockerfile Path: Dockerfile
   ```

### 1.3 Set Backend Environment Variables
In **"Variables"** tab, add:
```bash
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your_super_secure_jwt_secret_here
NODE_ENV=production
PORT=3003
```

### 1.4 Add Database (Optional)
1. Click **"+ New"** in your project
2. Select **"Database"** → **"Add MongoDB"**
3. Copy the connection string to your `MONGODB_URI` variable

---

## 🎨 Step 2: Create Frontend Service

### 2.1 Add New Service
1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose the **same** `teomed-app` repository
4. Click **"Deploy"**

### 2.2 Configure Frontend Build Settings
1. **Click on the new service**
2. Go to **"Settings"** tab  
3. In **"Environment"** section, scroll to **"Build"**
4. Set these values:
   ```
   Root Directory: frontend
   Dockerfile Path: Dockerfile
   ```

### 2.3 Set Frontend Environment Variables
In **"Variables"** tab, add:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-service-url.railway.app
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

**⚠️ Important:** Replace `your-backend-service-url` with your actual backend service URL from Step 1.

---

## 🔧 Alternative: Use railway.json Files

If you prefer configuration files, the `railway.json` files are already created in:
- `backend/railway.json` ✅
- `frontend/railway.json` ✅

With these files, Railway will automatically detect the configuration!

---

## ✅ Verification Steps

### Backend Health Check:
1. Visit: `https://your-backend-url.railway.app`
2. Should see your NestJS API response

### Frontend Health Check:  
1. Visit: `https://your-frontend-url.railway.app`
2. Should redirect to `/login` page
3. Login should connect to backend API

### Check Service Logs:
1. In Railway dashboard, click each service
2. Go to **"Deployments"** tab
3. Click latest deployment to see logs

---

## 🐛 Common Issues & Solutions

### ❌ "Dockerfile not found"
**Solution:** Check Root Directory is set correctly
- Backend: `backend`
- Frontend: `frontend`

### ❌ "Build context" errors  
**Solution:** Dockerfile Path should be just `Dockerfile` (relative to Root Directory)

### ❌ Frontend can't connect to backend
**Solution:** 
1. Check `NEXT_PUBLIC_API_URL` points to correct backend URL
2. Verify backend service is deployed and healthy
3. Check backend CORS settings

### ❌ Permission errors
**Solution:** Your Dockerfiles use non-root users - this should resolve automatically

---

## 🎉 Success! 
Both services should now be deployed and communicating properly.

**Backend URL:** `https://your-backend.railway.app`  
**Frontend URL:** `https://your-frontend.railway.app` 