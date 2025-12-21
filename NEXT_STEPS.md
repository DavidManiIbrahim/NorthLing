# 🚀 Next Steps - NorthLing Setup

## ✅ Installation Status

- ✅ **Backend dependencies installed** (`backend/node_modules` exists)
- ⏳ **Frontend dependencies installing** (in progress...)

---

## 📋 What to Do Next

### Step 1: Wait for Frontend Installation
The frontend `npm install` is currently running. Wait for it to complete.

### Step 2: Set Up MongoDB

Choose **ONE** of these options:

#### Option A: MongoDB Atlas (Cloud - Recommended) ☁️
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free M0 cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster...`)
6. Save it for Step 3

#### Option B: Local MongoDB 💻
1. Download from https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```
4. Your connection string will be: `mongodb://localhost:27017/northling`

### Step 3: Create Environment Files

#### Backend Environment (`backend/.env`)
Create this file with your MongoDB connection:

```env
PORT=2000
MONGODB_URI=mongodb://localhost:27017/northling
# OR if using Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/northling

JWT_SECRET=my-super-secret-jwt-key-12345
NODE_ENV=development
CORS_ORIGIN=http://https://northling.onrender.com/
```

**Important:** Replace `JWT_SECRET` with a random string!

#### Frontend Environment (`.env`)
Create this file in the root directory:

```env
VITE_API_URL=http://https://northling-backend.onrender.com//api
```

### Step 4: Start the Application

Open **TWO** terminal windows:

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ MongoDB connected successfully
🚀 Server running on http://https://northling-backend.onrender.com/
📝 Environment: development
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://https://northling.onrender.com//
```

### Step 5: Test the Application

1. Open your browser to http://https://northling.onrender.com/
2. Click on "Auth" or navigate to `/auth`
3. Create a new account
4. Login with your credentials
5. Test the dashboard and features!

---

## 🎯 Quick Commands Reference

```bash
# Start backend (from project root)
cd backend && npm run dev

# Start frontend (from project root)
npm run dev

# Check if MongoDB is running (Windows)
net start MongoDB

# Stop MongoDB (Windows)
net stop MongoDB

# View backend logs
cd backend && npm run dev

# Build for production
npm run build
```

---

## 🐛 Common Issues & Solutions

### "Cannot connect to MongoDB"
- **Atlas:** Whitelist your IP in Atlas dashboard (Network Access)
- **Local:** Check if MongoDB service is running: `net start MongoDB`
- **Both:** Verify `MONGODB_URI` in `backend/.env`

### "Port 2000 already in use"
- Change `PORT=5001` in `backend/.env`
- Update `VITE_API_URL=http://localhost:5001/api` in `.env`

### "CORS error in browser"
- Verify `CORS_ORIGIN=http://https://northling.onrender.com/` in `backend/.env`
- Restart backend server
- Clear browser cache

### "Authentication not working"
- Clear browser localStorage: Open DevTools → Console → Type `localStorage.clear()`
- Check `JWT_SECRET` is set in `backend/.env`
- Restart backend server

---

## 📊 Current Status

| Task | Status |
|------|--------|
| Backend created | ✅ Complete |
| Backend dependencies | ✅ Installed |
| Frontend updated | ✅ Complete |
| Frontend dependencies | ⏳ Installing |
| MongoDB setup | ⏸️ Pending |
| Environment files | ⏸️ Pending |
| Test application | ⏸️ Pending |

---

## 🎓 What You Have Now

### Backend API Endpoints
```
POST   /api/auth/signup          - Create account
POST   /api/auth/signin          - Login
GET    /api/auth/me              - Get current user
PATCH  /api/auth/profile         - Update profile
GET    /api/preferences          - Get preferences
PATCH  /api/preferences          - Update preferences
GET    /api/progress             - Get progress
PATCH  /api/progress             - Update progress
GET    /api/progress/leaderboard - View leaderboard
GET    /api/activities           - Get activities
POST   /api/activities           - Log activity
```

### Updated Frontend Components
- ✅ `src/lib/api-client.ts` - API client
- ✅ `src/hooks/useAuth.tsx` - Auth hook
- ✅ `src/pages/AuthPage.tsx` - Auth page
- ✅ `src/components/Leaderboard.tsx` - Leaderboard

### Still Using  (Need Updates)
- ⚠️ `src/components/QuizSection.tsx`
- ⚠️ `src/components/AuthModal.tsx`
- ⚠️ `src/pages/admin/AdminDashboard.tsx`
- ⚠️ `src/pages/admin/UserManagement.tsx`
- ⚠️ `src/pages/Index.tsx`

---

## 📚 Documentation

- **Quick Setup:** This file (NEXT_STEPS.md)
- **Detailed Guide:** SETUP.md
- **Backend API:** backend/README.md
- **Main README:** README.md

---

## ✨ Success Checklist

- [ ] Frontend dependencies installed
- [ ] MongoDB installed/configured
- [ ] `backend/.env` created
- [ ] `.env` created
- [ ] Backend server starts successfully
- [ ] Frontend server starts successfully
- [ ] Can create account at `/auth`
- [ ] Can login successfully
- [ ] Dashboard loads correctly

---

**You're almost there! Just a few more steps to go! 🚀**

Once the frontend installation completes, follow Steps 2-5 above to get your app running!
