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


