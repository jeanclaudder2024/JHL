#!/bin/bash

# deploy.sh
# Run this script to deploy updates

set -e

APP_DIR="/var/www/jhl"

echo "Navigating to app directory..."
cd $APP_DIR

echo "Pulling latest code..."
git pull origin main

echo "Installing Backend Dependencies..."
cd backend
npm install

echo "Generating Prisma Client..."
npx prisma generate

echo "Migrating Database..."
npx prisma migrate deploy

echo "Building Backend..."
npm run build

echo "Restarting Backend with PM2..."
cd ..
pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs

echo "Installing Frontend Dependencies..."
npm install

echo "Building Frontend..."
npm run build

echo "Deployment Complete!"
echo "If this is your first time, run: sudo certbot --nginx -d justhumanlife.ch -d www.justhumanlife.ch"
