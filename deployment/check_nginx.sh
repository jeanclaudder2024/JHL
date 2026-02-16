#!/bin/bash

echo "=========================================="
echo "  Checking Nginx and File Serving"
echo "=========================================="
echo ""

# Check if dist folder exists and when it was built
echo "1. Checking dist folder..."
if [ -d "/var/www/jhl/dist" ]; then
    echo "   ✅ dist folder exists"
    echo "   Last modified:"
    ls -lh /var/www/jhl/dist/index.html
else
    echo "   ❌ dist folder NOT FOUND"
fi
echo ""

# Check logo in dist
echo "2. Checking logo in project root..."
if [ -f "/var/www/jhl/logo.svg" ]; then
    echo "   ✅ /var/www/jhl/logo.svg exists"
    ls -lh /var/www/jhl/logo.svg
else
    echo "   ❌ logo.svg NOT in project root"
fi
echo ""

# Check Nginx config
echo "3. Checking Nginx configuration..."
if [ -f "/etc/nginx/sites-available/jhl" ]; then
    echo "   Current root directory in nginx config:"
    grep "root" /etc/nginx/sites-available/jhl | head -1
else
    echo "   ❌ Nginx config not found"
fi
echo ""

# Test what Nginx is actually serving
echo "4. Testing what Nginx serves..."
curl -I http://localhost 2>/dev/null | head -5
echo ""

echo "5. Checking if logo is accessible via Nginx..."
curl -I http://localhost/logo.svg 2>/dev/null | head -3
echo ""

echo "=========================================="
echo "  Diagnostics Complete"
echo "=========================================="
echo ""
echo "SOLUTION:"
echo "If dist/index.html is old, the build didn't copy to dist properly."
echo "If Nginx root is wrong, Nginx isn't serving from the right place."
