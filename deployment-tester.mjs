#!/usr/bin/env node

/**
 * 🚀 GitHub Pages Deployment Test & Validation
 * Complete build testing and deployment preparation
 */

import { execSync, exec } from 'child_process';
import { readFileSync, existsSync, writeFileSync, rmSync } from 'fs';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

class DeploymentTester {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  log(type, message, details = '') {
    const icons = {
      info: '🔵 INFO',
      success: '🟢 PASS',
      error: '🔴 FAIL',
      warning: '🟡 WARN',
      fix: '🔧 FIX'
    };
    
    console.log(`${icons[type]} ${message}`);
    if (details) console.log(`    ${details}`);
  }

  async test(name, testFn) {
    try {
      const result = await testFn();
      if (result === false) {
        this.results.failed.push(name);
        this.log('error', name);
      } else {
        this.results.passed.push(name);
        this.log('success', name, result || '');
      }
    } catch (error) {
      this.results.failed.push(name);
      this.log('error', name, error.message);
    }
  }

  async warn(name, message) {
    this.results.warnings.push(name);
    this.log('warning', name, message);
  }

  // =============================================================================
  // TEST IMPLEMENTATIONS
  // =============================================================================

  async testNodeModules() {
    if (!existsSync('node_modules')) {
      this.log('fix', 'Installing dependencies...');
      try {
        execSync('npm install', { stdio: 'inherit' });
        return 'Dependencies installed successfully';
      } catch (error) {
        throw new Error('Failed to install dependencies');
      }
    }
    return 'Dependencies already installed';
  }

