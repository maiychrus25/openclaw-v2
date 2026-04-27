#!/bin/bash

# Configuration
CONFIG_FILE="openclaw-v2/openclaw.json"
BACKUP_FILE="${CONFIG_FILE}.bak"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    CONFIG_FILE="openclaw.json"
    if [ ! -f "$CONFIG_FILE" ]; then
        echo -e "\033[0;31mError: openclaw.json not found.\033[0m"
        exit 1
    fi
    BACKUP_FILE="${CONFIG_FILE}.bak"
fi

# Colors for professional look
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================${NC}"
echo -e "${BOLD}${GREEN}          OPENCLAW V2 AUTOMATION SETUP                ${NC}"
echo -e "${CYAN}======================================================${NC}"
echo -e "${BLUE}  Author:  ${BOLD}MAIYCHRUS25${NC}"
echo -e "${BLUE}  System:  ${BOLD}Variable Placeholder Mode${NC}"
echo -e "${CYAN}------------------------------------------------------${NC}"

# User Inputs
read -p "1. Enter AHVHOLDING_API_KEY: " AHV_KEY
read -p "2. Enter COMMON_BOT_TOKEN: " BOT_TOKEN
read -p "3. Enter GOOGLE_API_KEY (optional): " GOOGLE_KEY
read -p "4. Enter CONFLUENCE_TOKEN (optional): " CONF_TOKEN
read -p "5. Enter CONFLUENCE_EMAIL (optional): " CONF_EMAIL
read -p "6. Enter CONFLUENCE_URL (optional): " CONF_URL
read -p "7. Enter GITLAB_URL (optional, default: https://gitlab.com): " GITLAB_URL
read -p "8. Enter GITLAB_TOKEN (optional): " GITLAB_TOKEN
read -p "9. Enter STITCH_API_KEY (optional): " STITCH_KEY

if [ -z "$AHV_KEY" ] || [ -z "$BOT_TOKEN" ]; then
    echo -e "${RED}Error: AHV Key and Bot Token are required.${NC}"
    exit 1
fi

# Create backup
cp "$CONFIG_FILE" "$BACKUP_FILE"
echo -e "${BLUE}--- Backup created at $BACKUP_FILE${NC}"

# Export variables
export AHV_KEY
export BOT_TOKEN
export GOOGLE_KEY
export CONF_TOKEN
export CONF_EMAIL
export CONF_URL
export GITLAB_URL
export GITLAB_TOKEN
export STITCH_KEY
export CONFIG_FILE

# Python logic
python -c "
import json
import os
import sys

config_file = os.environ.get('CONFIG_FILE').strip()
ahv_key = os.environ.get('AHV_KEY').strip()
bot_token = os.environ.get('BOT_TOKEN').strip()
google_key = (os.environ.get('GOOGLE_KEY') or '').strip()
conf_token = (os.environ.get('CONF_TOKEN') or '').strip()
conf_email = (os.environ.get('CONF_EMAIL') or '').strip()
conf_url = (os.environ.get('CONF_URL') or '').strip()
gitlab_url = (os.environ.get('GITLAB_URL') or '').strip()
gitlab_token = (os.environ.get('GITLAB_TOKEN') or '').strip()
stitch_key = (os.environ.get('STITCH_KEY') or '').strip()

try:
    with open(config_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'env' not in data: data['env'] = {}
    
    # Update Environment Section
    data['env']['AHVHOLDING_API_KEY'] = ahv_key
    data['env']['BOT_TOKEN'] = bot_token
    
    if google_key: data['env']['GOOGLE_API_KEY'] = google_key
    if conf_token: data['env']['CONFLUENCE_TOKEN'] = conf_token
    if conf_email: data['env']['CONFLUENCE_EMAIL'] = conf_email
    if conf_url: data['env']['CONFLUENCE_URL'] = conf_url
    if gitlab_url: data['env']['GITLAB_URL'] = gitlab_url
    if gitlab_token: data['env']['GITLAB_TOKEN'] = gitlab_token
    if stitch_key: data['env']['STITCH_API_KEY'] = stitch_key

    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f'--- Updated env variables in {config_file}')
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
"

# Dependency Installation
echo -e "${CYAN}------------------------------------------------------${NC}"
read -p "Do you want to install Node.js dependencies? (y/n): " INSTALL_DEPS

if [[ "$INSTALL_DEPS" == "y" || "$INSTALL_DEPS" == "Y" ]]; then
    echo -e "${BLUE}Searching for package.json and installing...${NC}"
    # Identify project directory
    PROJECT_DIR=$(dirname "$CONFIG_FILE")
    
    # Find all package.json files and install
    # Using a simple loop to be safe with spaces and common bash tools
    find "$PROJECT_DIR" -name "package.json" -not -path "*/node_modules/*" | while read pkg; do
        dir=$(dirname "$pkg")
        echo -e "${GREEN}  -> Installing dependencies in: $dir${NC}"
        (cd "$dir" && npm install --no-audit --no-fund)
    done
fi

if [ $? -eq 0 ]; then
    echo -e "${CYAN}------------------------------------------------------${NC}"
    echo -e "${BOLD}${GREEN}       SETUP COMPLETED SUCCESSFULLY!                  ${NC}"
    echo -e "${BLUE}  Configuration is now optimized and ready.           ${NC}"
    echo -e "${CYAN}======================================================${NC}"
else
    echo -e "${BOLD}${RED}Error: Setup failed during configuration or installation.${NC}"
    exit 1
fi
