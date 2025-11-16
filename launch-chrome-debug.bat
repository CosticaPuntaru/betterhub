@echo off
REM Launch Chrome with remote debugging enabled and extensions allowed
REM This allows MCP browser tools to connect and extensions to be installed
REM Port 9222 is used for remote debugging connection

set CHROME_PORT=9222
set USER_DATA_DIR=%TEMP%\chrome-debug-profile

REM Try common Chrome installation paths
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo Launching Chrome with remote debugging on port %CHROME_PORT%...
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=%CHROME_PORT% --enable-extensions --user-data-dir="%USER_DATA_DIR%" chrome://extensions/
    echo Chrome launched! You can now load the extension from the dist folder.
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo Launching Chrome with remote debugging on port %CHROME_PORT%...
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --remote-debugging-port=%CHROME_PORT% --enable-extensions --user-data-dir="%USER_DATA_DIR%" chrome://extensions/
    echo Chrome launched! You can now load the extension from the dist folder.
) else (
    echo ERROR: Chrome not found in standard locations.
    echo Please install Chrome or update the path in this script.
    pause
    exit /b 1
)

