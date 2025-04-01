#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Real Estate Letter Generator API server...${NC}"

# Create logs directory if it doesn't exist
mkdir -p logs

# Kill any existing API server using the same port
echo "Checking for existing server processes..."
API_PID=$(lsof -ti:3006)

if [ ! -z "$API_PID" ]; then
    echo -e "${RED}Killing existing API server process: $API_PID${NC}"
    kill -9 $API_PID
    # Wait for the process to be killed
    sleep 1
fi

# Start FastAPI server on port 3006
echo -e "${BLUE}Starting FastAPI server on port 3006...${NC}"
python3 main.py > logs/api_server.log 2>&1 &
API_PID=$!

# Wait a moment to make sure server started
sleep 3

# Check if API server started successfully
if ps -p $API_PID > /dev/null; then
    echo -e "${GREEN}FastAPI server started successfully with PID: $API_PID${NC}"
else
    echo -e "${RED}Failed to start FastAPI server.${NC}"
    cat logs/api_server.log
    exit 1
fi

# Write PID to file for the stop script to use
echo $API_PID > logs/api_server.pid

echo -e "${GREEN}API server started successfully!${NC}"
echo -e "${BLUE}API server:${NC} http://localhost:3006"
echo -e "${BLUE}API documentation:${NC} http://localhost:3006/docs"
echo -e "${BLUE}Use './stop_api.sh' to stop the server${NC}" 