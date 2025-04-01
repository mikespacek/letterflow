#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Stopping Real Estate Letter Generator servers...${NC}"

# Check for PID files
if [ -f logs/http_server.pid ] && [ -f logs/api_server.pid ]; then
    # Read PIDs from files
    HTTP_PID=$(cat logs/http_server.pid)
    API_PID=$(cat logs/api_server.pid)
    
    # Stop HTTP server
    if ps -p $HTTP_PID > /dev/null; then
        echo -e "${YELLOW}Stopping HTTP server (PID: $HTTP_PID)...${NC}"
        kill -9 $HTTP_PID
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}HTTP server stopped successfully.${NC}"
        else
            echo -e "${RED}Failed to stop HTTP server.${NC}"
        fi
    else
        echo -e "${YELLOW}HTTP server is not running.${NC}"
    fi
    
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
    
    # Remove PID files
    rm -f logs/http_server.pid
    rm -f logs/api_server.pid
else
    # Check for any processes using the ports
    echo -e "${YELLOW}PID files not found. Checking for processes on ports 3005 and 3006...${NC}"
    
    HTTP_PID=$(lsof -ti:3005)
    API_PID=$(lsof -ti:3006)
    
    if [ ! -z "$HTTP_PID" ]; then
        echo -e "${YELLOW}Found HTTP server on port 3005 (PID: $HTTP_PID). Stopping...${NC}"
        kill -9 $HTTP_PID
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}HTTP server stopped successfully.${NC}"
        else
            echo -e "${RED}Failed to stop HTTP server.${NC}"
        fi
    else
        echo -e "${YELLOW}No HTTP server found on port 3005.${NC}"
    fi
    
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

echo -e "${GREEN}All servers have been stopped.${NC}" 