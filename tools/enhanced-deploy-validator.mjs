#!/usr/bin/env node
/**
 * Enhanced Deployment Validation Script
 * Bulletproof validation for GitHub Pages deployment
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

class DeploymentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async validatePackageJson() {
    this.log('🔍 Validating package.json...', 'info');
    
    const pkgPath = path.join(projectRoot, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      this.errors.push('package.json not found');
      return;
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    // Check required scripts
    const requiredScripts = [
      'build',
      'build:gh-pages',
      'test',
      'test:ssr',
      'deploy:validate',
      'check',
      'check:types'
    ];

    for (const script of requiredScripts) {
      if (!pkg.scripts[script]) {
        this.errors.push(`Missing required script: ${script}`);
      }
    }

    // Check dependencies
    const requiredDeps = ['astro', '@astrojs/react', '@astrojs/tailwind'];
    const requiredDevDeps = ['vitest', '@testing-library/react', 'eslint'];

    for (const dep of requiredDeps) {
      if (!pkg.dependencies[dep]) {
        this.errors.push(`Missing required dependency: ${dep}`);
      }
    }

    for (const dep of requiredDevDeps) {
      if (!pkg.devDependencies[dep]) {
        this.warnings.push(`Missing recommended dev dependency: ${dep}`);
      }
    }

    this.log('✅ Package.json validation complete', 'success');
  }

  async validateAstroConfig() {
    this.log('🔍 Validating Astro configuration...', 'info');
    
    const configPath = path.join(projectRoot, 'astro.config.mjs');
    if (!fs.existsSync(configPath)) {
      this.errors.push('astro.config.mjs not found');
      return;
    }

    const config = fs.readFileSync(configPath, 'utf8');
    
    // Check for required configurations
    if (!config.includes('site:')) {
      this.errors.push('Missing site configuration in astro.config.mjs');
    }
    
    if (!config.includes('base:')) {
      this.errors.push('Missing base path configuration in astro.config.mjs');
    }
    
    if (!config.includes("output: 'static'")) {
      this.errors.push('Output should be set to static for GitHub Pages');
    }

    // Check for GitHub Pages specific settings
    if (!config.includes('tariqdude.github.io')) {
      this.warnings.push('Site URL should match GitHub Pages URL');
    }

    if (!config.includes('/WebsiteTest')) {
      this.warnings.push('Base path should match repository name');
    }

    this.log('✅ Astro configuration validation complete', 'success');
  }

  async validatePublicAssets() {
    this.log('🔍 Validating public assets...', 'info');
    
    const publicDir = path.join(projectRoot, 'public');
    if (!fs.existsSync(publicDir)) {
      this.errors.push('Public directory not found');
      return;
    }

    // Check for required PWA assets
    const requiredAssets = [
      'favicon.svg',
      'robots.txt',
      'pwa-192x192.png',
      'pwa-512x512.png',
      'apple-touch-icon.png'
    ];

    for (const asset of requiredAssets) {
      const assetPath = path.join(publicDir, asset);
      if (!fs.existsSync(assetPath)) {
        this.warnings.push(`Missing recommended asset: ${asset}`);
      }
    }

    this.log('✅ Public assets validation complete', 'success');
  }

  async validateTypeScript() {
    this.log('🔍 Validating TypeScript configuration...', 'info');
    
    try {
      execSync('npm run check:types', { 
        cwd: projectRoot, 
        stdio: 'pipe' 
      });
      this.log('✅ TypeScript validation passed', 'success');
    } catch (error) {
      this.errors.push('TypeScript validation failed');
      this.log('❌ TypeScript errors found', 'error');
    }
  }

  async validateAstroCheck() {
    this.log('🔍 Running Astro checks...', 'info');
    
    try {
      execSync('npm run check', { 
        cwd: projectRoot, 
        stdio: 'pipe' 
      });
      this.log('✅ Astro checks passed', 'success');
    } catch (error) {
      this.errors.push('Astro validation failed');
      this.log('❌ Astro checks failed', 'error');
    }
  }

  async validateTests() {
    this.log('🔍 Validating test configuration...', 'info');
    
    // Check if vitest.config.ts exists and is valid
    const vitestConfig = path.join(projectRoot, 'vitest.config.ts');
    if (!fs.existsSync(vitestConfig)) {
      this.warnings.push('vitest.config.ts not found');
      return;
    }

    try {
      execSync('npm run test -- --run', { 
        cwd: projectRoot, 
        stdio: 'pipe',
        timeout: 30000
      });
      this.log('✅ Tests validation passed', 'success');
    } catch (error) {
      this.warnings.push('Some tests failed - check test output');
      this.log('⚠️ Test failures detected', 'warning');
    }
  }

  async validateBuild() {
    this.log('🔍 Validating build process...', 'info');
    
    try {
      // Clean previous build
      if (fs.existsSync(path.join(projectRoot, 'dist'))) {
        fs.rmSync(path.join(projectRoot, 'dist'), { recursive: true });
      }

      execSync('npm run build:gh-pages', { 
        cwd: projectRoot, 
        stdio: 'pipe',
        timeout: 120000
      });

      // Verify build output
      const distDir = path.join(projectRoot, 'dist');
      if (!fs.existsSync(distDir)) {
        this.errors.push('Build failed: dist directory not created');
        return;
      }

      const indexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        this.errors.push('Build failed: index.html not found');
        return;
      }

      // Check if assets are properly referenced
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      if (!indexContent.includes('/WebsiteTest/')) {
        this.warnings.push('Base path may not be correctly applied in build output');
      }

      this.log('✅ Build validation passed', 'success');
    } catch (error) {
      this.errors.push('Build process failed');
      this.log('❌ Build validation failed', 'error');
    }
  }

  async generateReport() {
    this.log('\n📋 DEPLOYMENT VALIDATION REPORT', 'info');
    this.log('================================', 'info');
    
    if (this.errors.length === 0) {
      this.log('✅ All critical validations passed!', 'success');
    } else {
      this.log(`❌ Found ${this.errors.length} critical errors:`, 'error');
      this.errors.forEach(error => this.log(`  • ${error}`, 'error'));
    }

    if (this.warnings.length > 0) {
      this.log(`⚠️ Found ${this.warnings.length} warnings:`, 'warning');
      this.warnings.forEach(warning => this.log(`  • ${warning}`, 'warning'));
    }

    if (this.fixes.length > 0) {
      this.log(`🔧 Applied ${this.fixes.length} fixes:`, 'info');
      this.fixes.forEach(fix => this.log(`  • ${fix}`, 'info'));
    }

    this.log('\n📊 VALIDATION SUMMARY:', 'info');
    this.log(`  Errors: ${this.errors.length}`, this.errors.length > 0 ? 'error' : 'success');
    this.log(`  Warnings: ${this.warnings.length}`, this.warnings.length > 0 ? 'warning' : 'info');
    this.log(`  Status: ${this.errors.length === 0 ? 'READY TO DEPLOY' : 'NEEDS FIXES'}`, 
             this.errors.length === 0 ? 'success' : 'error');

    return this.errors.length === 0;
  }

  async run() {
    this.log('🚀 Starting Enhanced Deployment Validation...', 'info');
    
    await this.validatePackageJson();
    await this.validateAstroConfig();
    await this.validatePublicAssets();
    await this.validateTypeScript();
    await this.validateAstroCheck();
    await this.validateTests();
    await this.validateBuild();
    
    const success = await this.generateReport();
    
    if (!success) {
      process.exit(1);
    }
    
    this.log('\n🎉 Deployment validation completed successfully!', 'success');
  }
}

// Run validation
const validator = new DeploymentValidator();
validator.run().catch(error => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
});
