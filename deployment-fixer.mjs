#!/usr/bin/env node

/**
 * 🔧 Deployment Fix & Verification Tool
 * Addresses Node.js version conflicts and ensures GitHub Pages compatibility
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';

class DeploymentFixer {
  constructor() {
    this.fixes = [];
    this.issues = [];
  }

  log(type, message) {
    const icons = { info: '🔵', success: '✅', error: '❌', fix: '🔧', warn: '⚠️' };
    console.log(`${icons[type]} ${message}`);
  }

  fixNodeVersionIssues() {
    this.log('info', 'Checking Node.js version compatibility...');
    
    // Update GitHub Actions workflow to use Node 20
    const workflowFile = '.github/workflows/deploy.yml';
    if (existsSync(workflowFile)) {
      let content = readFileSync(workflowFile, 'utf8');
      
      if (content.includes("node-version: '18'")) {
        content = content.replace("node-version: '18'", "node-version: '20'");
        writeFileSync(workflowFile, content);
        this.fixes.push('Updated GitHub Actions to use Node.js 20');
        this.log('fix', 'Updated Node.js version in GitHub Actions workflow');
      }
      
      if (content.includes('npm ci')) {
        content = content.replace(/npm ci/g, 'npm install');
        writeFileSync(workflowFile, content);
        this.fixes.push('Changed npm ci to npm install in workflow');
        this.log('fix', 'Updated npm command in workflow for compatibility');
      }
    }
  }

  cleanDependencies() {
    this.log('info', 'Cleaning problematic dependencies...');
    
    try {
      // Remove lock file and reinstall
      if (existsSync('package-lock.json')) {
        execSync('rm -f package-lock.json', { stdio: 'ignore' });
        this.log('fix', 'Removed package-lock.json');
      }
      
      // Fresh install
      execSync('npm install', { stdio: 'inherit' });
      this.fixes.push('Performed clean dependency installation');
      this.log('success', 'Dependencies installed successfully');
      
    } catch (error) {
      this.issues.push(`Dependency installation failed: ${error.message}`);
      this.log('error', `Failed to install dependencies: ${error.message}`);
    }
  }

  testBuild() {
    this.log('info', 'Testing build process...');
    
    try {
      // Clean previous build
      execSync('rm -rf dist .astro', { stdio: 'ignore' });
      
      // Test build
      execSync('npm run build:gh-pages', { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
      });
      
      // Verify output
      if (existsSync('dist/index.html')) {
        this.fixes.push('Build test successful');
        this.log('success', 'Build completed successfully');
        
        // Check for correct base path
        const indexContent = readFileSync('dist/index.html', 'utf8');
        if (indexContent.includes('/WebsiteTest/')) {
          this.log('success', 'Base path correctly applied');
        } else {
          this.log('warn', 'Base path may not be correctly applied');
        }
        
        return true;
      } else {
        this.issues.push('Build completed but no index.html found');
        this.log('error', 'Build output missing');
        return false;
      }
      
    } catch (error) {
      this.issues.push(`Build failed: ${error.message}`);
      this.log('error', `Build failed: ${error.message.slice(0, 200)}...`);
      return false;
    }
  }

  updateWorkflowForRobustness() {
    this.log('info', 'Updating workflow for better reliability...');
    
    const workflowFile = '.github/workflows/deploy.yml';
    if (!existsSync(workflowFile)) {
      this.log('warn', 'No workflow file found, skipping update');
      return;
    }

    let content = readFileSync(workflowFile, 'utf8');
    
    // Add timeout and error handling
    const buildStep = `      - name: Build
        run: npm run build:gh-pages
        timeout-minutes: 10
        env:
          NODE_ENV: production`;
    
    if (!content.includes('timeout-minutes')) {
      content = content.replace(
        /- name: Build\s+run: npm run build:gh-pages\s+env:\s+NODE_ENV: production/,
        buildStep
      );
      
      writeFileSync(workflowFile, content);
      this.fixes.push('Added timeout protection to build step');
      this.log('fix', 'Added build timeout protection');
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔧 DEPLOYMENT FIX REPORT');
    console.log('='.repeat(60));
    
    console.log(`✅ Fixes Applied: ${this.fixes.length}`);
    console.log(`❌ Issues Found: ${this.issues.length}`);
    
    if (this.fixes.length > 0) {
      console.log('\n🔧 FIXES APPLIED:');
      this.fixes.forEach((fix, i) => {
        console.log(`  ${i + 1}. ${fix}`);
      });
    }
    
    if (this.issues.length > 0) {
      console.log('\n❌ ISSUES FOUND:');
      this.issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue}`);
      });
    }
    
    if (this.issues.length === 0) {
      console.log('\n🎉 SUCCESS! Deployment is ready!');
      console.log('\n📝 Next steps:');
      console.log('1. git add .');
      console.log('2. git commit -m "Fix deployment issues"');
      console.log('3. git push origin main');
      console.log('4. Monitor deployment at: https://github.com/tariqdude/WebsiteTest/actions');
    } else {
      console.log('\n⚠️ Some issues remain. Please review the errors above.');
    }
    
    console.log('='.repeat(60));
  }

  async run() {
    console.log('🔧 Deployment Fix & Verification Tool');
    console.log('='.repeat(40));
    
    this.fixNodeVersionIssues();
    this.cleanDependencies();
    this.updateWorkflowForRobustness();
    
    console.log('\n🧪 Testing build...');
    const buildSuccess = this.testBuild();
    
    this.generateReport();
    
    return {
      success: this.issues.length === 0 && buildSuccess,
      fixes: this.fixes.length,
      issues: this.issues.length
    };
  }
}

// Run the fixer
const fixer = new DeploymentFixer();
fixer.run().then(result => {
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('🔴 Fix process failed:', error);
  process.exit(1);
});
