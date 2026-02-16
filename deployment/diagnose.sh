#!/bin/bash

echo "=========================================="
echo "  JHL VPS Diagnostic Report"
echo "=========================================="
echo ""

# 1. Check if logo file exists
echo "1. Checking logo file..."
if [ -f "/var/www/jhl/logo.svg" ]; then
    echo "   ✅ logo.svg exists"
else
    echo "   ❌ logo.svg NOT FOUND"
    if [ -f "/var/www/jhl/K (4).svg" ]; then
        echo "   ⚠️  Old file 'K (4).svg' still exists - needs renaming"
    fi
fi
echo ""

# 2. Check frontend .env
echo "2. Checking frontend .env..."
if [ -f "/var/www/jhl/.env" ]; then
    echo "   Content:"
    cat /var/www/jhl/.env
else
    echo "   ❌ .env NOT FOUND"
fi
echo ""

# 3. Check backend status
echo "3. Checking backend process..."
pm2 status
echo ""

# 4. Check if backend is responding
echo "4. Testing backend API..."
curl -s http://localhost:5000/api/auth/demo-login > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Backend responding on port 5000"
else
    echo "   ❌ Backend NOT responding"
fi
echo ""

# 5. Check nginx status
echo "5. Checking Nginx..."
sudo systemctl status nginx --no-pager | head -3
echo ""

echo "=========================================="
echo "  Diagnostic Complete"
echo "=========================================="
