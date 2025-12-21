@echo off
echo ================================
echo NorthLing Migration Setup
echo ================================
echo.

echo Step 1: Installing backend dependencies...
cd backend
if not exist node_modules (
    call npm install
) else (
    echo Backend dependencies already installed.
)
echo.

echo Step 2: Setting up backend environment...
if not exist .env (
    copy .env.example .env
    echo Created backend .env file. Please update MongoDB connection string!
) else (
    echo Backend .env already exists.
)
echo.

cd ..

echo Step 3: Installing frontend dependencies...
if not exist node_modules (
    call npm install
) else (
    echo Frontend dependencies already installed.
)
echo.

echo Step 4: Setting up frontend environment...
if not exist .env (
    copy .env.example .env
    echo Created frontend .env file.
) else (
    echo Frontend .env already exists.
)
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Install MongoDB (if not already installed)
echo 2. Update backend/.env with your MongoDB connection string
echo 3. Start MongoDB service
echo 4. Run: cd backend ^&^& npm run dev (in one terminal)
echo 5. Run: npm run dev (in another terminal)
echo.
echo For more information, see README.md
echo.
pause
