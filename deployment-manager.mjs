#!/usr/bin/env node
/**
 * Unified Deployment Management System
 * Combines all diagnostic, validation, and deployment tools into a single comprehensive solution
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class UnifiedDeploymentManager {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || __dirname;
    this.verbose = options.verbose || false;
    this.autoFix = options.autoFix !== false; // Default true
    this.results = {
      health: 0,
      issues: [],
      fixes: [],
      warnings: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      fix: '🔧'
    }[type] || '📋';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runCommand(command, options = {}) {
    try {
      const result = execSync(command, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: this.verbose ? 'inherit' : 'pipe',
        ...options
      });
      return { success: true, output: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        output: error.stdout || error.stderr || ''
      };
    }
  }

  // === VALIDATION METHODS ===

  async validatePackageJson() {
    this.log('Validating package.json...', 'info');
    
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Check required scripts
      const requiredScripts = ['dev', 'build', 'build:gh-pages'];
      const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
      
      if (missingScripts.length > 0) {
        this.results.issues.push(`Missing scripts: ${missingScripts.join(', ')}`);
        
        if (this.autoFix) {
          // Add missing scripts
          const defaultScripts = {
            'build:gh-pages': 'astro build --site https://tariqdude.github.io --base /WebsiteTest',
            'dev': 'astro dev',
            'build': 'astro build'
          };
          
          missingScripts.forEach(script => {
            if (defaultScripts[script]) {
              pkg.scripts[script] = defaultScripts[script];
              this.results.fixes.push(`Added missing script: ${script}`);
            }
          });
          
          fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
          this.log('Fixed package.json scripts', 'fix');
        }
      }
      
      // Check for problematic dependencies
      const problematicDeps = ['lint-staged', 'husky'];
      const foundProblematic = problematicDeps.filter(dep => 
        pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]
      );
      
      if (foundProblematic.length > 0) {
        this.results.warnings.push(`Found problematic dependencies: ${foundProblematic.join(', ')}`);
      }
      
      this.results.health += 20;
      this.log('Package.json validation complete', 'success');
      
    } catch (error) {
      this.results.issues.push(`Package.json validation failed: ${error.message}`);
      this.log(`Package.json validation failed: ${error.message}`, 'error');
    }
  }

  async validateAstroConfig() {
    this.log('Validating Astro configuration...', 'info');
    
    try {
      const configPath = path.join(this.projectRoot, 'astro.config.mjs');
      
      if (!fs.existsSync(configPath)) {
        this.results.issues.push('astro.config.mjs not found');
        return;
      }
      
      const configContent = fs.readFileSync(configPath, 'utf8');
      
      // Check for essential configurations
      const checks = [
        { pattern: /output:\s*['"]static['"]/, name: 'Static output mode' },
        { pattern: /site:\s*['"]https:\/\//, name: 'Site URL configuration' },
        { pattern: /base:\s*['"]\/\w+['"]/, name: 'Base path configuration' }
      ];
      
      checks.forEach(check => {
        if (!check.pattern.test(configContent)) {
          this.results.warnings.push(`Missing or incorrect: ${check.name}`);
        }
      });
      
      this.results.health += 15;
      this.log('Astro configuration validation complete', 'success');
      
    } catch (error) {
      this.results.issues.push(`Astro config validation failed: ${error.message}`);
      this.log(`Astro config validation failed: ${error.message}`, 'error');
    }
  }

  async validateDependencies() {
    this.log('Validating dependencies...', 'info');
    
    try {
      // Check if node_modules exists
      const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
      if (!fs.existsSync(nodeModulesPath)) {
        this.results.issues.push('node_modules not found - run npm install');
        
        if (this.autoFix) {
          this.log('Installing dependencies...', 'fix');
          const installResult = await this.runCommand('npm install');
          if (installResult.success) {
            this.results.fixes.push('Installed dependencies');
          } else {
            this.results.issues.push(`Dependency installation failed: ${installResult.error}`);
          }
        }
      }
      
      // Check package-lock.json sync
      const lockPath = path.join(this.projectRoot, 'package-lock.json');
      if (fs.existsSync(lockPath)) {
        const auditResult = await this.runCommand('npm audit fix --force', { timeout: 30000 });
        if (!auditResult.success && auditResult.error.includes('EBADENGINE')) {
          this.results.warnings.push('Node.js version compatibility warning');
        }
      }
      
      this.results.health += 20;
      this.log('Dependencies validation complete', 'success');
      
    } catch (error) {
      this.results.issues.push(`Dependencies validation failed: ${error.message}`);
      this.log(`Dependencies validation failed: ${error.message}`, 'error');
    }
  }

  async validateTypeScript() {
    this.log('Validating TypeScript...', 'info');
    
    try {
      const tsconfigPath = path.join(this.projectRoot, 'tsconfig.json');
      
      if (!fs.existsSync(tsconfigPath)) {
        this.results.warnings.push('tsconfig.json not found');
        return;
      }
      
      // Run TypeScript check
      const tscResult = await this.runCommand('npx tsc --noEmit', { timeout: 60000 });
      
      if (!tscResult.success) {
        const errors = tscResult.output.split('\n').filter(line => line.includes('error'));
        if (errors.length > 0) {
          this.results.issues.push(`TypeScript errors: ${errors.length} found`);
          if (this.verbose) {
            errors.slice(0, 5).forEach(error => this.log(error, 'error'));
          }
        }
      } else {
        this.results.health += 15;
      }
      
      this.log('TypeScript validation complete', 'success');
      
    } catch (error) {
      this.results.warnings.push(`TypeScript validation skipped: ${error.message}`);
    }
  }

  async validateBuild() {
    this.log('Testing build process...', 'info');
    
    try {
      // Clean dist directory
      const distPath = path.join(this.projectRoot, 'dist');
      if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true, force: true });
        this.log('Cleaned dist directory', 'fix');
      }
      
      // Test build
      const buildResult = await this.runCommand('npm run build:gh-pages', { timeout: 120000 });
      
      if (buildResult.success) {
        // Check if dist was created
        if (fs.existsSync(distPath)) {
          const files = fs.readdirSync(distPath);
          if (files.includes('index.html')) {
            this.results.health += 25;
            this.log('Build test successful', 'success');
          } else {
            this.results.issues.push('Build completed but index.html not found');
          }
        } else {
          this.results.issues.push('Build completed but dist directory not created');
        }
      } else {
        this.results.issues.push(`Build failed: ${buildResult.error}`);
        this.log(`Build failed: ${buildResult.error}`, 'error');
      }
      
    } catch (error) {
      this.results.issues.push(`Build validation failed: ${error.message}`);
      this.log(`Build validation failed: ${error.message}`, 'error');
    }
  }

  async validateGitHubPages() {
    this.log('Validating GitHub Pages configuration...', 'info');
    
    try {
      const workflowPath = path.join(this.projectRoot, '.github', 'workflows', 'deploy.yml');
      
      if (!fs.existsSync(workflowPath)) {
        this.results.issues.push('GitHub Actions workflow not found');
        return;
      }
      
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      
      // Check workflow configuration
      const checks = [
        { pattern: /node-version:\s*['"]2[0-9]['"]/, name: 'Node.js modern version configuration' },
        { pattern: /npm (install|ci)/, name: 'npm install command' },
        { pattern: /build:gh-pages/, name: 'GitHub Pages build script' },
        { pattern: /upload-pages-artifact/, name: 'Pages artifact upload' }
      ];
      
      let workflowScore = 0;
      checks.forEach(check => {
        if (check.pattern.test(workflowContent)) {
          workflowScore++;
        } else {
          this.results.warnings.push(`GitHub workflow missing: ${check.name}`);
        }
      });
      
      this.results.health += Math.floor((workflowScore / checks.length) * 15);
      this.log('GitHub Pages validation complete', 'success');
      
    } catch (error) {
      this.results.issues.push(`GitHub Pages validation failed: ${error.message}`);
      this.log(`GitHub Pages validation failed: ${error.message}`, 'error');
    }
  }

  // === MAIN EXECUTION METHODS ===

  async runHealthCheck() {
    this.log('🚀 Starting Unified Deployment Health Check', 'info');
    
    await this.validatePackageJson();
    await this.validateAstroConfig();
    await this.validateDependencies();
    await this.validateTypeScript();
    await this.validateGitHubPages();
    
    return this.results;
  }

  async runFullValidation() {
    this.log('🔍 Starting Full Deployment Validation', 'info');
    
    await this.runHealthCheck();
    await this.validateBuild();
    
    return this.results;
  }

  async runQuickFix() {
    this.log('🔧 Starting Quick Fix Process', 'info');
    this.autoFix = true;
    
    const results = await this.runFullValidation();
    
    // Additional fixes
    if (results.issues.length > 0) {
      this.log('Attempting additional fixes...', 'fix');
      
      // Clear npm cache if build issues
      if (results.issues.some(issue => issue.includes('Build failed'))) {
        await this.runCommand('npm cache clean --force');
        this.results.fixes.push('Cleared npm cache');
      }
      
      // Regenerate package-lock if dependency issues
      if (results.issues.some(issue => issue.includes('dependencies'))) {
        const lockPath = path.join(this.projectRoot, 'package-lock.json');
        if (fs.existsSync(lockPath)) {
          fs.unlinkSync(lockPath);
          await this.runCommand('npm install');
          this.results.fixes.push('Regenerated package-lock.json');
        }
      }
    }
    
    return results;
  }

  generateReport() {
    const healthColor = this.results.health >= 80 ? '🟢' : 
                       this.results.health >= 60 ? '🟡' : '🔴';
    
    console.log('\n' + '='.repeat(60));
    console.log(`${healthColor} DEPLOYMENT HEALTH REPORT ${healthColor}`);
    console.log('='.repeat(60));
    console.log(`Health Score: ${this.results.health}/100`);
    console.log(`Issues Found: ${this.results.issues.length}`);
    console.log(`Fixes Applied: ${this.results.fixes.length}`);
    console.log(`Warnings: ${this.results.warnings.length}`);
    
    if (this.results.issues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      this.results.issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue}`);
      });
    }
    
    if (this.results.fixes.length > 0) {
      console.log('\n🔧 FIXES APPLIED:');
      this.results.fixes.forEach((fix, i) => {
        console.log(`  ${i + 1}. ${fix}`);
      });
    }
    
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      this.results.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (this.results.health >= 80) {
      console.log('✅ Project is ready for deployment!');
    } else if (this.results.health >= 60) {
      console.log('⚠️ Project may have deployment issues. Review warnings.');
    } else {
      console.log('🚨 Project has critical issues. Fix before deploying.');
    }
    
    console.log('='.repeat(60) + '\n');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'health';
  
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    autoFix: !args.includes('--no-fix'),
    projectRoot: process.cwd()
  };
  
  const manager = new UnifiedDeploymentManager(options);
  
  try {
    let results;
    
    switch (command) {
      case 'health':
        results = await manager.runHealthCheck();
        break;
      case 'validate':
        results = await manager.runFullValidation();
        break;
      case 'fix':
        results = await manager.runQuickFix();
        break;
      case 'build-test':
        results = await manager.validateBuild();
        break;
      default:
        console.log('Usage: node deployment-manager.mjs [health|validate|fix|build-test] [--verbose] [--no-fix]');
        process.exit(1);
    }
    
    manager.generateReport();
    
    // Exit with appropriate code
    process.exit(results.health >= 80 ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Deployment manager error:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
export { UnifiedDeploymentManager };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