  async testTypeScriptCheck() {
    try {
      const { stdout, stderr } = await execAsync('npx tsc --noEmit', { 
        timeout: 60000 
      });
      
      if (stderr && stderr.includes('error TS')) {
        throw new Error(`TypeScript errors found:\n${stderr}`);
      }
      
      return 'TypeScript validation passed';
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('TypeScript not found');
      }
      throw error;
    }
  }

  async testAstroCheck() {
    try {
      const { stdout, stderr } = await execAsync('npx astro check', {
        timeout: 120000
      });
      
      if (stderr && (stderr.includes('error') || stderr.includes('Error'))) {
        throw new Error(`Astro check failed:\n${stderr}`);
      }
      
      return 'Astro validation passed';
    } catch (error) {
      throw new Error(`Astro check failed: ${error.message}`);
    }
  }

  async testBasicBuild() {
    try {
      // Clean previous build
      if (existsSync('dist')) {
        rmSync('dist', { recursive: true, force: true });
      }
      
      this.log('info', 'Starting build test...');
      
      const { stdout, stderr } = await execAsync('npm run build', {
        timeout: 300000, // 5 minutes
        maxBuffer: 1024 * 1024 * 10 // 10MB
      });
      
      if (!existsSync('dist')) {
        throw new Error('Build completed but no dist directory found');
      }
      
      if (!existsSync('dist/index.html')) {
        throw new Error('Build completed but no index.html found');
      }
      
      return 'Basic build successful';
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  async testGitHubPagesBuild() {
    try {
      // Clean previous build
      if (existsSync('dist')) {
        rmSync('dist', { recursive: true, force: true });
      }
      
      this.log('info', 'Testing GitHub Pages build...');
      
      const { stdout, stderr } = await execAsync('npm run build:gh-pages', {
        timeout: 300000, // 5 minutes
        maxBuffer: 1024 * 1024 * 10 // 10MB
      });
      
      if (!existsSync('dist')) {
        throw new Error('GitHub Pages build completed but no dist directory found');
      }
      
      // Check for correct base path handling
      const indexContent = readFileSync('dist/index.html', 'utf8');
      if (!indexContent.includes('/WebsiteTest/')) {
        throw new Error('Base path not correctly applied in build output');
      }
      
      return 'GitHub Pages build successful with correct base path';
    } catch (error) {
      throw new Error(`GitHub Pages build failed: ${error.message}`);
    }
  }

  async testBuildOutput() {
    if (!existsSync('dist')) {
      throw new Error('No dist directory found');
    }
    
    const issues = [];
    
    // Check essential files
    const essentialFiles = [
      'dist/index.html',
      'dist/showcase/index.html',
      'dist/about/index.html',
      'dist/contact/index.html'
    ];
    
    for (const file of essentialFiles) {
      if (!existsSync(file)) {
        issues.push(`Missing: ${file}`);
      }
    }
    
    // Check for _astro directory (assets)
    if (!existsSync('dist/_astro')) {
      issues.push('Missing _astro assets directory');
    }
    
    if (issues.length > 0) {
      throw new Error(`Build output issues:\n${issues.join('\n')}`);
    }
    
    return 'All essential build outputs present';
  }

  async testAssetPaths() {
    const indexFile = 'dist/index.html';
    if (!existsSync(indexFile)) {
      throw new Error('index.html not found');
    }
    
    const content = readFileSync(indexFile, 'utf8');
    
    // Check that assets use correct base path
    const assetPathRegex = /_astro\/[^"'\s]+/g;
    const matches = content.match(assetPathRegex);
    
    if (!matches || matches.length === 0) {
      this.warn('No _astro assets found in HTML', 'This might be normal for a simple build');
      return true;
    }
    
    // Verify assets don't have double base paths
    const doubleBasePath = matches.some(path => path.includes('/WebsiteTest/WebsiteTest/'));
    if (doubleBasePath) {
      throw new Error('Double base path detected in asset URLs');
    }
    
    return `Asset paths correctly configured (${matches.length} assets found)`;
  }

  async testShowcasePage() {
    const showcaseFile = 'dist/showcase/index.html';
    if (!existsSync(showcaseFile)) {
      throw new Error('Showcase page not built');
    }
    
    const content = readFileSync(showcaseFile, 'utf8');
    
    // Check for component indicators
    const componentIndicators = [
      'InteractiveCounter',
      'AdvancedForm', 
      'DataVisualizationDashboard',
      'showcase'
    ];
    
    const missingComponents = componentIndicators.filter(comp => 
      !content.toLowerCase().includes(comp.toLowerCase())
    );
    
    if (missingComponents.length > 0) {
      this.warn('Some components not found in showcase page', 
        `Missing: ${missingComponents.join(', ')}`);
    }
    
    return 'Showcase page built successfully';
  }

  async testBundleSize() {
    if (!existsSync('dist')) {
      throw new Error('No dist directory found');
    }
    
    try {
      const { stdout } = await execAsync('du -sh dist');
      const size = stdout.trim().split('\t')[0];
      
      // Warn if bundle is very large
      const sizeNum = parseFloat(size);
      const unit = size.replace(/[0-9.]/g, '');
      
      if (unit.includes('G') || (unit.includes('M') && sizeNum > 100)) {
        this.warn('Large bundle size detected', `Total size: ${size}`);
      }
      
      return `Bundle size: ${size}`;
    } catch (error) {
      return 'Bundle size check skipped (du command not available)';
    }
  }

  async testGitHubActionsWorkflow() {
    const workflowFile = '.github/workflows/deploy.yml';
    
    if (!existsSync(workflowFile)) {
      this.log('fix', 'Creating GitHub Actions workflow...');
      this.createGitHubActionsWorkflow();
      return 'GitHub Actions workflow created';
    }
    
    const content = readFileSync(workflowFile, 'utf8');
    
    // Check for essential workflow elements
    const requiredElements = [
      'actions/checkout',
      'actions/setup-node',
      'npm ci',
      'npm run build',
      'actions/upload-pages-artifact',
      'actions/deploy-pages'
    ];
    
    const missing = requiredElements.filter(elem => !content.includes(elem));
    
    if (missing.length > 0) {
      throw new Error(`Workflow missing elements: ${missing.join(', ')}`);
    }
    
    return 'GitHub Actions workflow properly configured';
  }

  createGitHubActionsWorkflow() {
    const workflowDir = '.github/workflows';
    if (!existsSync(workflowDir)) {
      execSync(`mkdir -p ${workflowDir}`);
    }
    
    const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for GitHub Pages
        run: npm run build:gh-pages
        env:
          NODE_ENV: production
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

    writeFileSync('.github/workflows/deploy.yml', workflowContent);
  }

  // =============================================================================
  // MAIN TEST EXECUTION
  // =============================================================================

  async runAllTests() {
    console.log('🚀 GitHub Pages Deployment Testing Suite');
    console.log('='.repeat(60));
    
    // Dependency tests
    await this.test('Dependencies Check', () => this.testNodeModules());
    
    // Code validation tests
    await this.test('TypeScript Check', () => this.testTypeScriptCheck());
    await this.test('Astro Check', () => this.testAstroCheck());
    
    // Build tests
    await this.test('Basic Build Test', () => this.testBasicBuild());
    await this.test('GitHub Pages Build Test', () => this.testGitHubPagesBuild());
    
    // Output validation tests
    await this.test('Build Output Validation', () => this.testBuildOutput());
    await this.test('Asset Path Validation', () => this.testAssetPaths());
    await this.test('Showcase Page Test', () => this.testShowcasePage());
    
    // Deployment preparation tests
    await this.test('Bundle Size Analysis', () => this.testBundleSize());
    await this.test('GitHub Actions Workflow', () => this.testGitHubActionsWorkflow());
    
    // Generate report
    this.generateReport();
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DEPLOYMENT TEST RESULTS');
    console.log('='.repeat(60));
    
    console.log(`🟢 Passed: ${this.results.passed.length}`);
    console.log(`🔴 Failed: ${this.results.failed.length}`);
    console.log(`🟡 Warnings: ${this.results.warnings.length}`);
    
    if (this.results.failed.length > 0) {
      console.log('\n🔴 FAILED TESTS:');
      this.results.failed.forEach((test, i) => {
        console.log(`  ${i + 1}. ${test}`);
      });
    }
    
    if (this.results.warnings.length > 0) {
      console.log('\n🟡 WARNINGS:');
      this.results.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }
    
    if (this.results.failed.length === 0) {
      console.log('\n🎉 ALL TESTS PASSED!');
      console.log('✅ Your project is ready for GitHub Pages deployment!');
      console.log('\n📝 Next steps:');
      console.log('1. Commit your changes: git add . && git commit -m "Prepare for deployment"');
      console.log('2. Push to GitHub: git push origin main');
      console.log('3. Enable GitHub Pages in your repository settings');
      console.log('4. Your site will be available at: https://tariqdude.github.io/WebsiteTest/');
    } else {
      console.log('\n❌ DEPLOYMENT NOT READY');
      console.log('Please fix the failed tests before deploying to GitHub Pages.');
    }
    
    console.log('='.repeat(60));
  }
}

// Run the deployment tester
const tester = new DeploymentTester();
tester.runAllTests().catch(error => {
  console.error('🔴 Test runner failed:', error);
  process.exit(1);
});
