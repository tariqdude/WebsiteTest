#!/usr/bin/env node

/**
 * 🚀 Unified Deployment Manager
 * Comprehensive GitHub Pages deployment validation, fixing, and monitoring
 * Combines all diagnostic tools into one powerful system
 */

import { performance } from 'perf_hooks';
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const startTime = performance.now();

class DeploymentManager {
  constructor() {
    this.results = {
      errors: [],
      warnings: [],
      fixes: [],
      metrics: {},
      status: 'unknown'
    };
    this.config = this.loadConfig();
  }

  loadConfig() {
    return {
      site: 'https://tariqdude.github.io',
      base: '/WebsiteTest',
      timeouts: {
        build: 300000,      // 5 minutes
        typecheck: 120000,  // 2 minutes
        install: 180000     // 3 minutes
      },
      thresholds: {
        maxFileSize: 1024 * 1024,     // 1MB
        maxBuildTime: 240000,         // 4 minutes
        minFiles: 5                   // Minimum dist files
      }
    };
  }

  log(level, category, message, data = null) {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    const icons = {
      error: '🔴',
      warn: '🟡',
      info: '🔵',
      success: '✅',
      fix: '🔧',
      deploy: '🚀',
      build: '📦',
      test: '🧪'
    };
    
    const timestamp = `[+${elapsed}s]`;
    const icon = icons[level] || '📍';
    console.log(`${icon} ${timestamp} [${category}] ${message}`);
    
    if (data) {
      console.log(`   ${JSON.stringify(data, null, 2).replace(/\n/g, '\n   ')}`);
    }
  }

  addResult(type, category, message, data = null) {
    this.results[type].push({ category, message, data, timestamp: Date.now() });
    this.log(type === 'errors' ? 'error' : type === 'warnings' ? 'warn' : 'info', category, message, data);
  }

  // =============================================================================
  // CORE VALIDATION METHODS
  // =============================================================================

  async validateEnvironment() {
    this.log('info', 'ENV', 'Validating environment setup...');
    
    try {
      // Check Node.js version
      const { stdout: nodeVersion } = await execAsync('node --version');
      const version = nodeVersion.trim();
      const majorVersion = parseInt(version.slice(1).split('.')[0]);
      
      if (majorVersion < 18) {
        this.addResult('errors', 'ENV', `Node.js ${version} is too old. Minimum required: 18.x`);
      } else {
        this.log('success', 'ENV', `Node.js ${version} ✓`);
      }

      // Check npm
      const { stdout: npmVersion } = await execAsync('npm --version');
      this.log('success', 'ENV', `npm ${npmVersion.trim()} ✓`);

      // Check package.json
      if (!existsSync(path.join(projectRoot, 'package.json'))) {
        this.addResult('errors', 'ENV', 'package.json not found');
        return false;
      }

      const packageJson = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
      
      // Validate required scripts
      const requiredScripts = ['build:gh-pages', 'dev', 'preview'];
      const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
      
      if (missingScripts.length > 0) {
        this.addResult('errors', 'ENV', `Missing scripts: ${missingScripts.join(', ')}`);
      }

      this.log('success', 'ENV', 'Environment validation passed');
      return true;

    } catch (error) {
      this.addResult('errors', 'ENV', `Environment check failed: ${error.message}`);
      return false;
    }
  }

