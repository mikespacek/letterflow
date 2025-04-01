#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Launching Real Estate Letter Generator...${NC}"

# Check if servers are already running
HTTP_RUNNING=false
API_RUNNING=false

# Check for PID files
if [ -f logs/http_server.pid ]; then
    HTTP_PID=$(cat logs/http_server.pid)
    if ps -p $HTTP_PID > /dev/null; then
        HTTP_RUNNING=true
        echo -e "${YELLOW}HTTP server is already running (PID: $HTTP_PID).${NC}"
    fi
fi

if [ -f logs/api_server.pid ]; then
    API_PID=$(cat logs/api_server.pid)
    if ps -p $API_PID > /dev/null; then
        API_RUNNING=true
        echo -e "${YELLOW}API server is already running (PID: $API_PID).${NC}"
    fi
fi

# Check ports as well
if [ "$HTTP_RUNNING" = false ]; then
    PORT_PID=$(lsof -ti:3005)
    if [ ! -z "$PORT_PID" ]; then
        HTTP_RUNNING=true
        echo -e "${YELLOW}Port 3005 is in use (PID: $PORT_PID). Assuming HTTP server is running.${NC}"
    fi
fi

if [ "$API_RUNNING" = false ]; then
    PORT_PID=$(lsof -ti:3006)
    if [ ! -z "$PORT_PID" ]; then
        API_RUNNING=true
        echo -e "${YELLOW}Port 3006 is in use (PID: $PORT_PID). Assuming API server is running.${NC}"
    fi
fi

# Start servers if needed
if [ "$HTTP_RUNNING" = false ] || [ "$API_RUNNING" = false ]; then
    echo -e "${BLUE}Starting servers...${NC}"
    ./start_servers.sh
fi

# Function to open URL in the default browser
open_browser() {
    local url=$1
    
    # Try to detect the OS
    case "$(uname)" in
        "Darwin")
            # macOS
            open "$url"
            ;;
        "MINGW"*|"MSYS"*|"CYGWIN"*)
            # Windows
            start "$url"
            ;;
        *)
            # Linux or other Unix-like systems
            if command -v xdg-open > /dev/null; then
                xdg-open "$url"
            elif command -v gnome-open > /dev/null; then
                gnome-open "$url"
            elif command -v gio > /dev/null; then
                gio open "$url"
            else
                echo -e "${YELLOW}Could not detect a way to open the browser automatically.${NC}"
                echo -e "${BLUE}Please open this URL manually: $url${NC}"
                return 1
            fi
            ;;
    esac
    
    return $?
}

# Open application in the default browser
echo -e "${BLUE}Opening application in browser...${NC}"
open_browser "http://localhost:3005/index.html"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Application launched successfully!${NC}"
    echo -e "${BLUE}Frontend URL:${NC} http://localhost:3005"
    echo -e "${BLUE}API URL:${NC} http://localhost:3006"
    echo -e "${BLUE}API documentation:${NC} http://localhost:3006/docs"
    echo -e "${BLUE}Use './stop_servers.sh' to stop the servers when you're done${NC}"
else
    echo -e "${RED}Failed to open browser automatically.${NC}"
    echo -e "${BLUE}Please manually navigate to: http://localhost:3005/index.html${NC}"
fi 