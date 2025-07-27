#!/usr/bin/env node

/**
 * Quick Health Check - Essential validations
 * Fast verification of core project health
 */

import { performance } from 'perf_hooks';
import { readFileSync, existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const startTime = performance.now();

console.log('🏥 Quick Health Check Starting...');

async function quickHealthCheck() {
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
  };

  // 1. Package.json exists and valid
  try {
    if (existsSync('./package.json')) {
      const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
      if (pkg.name && pkg.scripts && pkg.scripts.build) {
        results.passed++;
        results.details.push('✅ package.json valid');
      } else {
        results.failed++;
        results.details.push('❌ package.json missing required fields');
      }
    } else {
      results.failed++;
      results.details.push('❌ package.json not found');
    }
  } catch (e) {
    results.failed++;
    results.details.push('❌ package.json invalid JSON');
  }

  // 2. Astro config exists
  if (existsSync('./astro.config.mjs') || existsSync('./astro.config.js')) {
    results.passed++;
    results.details.push('✅ Astro config found');
  } else {
    results.failed++;
    results.details.push('❌ Astro config missing');
  }

  // 3. Source directory structure
  if (existsSync('./src/pages') && existsSync('./src/components')) {
    results.passed++;
    results.details.push('✅ Core directories exist');
  } else {
    results.failed++;
    results.details.push('❌ Missing src/pages or src/components');
  }

  // 4. Quick build test (timeout after 30s)
  try {
    console.log('🔄 Testing build process...');
    const { stdout } = await execAsync('npm run build', { timeout: 30000 });
    if (stdout) {
      results.passed++;
      results.details.push('✅ Build completed successfully');
    }
  } catch (error) {
    if (error.code === 'TIMEOUT') {
      results.warnings++;
      results.details.push('⚠️ Build timeout (>30s)');
    } else {
      results.failed++;
      results.details.push('❌ Build failed');
    }
  }

  // Summary
  const totalTime = Math.round(performance.now() - startTime);
  console.log('\n🏥 Health Check Results');
  console.log('========================');
  console.log(`⏱️  Duration: ${totalTime}ms`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  
  console.log('\nDetails:');
  results.details.forEach(detail => console.log(`  ${detail}`));
  
  const status = results.failed === 0 ? 'HEALTHY' : 'ISSUES DETECTED';
  const emoji = results.failed === 0 ? '🟢' : '🔴';
  console.log(`\n${emoji} Overall Status: ${status}`);
  
  if (results.failed > 0) {
    console.log('\n💡 Run "npm run diagnostics" for detailed analysis');
  }

  return results.failed === 0;
}

quickHealthCheck().catch(error => {
  console.error('🔴 Health check failed:', error.message);
  process.exit(1);
});
