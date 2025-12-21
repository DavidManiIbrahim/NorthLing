# NorthLing Backend API

Node.js + Express + MongoDB backend for NorthLing language learning platform.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

3. **Install and start MongoDB:**
   - Download MongoDB from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   - Update `MONGODB_URI` in `.env` with your connection string

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

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

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** Helmet, bcryptjs
- **Language:** TypeScript
