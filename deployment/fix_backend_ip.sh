#!/bin/bash

# Quick fix for backend API connection before DNS propagates
# This updates the frontend .env to use the IP address instead of domain

# Get VPS IP
VPS_IP=$(curl -4 -s ifconfig.me)

echo "Updating frontend .env to use IP: $VPS_IP"

# Update frontend .env
cat > /var/www/jhl/.env <<EOF
VITE_API_URL=http://${VPS_IP}:5000/api
EOF

echo "Frontend .env updated!"
echo "Now run: cd /var/www/jhl && ./deployment/deploy.sh"
