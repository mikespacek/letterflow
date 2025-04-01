#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Stopping Real Estate Letter Generator API server...${NC}"

# Check for PID file
if [ -f logs/api_server.pid ]; then
    # Read PID from file
    API_PID=$(cat logs/api_server.pid)
    
    # Stop API server
    if ps -p $API_PID > /dev/null; then
        echo -e "${YELLOW}Stopping API server (PID: $API_PID)...${NC}"
        kill -9 $API_PID
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}API server stopped successfully.${NC}"
        else
            echo -e "${RED}Failed to stop API server.${NC}"
        fi
    else
        echo -e "${YELLOW}API server is not running.${NC}"
    fi
    
    # Remove PID file
    rm -f logs/api_server.pid
else
    # Check for any process using the port
    echo -e "${YELLOW}PID file not found. Checking for process on port 3006...${NC}"
    
    API_PID=$(lsof -ti:3006)
    
    if [ ! -z "$API_PID" ]; then
        echo -e "${YELLOW}Found API server on port 3006 (PID: $API_PID). Stopping...${NC}"
        kill -9 $API_PID
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}API server stopped successfully.${NC}"
        else
            echo -e "${RED}Failed to stop API server.${NC}"
        fi
    else
        echo -e "${YELLOW}No API server found on port 3006.${NC}"
    fi
fi

echo -e "${GREEN}API server has been stopped.${NC}" 