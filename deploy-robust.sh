#!/bin/bash

# Robust Deployment Script
# Handles common build environment issues

set -e  # Exit on any error

echo "🚀 Starting robust deployment process..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to clean and reinstall dependencies
clean_install() {
    echo "🧹 Cleaning dependencies..."
    rm -rf node_modules package-lock.json .astro dist
    npm cache clean --force
    echo "📦 Installing fresh dependencies..."
    npm install
}

# Function to build with retries
build_with_retry() {
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "🏗️  Build attempt $attempt of $max_attempts..."
        
        if npm run build:gh-pages; then
            echo "✅ Build successful on attempt $attempt"
            return 0
        else
            echo "❌ Build failed on attempt $attempt"
            
            if [ $attempt -lt $max_attempts ]; then
                echo "🔄 Retrying with clean install..."
                clean_install
            fi
            
            ((attempt++))
        fi
    done
    
    echo "🔴 Build failed after $max_attempts attempts"
    return 1
}

# Check environment
echo "🔍 Checking environment..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Platform: $(uname -a)"

# Check if we're in WSL and handle potential issues
if grep -q Microsoft /proc/version 2>/dev/null; then
    echo "🐧 WSL environment detected"
    
    # Check for common WSL issues
    if [ ! -f .npmrc ]; then
        echo "📝 Creating .npmrc for WSL compatibility..."
        cat > .npmrc << EOF
fund=false
audit-level=moderate
optional=true
prefer-offline=false
save-exact=false
EOF
    fi
fi

# Run health check first
if command_exists node && [ -f package.json ]; then
    echo "🏥 Running health check..."
    if npm run health-check 2>/dev/null; then
        echo "✅ Health check passed"
    else
        echo "⚠️  Health check failed, proceeding with caution..."
    fi
else
    echo "❌ Project environment not ready"
    exit 1
fi

# Attempt build with retry logic
if build_with_retry; then
    echo "🎉 Deployment preparation successful!"
    
    # Verify build output
    if [ -d "./dist" ] && [ -f "./dist/index.html" ]; then
        echo "✅ Build artifacts verified"
        echo "📁 Build size: $(du -sh dist)"
        
        # Check for specific files
        if [ -f "./dist/showcase/index.html" ]; then
            echo "✅ Showcase page generated"
        else
            echo "⚠️  Showcase page not found"
        fi
        
        echo ""
        echo "🚀 Ready for GitHub Pages deployment!"
        echo "📍 Site will be available at: https://tariqdude.github.io/WebsiteTest/"
        echo ""
        echo "Next steps:"
        echo "1. git add ."
        echo "2. git commit -m 'Deploy: Ready for GitHub Pages'"
        echo "3. git push origin main"
        
    else
        echo "❌ Build verification failed"
        exit 1
    fi
else
    echo "🔴 Deployment preparation failed"
    exit 1
fi
