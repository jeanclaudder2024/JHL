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
sudo apt-get install -y curl git unzip ufw build-essential

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
sudo ufw --force enable

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

echo "Setup Database..."
echo "Please log in to MySQL via 'sudo mysql' and run:"
echo "CREATE DATABASE jhl_db;"
echo "CREATE USER 'jhl_user'@'localhost' IDENTIFIED BY 'your_password';"
echo "GRANT ALL PRIVILEGES ON jhl_db.* TO 'jhl_user'@'localhost';"
echo "FLUSH PRIVILEGES;"
echo "EXIT;"

echo "Environment Configuration:"
echo "Navigate to generic .env files and update them:"
echo "cp $APP_DIR/.env.example $APP_DIR/.env"
echo "cp $APP_DIR/backend/.env.example $APP_DIR/backend/.env"
echo "Make sure to update DATABASE_URL in backend/.env with the credentials you just created."

echo "After configuring .env files, run ./deployment/deploy.sh"
