#!/bin/bash

# setup_vps.sh
# Run this script on your fresh VPS as root or with sudo

set -e

DOMAIN="justhumanlife.ch"
APP_DIR="/var/www/jhl"
REPO_URL="https://github.com/jeanclaudder2024/JHL.git"

echo "Updating system..."
sudo apt-get update && sudo apt-get upgrade -y

echo "Installing essential tools..."
sudo apt-get install -y curl git unzip ufw build-essential openssl

echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "Installing Nginx..."
sudo apt-get install -y nginx

echo "Installing MySQL Server..."
sudo apt-get install -y mysql-server

echo "Installing Certbot (for SSL)..."
sudo apt-get install -y certbot python3-certbot-nginx

echo "Installing PM2 globally..."
sudo npm install -g pm2

echo "Configuring Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
# Enable firewall non-interactively
echo "y" | sudo ufw enable

echo "Setting up Application Directory..."
if [ -d "$APP_DIR" ]; then
    echo "Directory $APP_DIR already exists."
else
    # Clone the repo initially to set up structure
    sudo git clone $REPO_URL $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
fi

echo "Setting up Nginx..."
sudo cp $APP_DIR/deployment/nginx.conf /etc/nginx/sites-available/jhl
sudo ln -sf /etc/nginx/sites-available/jhl /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "Automating Database Setup..."
DB_NAME="jhl_db"
DB_USER="jhl_user"
# Generate a secure random password
DB_PASS=$(openssl rand -base64 24)

# Create Database and User
sudo mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
sudo mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo "Database created with user: ${DB_USER}"

echo "Configuring Environment Variables..."

# Backend .env
JWT_SECRET=$(openssl rand -hex 32)
BACKEND_ENV="$APP_DIR/backend/.env"

echo "Creating backend .env at $BACKEND_ENV"
cat > $BACKEND_ENV <<EOF
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@localhost:3306/${DB_NAME}"
JWT_SECRET="${JWT_SECRET}"
PORT=5000
CORS_ORIGIN="https://${DOMAIN}"
EOF

# Frontend .env (Project Root)
FRONTEND_ENV="$APP_DIR/.env"
echo "Creating frontend .env at $FRONTEND_ENV"
cat > $FRONTEND_ENV <<EOF
VITE_API_URL=https://${DOMAIN}/api
EOF

echo "Environment setup complete."

echo "========================================================"
echo "  SETUP COMPLETE!"
echo "========================================================"
echo "Database credentials have been automatically configured in:"
echo "  - $BACKEND_ENV"
echo ""
echo "Now run the deployment script to build and launch the app:"
echo "  $APP_DIR/deployment/deploy.sh"
echo "========================================================"
