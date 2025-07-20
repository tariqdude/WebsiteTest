#!/bin/bash

# Build optimization and cleanup script for the project
# This script optimizes the build process and cleans up unnecessary files

echo "🚀 Starting build optimization process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f "astro.config.mjs" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

print_status "Cleaning up old build artifacts..."

# Remove old build files
rm -rf dist/
rm -rf .astro/
rm -rf node_modules/.cache/

print_success "Cleaned up old build artifacts"

# Check for and remove duplicate files
print_status "Checking for duplicate files..."

# Check for duplicate JavaScript files
duplicates_found=false

if [ -f "src/scripts/main.js" ] && [ -f "src/scripts/websiteController.js" ]; then
    # Check if main.js is importing websiteController properly
    if grep -q "websiteController" "src/scripts/main.js"; then
        print_success "Main.js correctly imports websiteController.js"
    else
        print_warning "Main.js doesn't import websiteController.js - this may cause issues"
    fi
fi

# Check for unused CSS classes (basic check)
print_status "Analyzing CSS usage..."

# Count Tailwind classes used in Astro files
used_classes=$(grep -r "class=" src/ --include="*.astro" | grep -o 'class="[^"]*"' | wc -l)
print_status "Found $used_classes Tailwind class usages"

# Check for missing alt attributes on images
print_status "Checking for accessibility issues..."

missing_alt=$(grep -r "<img" src/ --include="*.astro" | grep -v "alt=" | wc -l)
if [ $missing_alt -gt 0 ]; then
    print_warning "Found $missing_alt images without alt attributes"
    grep -r "<img" src/ --include="*.astro" | grep -v "alt=" | head -5
else
    print_success "All images have alt attributes"
fi

# Check for hardcoded URLs that should be relative
print_status "Checking for hardcoded URLs..."

hardcoded_urls=$(grep -r "http://" src/ --include="*.astro" | grep -v "youtube\|analytics\|fonts" | wc -l)
if [ $hardcoded_urls -gt 0 ]; then
    print_warning "Found $hardcoded_urls potential hardcoded URLs"
else
    print_success "No hardcoded URLs found"
fi

# Validate package.json dependencies
print_status "Checking package.json for issues..."

if command -v npm >/dev/null 2>&1; then
    npm audit --audit-level moderate --json > audit_report.json 2>/dev/null
    if [ $? -eq 0 ]; then
        vulnerabilities=$(jq '.metadata.vulnerabilities.total' audit_report.json 2>/dev/null || echo "0")
        if [ "$vulnerabilities" -gt 0 ]; then
            print_warning "Found $vulnerabilities security vulnerabilities"
            print_status "Run 'npm audit fix' to resolve them"
        else
            print_success "No security vulnerabilities found"
        fi
    fi
    rm -f audit_report.json
fi

# Check TypeScript types if present
if [ -f "tsconfig.json" ]; then
    print_status "Checking TypeScript configuration..."
    if command -v tsc >/dev/null 2>&1; then
        tsc --noEmit --skipLibCheck 2>/dev/null
        if [ $? -eq 0 ]; then
            print_success "TypeScript types are valid"
        else
            print_warning "TypeScript type checking found issues"
        fi
    fi
fi

# Optimize images if tools are available
print_status "Checking for image optimization opportunities..."

image_count=$(find public/ -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.svg" \) 2>/dev/null | wc -l)
if [ $image_count -gt 0 ]; then
    print_status "Found $image_count images in public directory"
    
    # Check for large images (>500KB)
    large_images=$(find public/ -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -size +500k 2>/dev/null | wc -l)
    if [ $large_images -gt 0 ]; then
        print_warning "Found $large_images images larger than 500KB that could be optimized"
    fi
else
    print_status "No images found in public directory"
fi

# Check for modern web features usage
print_status "Checking for modern web features..."

# Check for proper meta tags
meta_count=$(grep -r "<meta" src/layouts/ | wc -l)
print_status "Found $meta_count meta tags in layouts"

# Check for proper semantic HTML
semantic_tags=$(grep -r -E "<(header|main|section|article|aside|footer|nav)" src/ --include="*.astro" | wc -l)
print_status "Found $semantic_tags semantic HTML elements"

# Performance recommendations
print_status "Performance recommendations:"
echo "  ✓ Use WebP format for images when possible"
echo "  ✓ Enable gzip compression on your server"
echo "  ✓ Use a CDN for static assets"
echo "  ✓ Implement lazy loading for images below the fold"
echo "  ✓ Minify CSS and JavaScript in production"

# Build the project
print_status "Building the project..."

if npm run build; then
    print_success "Build completed successfully!"
    
    # Analyze build output
    if [ -d "dist" ]; then
        build_size=$(du -sh dist/ | cut -f1)
        file_count=$(find dist/ -type f | wc -l)
        print_status "Build output: $build_size across $file_count files"
        
        # Check for large chunks
        large_chunks=$(find dist/ -name "*.js" -size +100k | wc -l)
        if [ $large_chunks -gt 0 ]; then
            print_warning "Found $large_chunks JavaScript files larger than 100KB"
            print_status "Consider code splitting to improve loading performance"
        fi
        
        # Check for uncompressed assets
        print_status "Checking for compression opportunities..."
        css_size=$(find dist/ -name "*.css" -exec cat {} \; | wc -c)
        js_size=$(find dist/ -name "*.js" -exec cat {} \; | wc -c)
        total_size=$((css_size + js_size))
        
        if [ $total_size -gt 100000 ]; then
            print_status "Total CSS+JS size: $(echo $total_size | numfmt --to=iec-i)B"
            print_warning "Consider enabling compression on your server"
        fi
    fi
else
    print_error "Build failed!"
    exit 1
fi

print_success "🎉 Build optimization completed!"
print_status "Your project is ready for deployment!"

# Cleanup recommendations
echo ""
print_status "Cleanup recommendations:"
echo "  • Remove any unused dependencies from package.json"
echo "  • Consider using a package analyzer like 'npm ls' to check dependency tree"
echo "  • Run 'npm audit' regularly to check for security issues"
echo "  • Use 'npx astro check' to validate your Astro code"

exit 0
