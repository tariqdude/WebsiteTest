#!/usr/bin/env node

/**
 * Enhanced Project Diagnostics & Error Resolution
 * Comprehensive validation and automated fix suggestions
 */

import { performance } from 'perf_hooks';
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const startTime = performance.now();

class DiagnosticManager {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
    this.metrics = {};
    this.config = null;
  }

  log(level, category, message, timing = null) {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    const timeStr = timing ? `[${timing}ms]` : `[+${elapsed}s]`;
    const prefix = {
      error: '🔴 ERROR',
      warn: '🟡 WARN ',
      info: '🔵 INFO ',
      success: '🟢 OK   ',
      perf: '⚡ PERF '
    }[level] || '📍 LOG  ';
    
    console.log(`${prefix} [${category}] ${timeStr} ${message}`);
  }

  addError(category, message, fix = null) {
    this.errors.push({ category, message, fix });
    this.log('error', category, message);
    if (fix) this.fixes.push(fix);
  }

  addWarning(category, message, suggestion = null) {
    this.warnings.push({ category, message, suggestion });
    this.log('warn', category, message);
    if (suggestion) this.fixes.push(suggestion);
  }

  async validatePackageJson() {
    this.log('info', 'PACKAGE', 'Validating package.json structure and dependencies...');
    
    if (!existsSync('./package.json')) {
      this.addError('PACKAGE', 'package.json not found', 'Run npm init to create package.json');
      return;
    }

    try {
      const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Check for essential Astro dependencies
      const essentialDeps = ['astro', '@astrojs/check', 'typescript'];
      for (const dep of essentialDeps) {
        if (!deps[dep]) {
          this.addError('PACKAGE', `Missing essential dependency: ${dep}`, `npm install ${dep}`);
        }
      }

      // Check for multiple framework versions
      const frameworks = ['react', 'vue', 'svelte', 'solid-js', 'preact'];
      const usedFrameworks = frameworks.filter(fw => 
        deps[`@astrojs/${fw}`] || deps[fw] || deps[`${fw}-dom`]
      );

      if (usedFrameworks.length > 3) {
        this.addWarning('PACKAGE', `Many frameworks detected (${usedFrameworks.length}): ${usedFrameworks.join(', ')}`, 
          'Consider optimizing bundle size by using fewer frameworks');
      }

      // Check for conflicting versions
      if (deps['react'] && deps['preact']) {
        this.addWarning('PACKAGE', 'React and Preact both present - may cause conflicts',
          'Use Preact/compat alias or remove one framework');
      }

      this.metrics.dependencies = Object.keys(deps).length;
      this.metrics.frameworks = usedFrameworks.length;
      this.log('info', 'PACKAGE', `Analyzed ${this.metrics.dependencies} dependencies, ${this.metrics.frameworks} frameworks`);

    } catch (error) {
      this.addError('PACKAGE', `Invalid package.json: ${error.message}`, 'Validate JSON syntax');
    }
  }

  async validateAstroConfig() {
    this.log('info', 'CONFIG', 'Validating Astro configuration...');
    
    const configFiles = ['astro.config.mjs', 'astro.config.js', 'astro.config.ts'];
    const configFile = configFiles.find(file => existsSync(file));
    
    if (!configFile) {
      this.addError('CONFIG', 'No Astro config file found', 'Create astro.config.mjs');
      return;
    }

    try {
      // Basic validation - check if file can be read
      const configContent = readFileSync(configFile, 'utf8');
      
      // Check for common patterns
      if (!configContent.includes('export default')) {
        this.addError('CONFIG', 'Config file missing default export', 'Add export default defineConfig({...})');
      }

      // Check for framework integrations
      const hasReact = configContent.includes('@astrojs/react');
      const hasVue = configContent.includes('@astrojs/vue');
      const hasSvelte = configContent.includes('@astrojs/svelte');
      
      if (hasVue && !configContent.includes('exclude')) {
        this.addWarning('CONFIG', 'Vue integration without exclude patterns', 
          'Add exclude: ["**/server.js"] to Vue config');
      }

      this.log('info', 'CONFIG', `Configuration file ${configFile} validated`);
      this.config = { file: configFile, hasReact, hasVue, hasSvelte };

    } catch (error) {
      this.addError('CONFIG', `Config validation failed: ${error.message}`, 'Check config syntax');
    }
  }

  async validateTypeScript() {
    this.log('info', 'TYPESCRIPT', 'Validating TypeScript configuration...');
    
    if (!existsSync('./tsconfig.json')) {
      this.addWarning('TYPESCRIPT', 'tsconfig.json not found', 'Run npx astro add typescript');
      return;
    }

    try {
      const { stdout, stderr } = await execAsync('npx tsc --noEmit --skipLibCheck', { timeout: 30000 });
      if (stderr && !stderr.includes('warning')) {
        this.addError('TYPESCRIPT', 'TypeScript compilation errors', 'Fix TypeScript errors before building');
      } else {
        this.log('success', 'TYPESCRIPT', 'TypeScript validation passed');
      }
    } catch (error) {
      this.addWarning('TYPESCRIPT', `TypeScript check failed: ${error.message}`, 
        'Run npx tsc --noEmit to see detailed errors');
    }
  }

  validateProjectStructure() {
    this.log('info', 'STRUCTURE', 'Validating project structure...');
    
    const requiredDirs = ['src', 'src/pages', 'src/components'];
    const optionalDirs = ['src/layouts', 'src/content', 'src/lib', 'public'];
    
    for (const dir of requiredDirs) {
      if (!existsSync(dir)) {
        this.addError('STRUCTURE', `Missing required directory: ${dir}`, `Create directory: mkdir -p ${dir}`);
      }
    }

    // Check for framework component organization
    const frameworksDir = 'src/components/frameworks';
    if (existsSync(frameworksDir)) {
      const frameworks = readdirSync(frameworksDir).filter(item => 
        statSync(path.join(frameworksDir, item)).isDirectory()
      );
      this.log('info', 'STRUCTURE', `Found ${frameworks.length} framework directories: ${frameworks.join(', ')}`);
      
      // Validate each framework has components
      for (const fw of frameworks) {
        const fwPath = path.join(frameworksDir, fw);
        const files = readdirSync(fwPath).filter(file => 
          file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.vue') || file.endsWith('.svelte')
        );
        
        if (files.length === 0) {
          this.addWarning('STRUCTURE', `Framework directory ${fw} has no components`, 
            `Add components to ${fwPath} or remove empty directory`);
        }
      }
    }

    this.log('success', 'STRUCTURE', 'Project structure validation completed');
  }

  async validateBuild() {
    this.log('info', 'BUILD', 'Testing build process...');
    
    try {
      const buildStart = performance.now();
      const { stdout, stderr } = await execAsync('npm run build 2>&1', { timeout: 120000 });
      const buildTime = performance.now() - buildStart;
      
      if (stderr && stderr.includes('error')) {
        this.addError('BUILD', 'Build process failed', 'Check build output for specific errors');
      } else {
        this.log('success', 'BUILD', `Build completed successfully`, Math.round(buildTime));
        this.metrics.buildTime = Math.round(buildTime);
      }
    } catch (error) {
      this.addError('BUILD', `Build failed: ${error.message}`, 'Check dependencies and configuration');
    }
  }

  countProjectFiles() {
    const countFiles = (dir, extensions = []) => {
      let count = 0;
      try {
        const items = readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          if (statSync(fullPath).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            count += countFiles(fullPath, extensions);
          } else if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
            count++;
          }
        }
      } catch (e) {
        // Ignore errors
      }
      return count;
    };

    this.metrics.totalFiles = countFiles('./src');
    this.metrics.astroFiles = countFiles('./src', ['.astro']);
    this.metrics.tsFiles = countFiles('./src', ['.ts', '.tsx']);
    this.metrics.jsFiles = countFiles('./src', ['.js', '.jsx']);
    this.metrics.vueFiles = countFiles('./src', ['.vue']);
    this.metrics.svelteFiles = countFiles('./src', ['.svelte']);
  }

  generateFixScript() {
    if (this.fixes.length === 0) return;

    const script = `#!/bin/bash
# Auto-generated fix script
# Run this script to apply suggested fixes

echo "🔧 Applying automated fixes..."

${this.fixes.map(fix => `echo "Applying: ${fix}"
${fix}`).join('\n\n')}

echo "✅ All fixes applied!"
`;

    writeFileSync('./auto-fix.sh', script);
    this.log('info', 'FIXES', `Generated auto-fix script with ${this.fixes.length} fixes`);
  }

  printSummary() {
    const totalTime = performance.now() - startTime;
    
    console.log('\n📊 Enhanced Diagnostic Report');
    console.log('═══════════════════════════════════════════════════');
    console.log(`🕒 Total Analysis Time: ${Math.round(totalTime)}ms`);
    console.log(`📁 Files Analyzed: ${this.metrics.totalFiles || 'N/A'}`);
    console.log(`🏗️  Build Time: ${this.metrics.buildTime ? this.metrics.buildTime + 'ms' : 'N/A'}`);
    console.log(`🧩 Frameworks: ${this.metrics.frameworks || 0}`);
    console.log(`📦 Dependencies: ${this.metrics.dependencies || 0}`);
    
    console.log('\n📈 File Breakdown:');
    console.log(`  • Astro files: ${this.metrics.astroFiles || 0}`);
    console.log(`  • TypeScript files: ${this.metrics.tsFiles || 0}`);
    console.log(`  • JavaScript files: ${this.metrics.jsFiles || 0}`);
    console.log(`  • Vue files: ${this.metrics.vueFiles || 0}`);
    console.log(`  • Svelte files: ${this.metrics.svelteFiles || 0}`);
    
    console.log('\n🚨 Issues Found:');
    console.log(`  • Errors: ${this.errors.length}`);
    console.log(`  • Warnings: ${this.warnings.length}`);
    console.log(`  • Suggested Fixes: ${this.fixes.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔴 Critical Errors:');
      this.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. [${error.category}] ${error.message}`);
        if (error.fix) console.log(`     💡 Fix: ${error.fix}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log('\n🟡 Warnings:');
      this.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. [${warning.category}] ${warning.message}`);
        if (warning.suggestion) console.log(`     💡 Suggestion: ${warning.suggestion}`);
      });
    }
    
    const status = this.errors.length === 0 ? '✅ PASSED' : '❌ FAILED';
    const statusColor = this.errors.length === 0 ? '🟢' : '🔴';
    console.log(`\n${statusColor} Overall Status: ${status}`);
    
    if (this.fixes.length > 0) {
      console.log('\n🔧 Run ./auto-fix.sh to apply automated fixes');
    }
  }

  async runFullDiagnostics() {
    this.log('info', 'DIAGNOSTICS', 'Starting enhanced project diagnostics...');
    
    // Run all validations
    await this.validatePackageJson();
    await this.validateAstroConfig();
    this.validateProjectStructure();
    this.countProjectFiles();
    await this.validateTypeScript();
    await this.validateBuild();
    
    // Generate fixes and summary
    this.generateFixScript();
    this.printSummary();
    
    return {
      errors: this.errors.length,
      warnings: this.warnings.length,
      fixes: this.fixes.length,
      metrics: this.metrics
    };
  }
}

// Run diagnostics
const diagnostics = new DiagnosticManager();
diagnostics.runFullDiagnostics().catch(error => {
  console.error('🔴 ERROR [DIAGNOSTICS] Fatal error:', error.message);
  process.exit(1);
});
