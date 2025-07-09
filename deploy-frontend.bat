@echo off
echo Rebuilding frontend for production...

cd client
npm run build

echo.
echo Build completed!
echo.
echo Next steps:
echo 1. Upload the 'build' folder to your IONOS hosting
echo 2. Make sure the backend URL is correct in .env.production
echo 3. Test the application

pause
