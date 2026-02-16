#!/bin/bash

echo "=========================================="
echo "  JHL Complete Fix Script"
echo "=========================================="
echo ""

APP_DIR="/var/www/jhl"
VPS_IP=$(curl -4 -s ifconfig.me)

echo "Step 1: Pulling latest code..."
cd $APP_DIR
git pull origin main

echo ""
echo "Step 2: Checking/fixing logo file..."
if [ -f "$APP_DIR/K (4).svg" ]; then
    echo "   Renaming 'K (4).svg' to 'logo.svg'..."
    mv "$APP_DIR/K (4).svg" "$APP_DIR/logo.svg"
fi

if [ -f "$APP_DIR/logo.svg" ]; then
    echo "   ✅ logo.svg exists"
else
    echo "   ❌ ERROR: logo.svg not found!"
    exit 1
fi

echo ""
echo "Step 3: Configuring frontend .env with IP..."
cat > $APP_DIR/.env <<EOF
VITE_API_URL=http://${VPS_IP}:5000/api
EOF
echo "   Frontend .env updated to: http://${VPS_IP}:5000/api"

echo ""
echo "Step 4: Installing frontend dependencies..."
cd $APP_DIR
npm install

echo ""
echo "Step 5: Building frontend..."
npm run build

echo ""
echo "Step 6: Installing backend dependencies..."
cd $APP_DIR/backend
npm install

echo ""
echo "Step 7: Building backend..."
npm run build

echo ""
echo "Step 8: Migrating database..."
npx prisma generate
npx prisma migrate deploy

echo ""
echo "Step 9: Restarting backend with PM2..."
cd $APP_DIR
pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs

echo ""
echo "Step 10: Checking backend status..."
sleep 2
pm2 status

echo ""
echo "=========================================="
echo "  Deployment Complete!"
echo "=========================================="
echo ""
echo "Test your site at: http://${VPS_IP}"
echo ""
echo "If login still doesn't work, check backend logs:"
echo "  pm2 logs jhl-backend"
echo "=========================================="