  async validateAstroConfig() {
    this.log('info', 'CONFIG', 'Validating Astro configuration...');
    
    const configPath = path.join(projectRoot, 'astro.config.mjs');
    
    if (!existsSync(configPath)) {
      this.addResult('errors', 'CONFIG', 'astro.config.mjs not found');
      return false;
    }

    try {
      const configContent = readFileSync(configPath, 'utf8');
      
      // Critical checks for GitHub Pages
      const checks = [
        { pattern: /site:\s*['"]https:\/\/tariqdude\.github\.io['"]/, name: 'site URL' },
        { pattern: /base:\s*['"]\/WebsiteTest['"]/, name: 'base path' },
        { pattern: /output:\s*['"]static['"]/, name: 'static output' }
      ];
      
      let configValid = true;
      
      for (const check of checks) {
        if (!check.pattern.test(configContent)) {
          this.addResult('errors', 'CONFIG', `Missing or incorrect ${check.name} in astro.config.mjs`);
          configValid = false;
        }
      }
      
      if (configValid) {
        this.log('success', 'CONFIG', 'Astro configuration validated');
      }
      
      return configValid;
      
    } catch (error) {
      this.addResult('errors', 'CONFIG', `Config validation failed: ${error.message}`);
      return false;
    }
  }

  async validateDependencies() {
    this.log('info', 'DEPS', 'Validating dependencies...');
    
    try {
      const installStart = performance.now();
      
      // Check if node_modules exists and is up to date
      if (!existsSync(path.join(projectRoot, 'node_modules'))) {
        this.log('warn', 'DEPS', 'node_modules not found, installing...');
        await execAsync('npm ci', { 
          cwd: projectRoot,
          timeout: this.config.timeouts.install 
        });
      }
      
      const installTime = performance.now() - installStart;
      this.results.metrics.installTime = installTime;
      
      // Check for common problematic packages
      const packageJson = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Check for version conflicts
      const problematicPatterns = [
        { pattern: /^react@/, name: 'React' },
        { pattern: /^vue@/, name: 'Vue' },
        { pattern: /^svelte@/, name: 'Svelte' }
      ];
      
      this.log('success', 'DEPS', `Dependencies validated in ${(installTime/1000).toFixed(2)}s`);
      return true;
      
    } catch (error) {
      this.addResult('errors', 'DEPS', `Dependency validation failed: ${error.message}`);
      return false;
    }
  }

  async validateTypeScript() {
    this.log('info', 'TYPES', 'Running TypeScript validation...');
    
    try {
      const tscStart = performance.now();
      
      await execAsync('npx astro check', { 
        cwd: projectRoot,
        timeout: this.config.timeouts.typecheck 
      });
      
      const tscTime = performance.now() - tscStart;
      this.results.metrics.typecheckTime = tscTime;
      
      this.log('success', 'TYPES', `TypeScript validation passed in ${(tscTime/1000).toFixed(2)}s`);
      return true;
      
    } catch (error) {
      if (error.stdout && error.stdout.includes('error')) {
        const errors = this.parseTypeScriptErrors(error.stdout);
        this.addResult('errors', 'TYPES', `${errors.length} TypeScript errors found`, errors);
      } else {
        this.addResult('warnings', 'TYPES', `TypeScript check warning: ${error.message}`);
      }
      return false;
    }
  }

  parseTypeScriptErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('error TS') || line.includes('error(')) {
        errors.push(line.trim());
      }
    }
    
    return errors;
  }

  async validateBuild() {
    this.log('build', 'BUILD', 'Testing production build...');
    
    try {
      const buildStart = performance.now();
      
      // Clean previous build
      if (existsSync(path.join(projectRoot, 'dist'))) {
        await execAsync('rm -rf dist', { cwd: projectRoot });
      }
      
      // Run production build
      const { stdout, stderr } = await execAsync('npm run build:gh-pages', { 
        cwd: projectRoot,
        timeout: this.config.timeouts.build,
        env: { ...process.env, NODE_ENV: 'production', CI: 'true' }
      });
      
      const buildTime = performance.now() - buildStart;
      this.results.metrics.buildTime = buildTime;
      
      // Validate build output
      const buildValidation = await this.validateBuildOutput();
      
      if (buildValidation.success) {
        this.log('success', 'BUILD', `Build completed successfully in ${(buildTime/1000).toFixed(2)}s`);
        this.results.metrics.buildFiles = buildValidation.fileCount;
        this.results.metrics.buildSize = buildValidation.totalSize;
      } else {
        this.addResult('errors', 'BUILD', 'Build output validation failed', buildValidation.issues);
      }
      
      return buildValidation.success;
      
    } catch (error) {
      this.addResult('errors', 'BUILD', `Build failed: ${error.message}`);
      this.parseBuildErrors(error.stdout || error.stderr || error.message);
      return false;
    }
  }

  async validateBuildOutput() {
    const distPath = path.join(projectRoot, 'dist');
    
    if (!existsSync(distPath)) {
      return { success: false, issues: ['No dist directory generated'] };
    }
    
    const files = this.getAllFiles(distPath);
    const issues = [];
    
    // Essential file checks
    const hasIndex = files.some(f => f.endsWith('index.html'));
    const hasAssets = files.some(f => f.includes('_astro'));
    const hasShowcase = files.some(f => f.includes('showcase'));
    
    if (!hasIndex) issues.push('Missing index.html');
    if (!hasAssets) issues.push('Missing _astro assets directory');
    if (!hasShowcase) issues.push('Missing showcase page');
    
    // Size analysis
    let totalSize = 0;
    const largeFiles = [];
    
    for (const file of files) {
      try {
        const stats = statSync(file);
        totalSize += stats.size;
        
        if (stats.size > this.config.thresholds.maxFileSize) {
          largeFiles.push({
            file: path.relative(distPath, file),
            size: this.formatBytes(stats.size)
          });
        }
      } catch (error) {
        // Ignore stat errors
      }
    }
    
    if (largeFiles.length > 0) {
      this.addResult('warnings', 'BUILD', `${largeFiles.length} large files detected`, largeFiles);
    }
    
    if (files.length < this.config.thresholds.minFiles) {
      issues.push(`Too few files generated (${files.length} < ${this.config.thresholds.minFiles})`);
    }
    
    return {
      success: issues.length === 0,
      issues,
      fileCount: files.length,
      totalSize: totalSize,
      largeFiles
    };
  }

  getAllFiles(dir, files = []) {
    if (!existsSync(dir)) return files;
    
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.getAllFiles(fullPath, files);
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  parseBuildErrors(output) {
    if (!output) return;
    
    const lines = output.split('\n');
    const errors = [];
    
    for (const line of lines) {
      if (line.toLowerCase().includes('error') || 
          line.toLowerCase().includes('failed') ||
          line.toLowerCase().includes('cannot resolve')) {
        errors.push(line.trim());
      }
    }
    
    if (errors.length > 0) {
      this.log('error', 'BUILD', 'Build errors detected:');
      errors.forEach(error => console.log(`   ${error}`));
    }
  }

  // =============================================================================
  // AUTO-FIX METHODS
  // =============================================================================

  async autoFix() {
    this.log('fix', 'AUTO-FIX', 'Applying automatic fixes...');
    
    let fixCount = 0;
    
    // Fix missing scripts
    if (this.results.errors.some(e => e.message.includes('Missing scripts'))) {
      await this.fixPackageScripts();
      fixCount++;
    }
    
    // Fix Astro config
    if (this.results.errors.some(e => e.category === 'CONFIG')) {
      await this.fixAstroConfig();
      fixCount++;
    }
    
    // Clean and reinstall dependencies if needed
    if (this.results.errors.some(e => e.category === 'DEPS')) {
      await this.fixDependencies();
      fixCount++;
    }
    
    this.log('success', 'AUTO-FIX', `Applied ${fixCount} automatic fixes`);
    return fixCount;
  }

  async fixPackageScripts() {
    const packagePath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    
    const requiredScripts = {
      'build:gh-pages': 'NODE_ENV=production astro build --site https://tariqdude.github.io --base /WebsiteTest',
      'deploy:validate': 'node tools/deployment-manager.mjs --validate',
      'deploy:fix': 'node tools/deployment-manager.mjs --fix',
      'deploy:test': 'node tools/deployment-manager.mjs --test'
    };
    
    let updated = false;
    for (const [script, command] of Object.entries(requiredScripts)) {
      if (!packageJson.scripts[script]) {
        packageJson.scripts[script] = command;
        updated = true;
      }
    }
    
    if (updated) {
      writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      this.log('fix', 'SCRIPTS', 'Updated package.json scripts');
    }
  }

  async fixAstroConfig() {
    const configPath = path.join(projectRoot, 'astro.config.mjs');
    let content = readFileSync(configPath, 'utf8');
    
    // Ensure correct GitHub Pages configuration
    if (!content.includes('site: \'https://tariqdude.github.io\'')) {
      content = content.replace(
        /site:\s*['"][^'"]*['"]/,
        'site: \'https://tariqdude.github.io\''
      );
    }
    
    if (!content.includes('base: \'/WebsiteTest\'')) {
      content = content.replace(
        /base:\s*['"][^'"]*['"]/,
        'base: \'/WebsiteTest\''
      );
    }
    
    writeFileSync(configPath, content);
    this.log('fix', 'CONFIG', 'Fixed Astro configuration');
  }

  async fixDependencies() {
    try {
      this.log('fix', 'DEPS', 'Cleaning and reinstalling dependencies...');
      
      await execAsync('rm -rf node_modules package-lock.json', { cwd: projectRoot });
      await execAsync('npm install', { 
        cwd: projectRoot,
        timeout: this.config.timeouts.install 
      });
      
      this.log('success', 'DEPS', 'Dependencies reinstalled successfully');
    } catch (error) {
      this.log('error', 'DEPS', `Dependency fix failed: ${error.message}`);
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  calculateScore() {
    const totalChecks = 5; // env, config, deps, types, build
    const errorCount = this.results.errors.length;
    const warningCount = this.results.warnings.length;
    
    const errorPenalty = errorCount * 20;
    const warningPenalty = warningCount * 5;
    
    const score = Math.max(0, 100 - errorPenalty - warningPenalty);
    return Math.round(score);
  }

  // =============================================================================
  // REPORTING
  // =============================================================================

  async generateReport() {
    const totalTime = (performance.now() - startTime) / 1000;
    const score = this.calculateScore();
    
    console.log('\n' + '='.repeat(80));
    console.log('🚀 DEPLOYMENT MANAGER REPORT');
    console.log('='.repeat(80));
    
    console.log(`📊 Overall Score: ${score}/100`);
    console.log(`⏱️  Total Time: ${totalTime.toFixed(2)}s`);
    console.log(`🔴 Errors: ${this.results.errors.length}`);
    console.log(`🟡 Warnings: ${this.results.warnings.length}`);
    
    if (this.results.metrics.buildTime) {
      console.log(`📦 Build Time: ${(this.results.metrics.buildTime/1000).toFixed(2)}s`);
    }
    
    if (this.results.metrics.buildFiles) {
      console.log(`📁 Build Files: ${this.results.metrics.buildFiles}`);
    }
    
    if (this.results.metrics.buildSize) {
      console.log(`💾 Build Size: ${this.formatBytes(this.results.metrics.buildSize)}`);
    }
    
    if (this.results.errors.length > 0) {
      console.log('\n🔴 CRITICAL ERRORS:');
      this.results.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. [${error.category}] ${error.message}`);
      });
    }
    
    if (this.results.warnings.length > 0) {
      console.log('\n🟡 WARNINGS:');
      this.results.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. [${warning.category}] ${warning.message}`);
      });
    }
    
    // Deployment readiness
    if (score >= 80 && this.results.errors.length === 0) {
      console.log('\n✅ DEPLOYMENT READY!');
      console.log('🚀 Project is ready for GitHub Pages deployment');
      this.results.status = 'ready';
    } else if (score >= 60) {
      console.log('\n⚠️  DEPLOYMENT POSSIBLE WITH WARNINGS');
      console.log('🔧 Consider running auto-fix: npm run deploy:fix');
      this.results.status = 'warning';
    } else {
      console.log('\n❌ DEPLOYMENT BLOCKED');
      console.log('🔧 Run auto-fix: npm run deploy:fix');
      this.results.status = 'blocked';
    }
    
    console.log('\n' + '='.repeat(80));
    
    // Save report
    const reportPath = path.join(projectRoot, 'deployment-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      score,
      status: this.results.status,
      totalTime,
      ...this.results
    };
    
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log('info', 'REPORT', `Report saved to deployment-report.json`);
    
    return report;
  }

  // =============================================================================
  // MAIN EXECUTION
  // =============================================================================

  async run(mode = 'full') {
    this.log('deploy', 'START', `Running deployment manager in ${mode} mode...`);
    
    try {
      // Create tools directory if it doesn't exist
      const toolsDir = path.join(projectRoot, 'tools');
      if (!existsSync(toolsDir)) {
        mkdirSync(toolsDir);
      }
      
      if (mode === 'validate' || mode === 'full') {
        await this.validateEnvironment();
        await this.validateAstroConfig();
        await this.validateDependencies();
        await this.validateTypeScript();
        await this.validateBuild();
      }
      
      if (mode === 'fix' || (mode === 'full' && this.results.errors.length > 0)) {
        await this.autoFix();
        
        // Re-run validation after fixes
        if (mode === 'fix') {
          this.results = { errors: [], warnings: [], fixes: [], metrics: {}, status: 'unknown' };
          await this.run('validate');
        }
      }
      
      const report = await this.generateReport();
      
      return {
        success: this.results.status === 'ready',
        score: this.calculateScore(),
        report
      };
      
    } catch (error) {
      this.log('error', 'FATAL', `Deployment manager failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

// =============================================================================
// CLI INTERFACE
// =============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const mode = args.includes('--fix') ? 'fix' : 
               args.includes('--validate') ? 'validate' :
               args.includes('--test') ? 'validate' : 'full';
  
  const manager = new DeploymentManager();
  
  manager.run(mode).then(result => {
    process.exit(result.success ? 0 : 1);
  }).catch(error => {
    console.error('🔴 Deployment manager crashed:', error);
    process.exit(1);
  });
}

export default DeploymentManager;
