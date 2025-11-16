#!/bin/bash
# Launch Chrome with remote debugging enabled and extensions allowed
# This allows MCP browser tools to connect and extensions to be installed
# Port 9222 is used for remote debugging connection

CHROME_PORT=9222
USER_DATA_DIR="/tmp/chrome-debug-profile"

# Try to find Chrome executable
CHROME_PATH=""

if [ -f "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
    CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif [ -f "/usr/bin/google-chrome" ]; then
    CHROME_PATH="/usr/bin/google-chrome"
elif [ -f "/usr/bin/chromium-browser" ]; then
    CHROME_PATH="/usr/bin/chromium-browser"
else
    echo "ERROR: Chrome not found. Please install Chrome or update the path in this script."
    exit 1
fi

echo "Launching Chrome with remote debugging on port $CHROME_PORT..."
"$CHROME_PATH" \
    --remote-debugging-port=$CHROME_PORT \
    --enable-extensions \
    --user-data-dir="$USER_DATA_DIR" \
    chrome://extensions/ &

echo "Chrome launched! You can now load the extension from the dist folder."
