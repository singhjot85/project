@echo off
echo Running Python Backend...

:: Navigate to the directory where the .bat file is located
cd /d %~dp0

::Running Backend Server
start python app.py

::Change acccording your hardware(current hardware: i5/8gb)
timeout /t 15

echo Running Node.js Frontend...

:: Navigating to  frontend project directory
cd frontend

::Running frontend Server
start npm start

echo Both servers are running.
pauses