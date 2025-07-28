#!/usr/bin/env node
/**
 * Dependency Installer and Validation Script
 * Ensures all required dependencies are installed for deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const requiredDependencies = {
  dependencies: {
    '@astrojs/check': '^0.9.4',
    '@astrojs/mdx': '^4.3.1',
    '@astrojs/preact': '^4.1.0',
    '@astrojs/react': '^4.3.0',
    '@astrojs/rss': '^4.0.12',
    '@astrojs/sitemap': '^4.0.1',
    '@astrojs/solid-js': '^5.0.0',
    '@astrojs/svelte': '^6.0.1',
    '@astrojs/tailwind': '^6.0.0',
    '@astrojs/vue': '^5.1.0',
    'astro': '^5.1.1',
    'vite-plugin-pwa': '^0.21.1'
  },
  devDependencies: {
    'vitest': '^2.1.6',
    '@vitest/ui': '^2.1.6',
    '@testing-library/react': '^16.1.0',
    '@testing-library/jest-dom': '^6.6.3',
    'jsdom': '^25.0.1',
    'eslint': '^9.17.0',
    '@typescript-eslint/eslint-plugin': '^8.18.2',
    '@typescript-eslint/parser': '^8.18.2',
    'eslint-plugin-astro': '^1.3.2',
    'eslint-plugin-react': '^7.37.2',
    'eslint-plugin-react-hooks': '^5.1.0',
    'prettier': '^3.4.2',
    'typescript': '^5.7.2'
  }
};

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function installMissingDependencies() {
  log('🔍 Checking and installing missing dependencies...', 'info');
  
  try {
    // Check if package.json exists
    if (!fs.existsSync('package.json')) {
      log('❌ package.json not found!', 'error');
      process.exit(1);
    }

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const missingDeps = [];
    const missingDevDeps = [];

    // Check regular dependencies
    for (const [dep, version] of Object.entries(requiredDependencies.dependencies)) {
      if (!pkg.dependencies || !pkg.dependencies[dep]) {
        missingDeps.push(`${dep}@${version}`);
      }
    }

    // Check dev dependencies
    for (const [dep, version] of Object.entries(requiredDependencies.devDependencies)) {
      if (!pkg.devDependencies || !pkg.devDependencies[dep]) {
        missingDevDeps.push(`${dep}@${version}`);
      }
    }

    // Install missing dependencies
    if (missingDeps.length > 0) {
      log(`📦 Installing ${missingDeps.length} missing dependencies...`, 'info');
      execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
      log('✅ Dependencies installed successfully', 'success');
    }

    if (missingDevDeps.length > 0) {
      log(`🛠️ Installing ${missingDevDeps.length} missing dev dependencies...`, 'info');
      execSync(`npm install --save-dev ${missingDevDeps.join(' ')}`, { stdio: 'inherit' });
      log('✅ Dev dependencies installed successfully', 'success');
    }

    if (missingDeps.length === 0 && missingDevDeps.length === 0) {
      log('✅ All required dependencies are already installed', 'success');
    }

    // Clean and rebuild node_modules if needed
    log('🧹 Cleaning npm cache...', 'info');
    execSync('npm cache clean --force', { stdio: 'pipe' });

    log('🔄 Verifying installation...', 'info');
    execSync('npm ls --depth=0', { stdio: 'pipe' });
    
    log('✅ Dependency check completed successfully!', 'success');

  } catch (error) {
    log(`❌ Failed to install dependencies: ${error.message}`, 'error');
    
    // Try alternative installation method
    log('🔄 Trying alternative installation method...', 'warning');
    try {
      execSync('rm -rf node_modules package-lock.json', { stdio: 'pipe' });
      execSync('npm install', { stdio: 'inherit' });
      log('✅ Alternative installation succeeded', 'success');
    } catch (altError) {
      log(`❌ Alternative installation also failed: ${altError.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  installMissingDependencies();
}
