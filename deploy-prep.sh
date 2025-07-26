#!/bin/bash

# GitHub Pages Deployment Helper Script
# This script handles common deployment issues

echo "🚀 Starting GitHub Pages deployment preparation..."

# Check if package-lock.json is in sync
echo "📦 Checking package lock synchronization..."
if npm ci --dry-run > /dev/null 2>&1; then
    echo "✅ Package lock is synchronized"
    npm ci
else
    echo "⚠️  Package lock out of sync, regenerating..."
    rm -f package-lock.json
    npm install
fi

# Run build
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output is in ./dist/"
    
    # Check dist folder size
    DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
    echo "📊 Build size: $DIST_SIZE"
    
    echo "🎉 Ready for GitHub Pages deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi
