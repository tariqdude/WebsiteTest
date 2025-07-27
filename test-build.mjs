#!/usr/bin/env node

/**
 * 🧪 Simple Build Test for GitHub Pages
 * Fast validation of build readiness
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

console.log('🧪 Testing GitHub Pages Build');
console.log('='.repeat(40));

try {
  // Test 1: Dependencies
  console.log('📦 Checking dependencies...');
  if (!existsSync('node_modules')) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
  console.log('✅ Dependencies ready');

  // Test 2: Clean build
  console.log('\n🧹 Cleaning previous build...');
  try {
    execSync('rm -rf dist .astro', { stdio: 'ignore' });
  } catch (e) {
    // Ignore errors
  }
  console.log('✅ Clean completed');

  // Test 3: Build test
  console.log('\n🔨 Testing build...');
  execSync('npx astro build --site https://tariqdude.github.io --base /WebsiteTest', {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Test 4: Validate output
  console.log('\n🔍 Validating build output...');
  
  if (!existsSync('dist')) {
    throw new Error('No dist directory created');
  }
  
  if (!existsSync('dist/index.html')) {
    throw new Error('No index.html created');
  }

  const indexContent = readFileSync('dist/index.html', 'utf8');
  if (!indexContent.includes('/WebsiteTest/')) {
    console.log('⚠️  Warning: Base path may not be correctly applied');
  } else {
    console.log('✅ Base path correctly applied');
  }

  if (existsSync('dist/showcase/index.html')) {
    console.log('✅ Showcase page built successfully');
  } else {
    console.log('⚠️  Warning: Showcase page not found');
  }

  console.log('\n🎉 BUILD SUCCESS!');
  console.log('✅ Your project is ready for GitHub Pages deployment');
  console.log('\n📝 Next steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "Ready for deployment"');
  console.log('3. git push origin main');
  console.log('4. Enable GitHub Pages in repository settings');
  console.log('5. Your site will be available at: https://tariqdude.github.io/WebsiteTest/');

} catch (error) {
  console.error('\n❌ BUILD FAILED');
  console.error('Error:', error.message);
  console.log('\n💡 Troubleshooting tips:');
  console.log('- Check that all components exist');
  console.log('- Verify TypeScript errors: npx tsc --noEmit');
  console.log('- Check Astro config: npx astro check');
  console.log('- Try a simpler build: npx astro build');
  process.exit(1);
}
