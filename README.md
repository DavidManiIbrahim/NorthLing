# NorthLing - Migration to Node.js + MongoDB

This project has been migrated from Supabase to a custom Node.js + MongoDB backend.

## Project Structure

```
NorthLing/
├── backend/              # Node.js + Express + MongoDB backend
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   └── server.ts    # Main server file
│   ├── package.json
│   └── tsconfig.json
├── src/                  # React frontend
│   ├── lib/
│   │   └── api-client.ts # API client (replaces Supabase)
│   ├── pages/
│   ├── components/
│   └── ...
└── package.json
```

## Setup Instructions

### 1. Install MongoDB

**Option A: Local MongoDB**
- Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # macOS/Linux
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `backend/.env`

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Update .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/northling
# or
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/northling

# Start development server
npm run dev
```

The backend will run on `http://https://northling-backend.onrender.com/`

### 3. Setup Frontend

```bash
# Navigate to root directory
cd ..

# Install dependencies (removes Supabase packages)
npm install

# Create .env file
copy .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://https://northling.onrender.com/`

## Environment Variables

### Backend (.env)
```
PORT=2000
MONGODB_URI=mongodb://localhost:27017/northling
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
CORS_ORIGIN=http://https://northling.onrender.com/
```

### Frontend (.env)
```
VITE_API_URL=http://https://northling-backend.onrender.com//api
```

## API Endpoints

All endpoints are prefixed with `/api`

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PATCH /api/auth/profile` - Update user profile (requires auth)
- `POST /api/auth/signout` - Logout user

### User Preferences
- `GET /api/preferences` - Get user preferences (requires auth)
- `PATCH /api/preferences` - Update preferences (requires auth)

### User Progress
- `GET /api/progress` - Get user progress (requires auth)
- `PATCH /api/progress` - Update progress (requires auth)
- `GET /api/progress/leaderboard` - Get leaderboard

### Activities
- `GET /api/activities` - Get user activities (requires auth)
- `POST /api/activities` - Create activity (requires auth)
- `GET /api/activities/all` - Get all activities (admin)

## Migration Changes

### Removed
- ✅ Supabase client and all related files
- ✅ `@supabase/supabase-js` package
- ✅ `/supabase` directory
- ✅ `/src/integrations/supabase` directory

### Added
- ✅ Node.js + Express backend
- ✅ MongoDB with Mongoose ODM
- ✅ JWT authentication
- ✅ API client for frontend
- ✅ User, UserPreferences, UserProgress, Activity models

### Updated
- ✅ AuthPage to use new API client
- ✅ All authentication flows
- ✅ Package.json (removed Supabase)

## Development

### Backend Development
```bash
cd backend
npm run dev    # Start with hot reload
npm run build  # Build for production
npm start      # Start production server
```

### Frontend Development
```bash
npm run dev    # Start Vite dev server
npm run build  # Build for production
```

## Production Deployment

### Backend
1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (use MongoDB Atlas for cloud)
3. Build and deploy:
   ```bash
   cd backend
   npm run build
   npm start
   ```

### Frontend
1. Update `VITE_API_URL` to your production backend URL
2. Build and deploy:
   ```bash
   npm run build
   ```

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, bcryptjs
- **Validation:** express-validator
- **Language:** TypeScript

### Frontend
- **Framework:** React + Vite
- **UI:** Shadcn/ui + Tailwind CSS
- **Routing:** React Router
- **State:** React Query
- **Language:** TypeScript

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Check if port 2000 is available

### Frontend can't connect to backend
- Verify backend is running on port 2000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

### Authentication issues
- Clear browser localStorage
- Check JWT_SECRET is set in backend `.env`
- Verify token is being sent in Authorization header
