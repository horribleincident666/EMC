@echo off
cd /d "%~dp0"
set PORT=8899
echo Starting EMC Production Management on http://127.0.0.1:%PORT%/
echo Keep this window open while using the local app.
"C:\Users\subra\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
pause
