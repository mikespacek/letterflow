#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Real Estate Letter Generator servers...${NC}"

# Create logs directory if it doesn't exist
mkdir -p logs

# Kill any existing Python servers using the same ports
echo "Checking for existing server processes..."
HTTP_PID=$(lsof -ti:3005)
API_PID=$(lsof -ti:3006)

if [ ! -z "$HTTP_PID" ]; then
    echo -e "${RED}Killing existing HTTP server process: $HTTP_PID${NC}"
    kill -9 $HTTP_PID
    # Wait for the process to be killed
    sleep 1
fi

if [ ! -z "$API_PID" ]; then
    echo -e "${RED}Killing existing API server process: $API_PID${NC}"
    kill -9 $API_PID
    # Wait for the process to be killed
    sleep 1
fi

# Start HTTP server for static files on port 3005
echo -e "${BLUE}Starting HTTP server for static files on port 3005...${NC}"
python3 -m http.server 3005 --directory . > logs/http_server.log 2>&1 &
HTTP_PID=$!

# Wait a moment to make sure server started
sleep 2

# Check if HTTP server started successfully
if ps -p $HTTP_PID > /dev/null; then
    echo -e "${GREEN}HTTP server started successfully with PID: $HTTP_PID${NC}"
else
    echo -e "${RED}Failed to start HTTP server.${NC}"
    cat logs/http_server.log
    exit 1
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

# Write PIDs to file for the stop script to use
echo $HTTP_PID > logs/http_server.pid
echo $API_PID > logs/api_server.pid

echo -e "${GREEN}Servers started successfully!${NC}"
echo -e "${BLUE}Static server:${NC} http://localhost:3005"
echo -e "${BLUE}API server:${NC} http://localhost:3006"
echo -e "${BLUE}API documentation:${NC} http://localhost:3006/docs"
echo -e "${BLUE}Use './stop_servers.sh' to stop the servers${NC}" 