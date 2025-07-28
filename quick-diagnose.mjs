#!/usr/bin/env node
/**
 * Quick Error Diagnostic Tool
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔍 Running Quick Error Diagnosis...\n');

try {
  // 1. Check if critical files exist
  const criticalFiles = [
    'package.json',
    'astro.config.mjs', 
    'src/pages/index.astro',
    'src/pages/showcase.astro',
    'tsconfig.json'
  ];
  
  console.log('📁 Checking critical files:');
  criticalFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  });
  
  // 2. Check node version
  console.log('\n🟦 Node.js version:');
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`  ${nodeVersion}`);
  
  // 3. Check npm version
  console.log('\n📦 npm version:');
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`  ${npmVersion}`);
  
  // 4. Quick package.json syntax check
  console.log('\n📋 package.json syntax:');
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('  ✅ Valid JSON');
    console.log(`  📝 Scripts available: ${Object.keys(pkg.scripts || {}).length}`);
  } catch (error) {
    console.log(`  ❌ Invalid JSON: ${error.message}`);
  }
  
  // 5. Quick TypeScript check (limited)
  console.log('\n⚡ Quick TypeScript check:');
  try {
    execSync('npx tsc --version', { encoding: 'utf8', timeout: 5000 });
    console.log('  ✅ TypeScript available');
  } catch (error) {
    console.log('  ❌ TypeScript issue');
  }
  
  console.log('\n✨ Diagnosis complete!');
  
} catch (error) {
  console.error('❌ Diagnosis failed:', error.message);
}
