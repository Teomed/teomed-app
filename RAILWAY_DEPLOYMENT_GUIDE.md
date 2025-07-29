# Railway Deployment Guide - Separate Dockerfiles

This guide explains how to deploy both backend and frontend services to Railway using their respective Dockerfiles.

## 🎯 Project Structure
```
teomed-app/
├── backend/
│   ├── Dockerfile          ← Backend Docker config
│   ├── .dockerignore       ← Backend ignore rules
│   └── ...
├── frontend/
│   ├── Dockerfile          ← Frontend Docker config  
│   ├── .dockerignore       ← Frontend ignore rules
│   └── ...
└── .dockerignore           ← Root ignore rules
```

## 🚀 Backend Deployment (Deploy First)

### 1. Create Railway Service
1. Go to [Railway](https://railway.app)
2. Create new project
3. Connect your GitHub repository

### 2. Configure Backend Service
In Railway dashboard settings:

**Build & Deploy Settings:**
- **Root Directory**: `backend`
- **Dockerfile Path**: `Dockerfile` (relative to backend directory)
- **Build Command**: (leave empty - Docker handles this)
- **Start Command**: (leave empty - Docker handles this)

**Environment Variables:**
```bash
# Required
MONGODB_URI=mongodb://mongodb:27017/teomed-db  # or your MongoDB connection string
JWT_SECRET=your_super_secret_jwt_key_here      # Change this!
NODE_ENV=production

# Optional (Railway sets automatically)
PORT=3003
```

### 3. Add MongoDB (if needed)
- Add MongoDB plugin to your Railway project
- Use the provided `MONGODB_URI` from Railway

## 🎨 Frontend Deployment (Deploy Later)

### 1. Create New Railway Service
1. In same Railway project, click "New Service"
2. Connect to same GitHub repository

### 2. Configure Frontend Service
In Railway dashboard settings:

**Build & Deploy Settings:**
- **Root Directory**: `frontend`
- **Dockerfile Path**: `Dockerfile` (relative to frontend directory)
- **Build Command**: (leave empty - Docker handles this)
- **Start Command**: (leave empty - Docker handles this)

**Environment Variables:**
```bash
# Required - Point to your backend service
NEXT_PUBLIC_API_URL=https://your-backend-service.railway.app

# Optional
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## 🔧 Alternative Railway Configuration Methods

### Method 1: Using Railway CLI
```bash
# Deploy backend
railway login
railway link  # Link to your project
railway up --service backend

# Deploy frontend  
railway up --service frontend
```

### Method 2: Using railway.json
Create `railway.json` in root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "dockerfile",
    "dockerfilePath": "backend/Dockerfile",
    "buildContext": "backend"
  },
  "deploy": {
    "startCommand": "sh start-with-seed.sh",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "always"
  }
}
```

## 📝 Deployment Steps Summary

### Backend First:
1. ✅ Push changes to GitHub
2. ✅ Create Railway project & connect repo
3. ✅ Set Root Directory: `backend`
4. ✅ Set environment variables
5. ✅ Deploy and get backend URL

### Frontend Second:
1. ✅ Create new service in same project
2. ✅ Set Root Directory: `frontend`  
3. ✅ Set `NEXT_PUBLIC_API_URL` to backend URL
4. ✅ Deploy frontend

## 🐛 Troubleshooting

### Common Issues:

**Build fails with "package.json not found"**
- ✅ Check Root Directory is set correctly
- ✅ Verify Dockerfile path is relative to Root Directory

**Backend starts but frontend can't connect**
- ✅ Check `NEXT_PUBLIC_API_URL` environment variable
- ✅ Ensure backend service is healthy
- ✅ Check CORS configuration in backend

**Permission denied errors**
- ✅ Your Dockerfiles now use non-root users for security
- ✅ This should resolve most permission issues

### Build Optimization:
Your Dockerfiles are optimized with:
- ✅ Layer caching for faster builds
- ✅ Security (non-root users)
- ✅ Smaller image sizes
- ✅ Production-ready configurations

## 🔗 Service Communication
Once both are deployed:
- Backend: `https://your-backend.railway.app`
- Frontend: `https://your-frontend.railway.app`
- Frontend automatically connects to backend via `NEXT_PUBLIC_API_URL`

Ready to deploy! 🚀 