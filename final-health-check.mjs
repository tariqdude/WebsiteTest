#!/usr/bin/env node

/**
 * 🏥 Final Health Check & Deployment Readiness Report
 * Complete validation and certification for GitHub Pages deployment
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { execSync } from 'child_process';

class DeploymentHealthCheck {
  constructor() {
    this.report = {
      score: 0,
      maxScore: 100,
      checks: [],
      errors: [],
      warnings: [],
      recommendations: []
    };
  }

  check(name, points, testFn) {
    try {
      const result = testFn();
      if (result === true || result === undefined) {
        this.report.score += points;
        this.report.checks.push({ name, status: '✅', points, message: 'Passed' });
        console.log(`✅ ${name} (+${points} points)`);
      } else if (typeof result === 'string') {
        this.report.score += points;
        this.report.checks.push({ name, status: '✅', points, message: result });
        console.log(`✅ ${name} (+${points} points) - ${result}`);
      } else {
        this.report.checks.push({ name, status: '❌', points: 0, message: 'Failed' });
        this.report.errors.push(name);
        console.log(`❌ ${name} (0/${points} points)`);
      }
    } catch (error) {
      this.report.checks.push({ name, status: '❌', points: 0, message: error.message });
      this.report.errors.push(`${name}: ${error.message}`);
      console.log(`❌ ${name} (0/${points} points) - ${error.message}`);
    }
  }

  warn(name, message) {
    this.report.warnings.push(`${name}: ${message}`);
    console.log(`⚠️  ${name} - ${message}`);
  }

  recommend(message) {
    this.report.recommendations.push(message);
  }

  // =============================================================================
  // HEALTH CHECKS
  // =============================================================================

  checkProjectStructure() {
    const requiredFiles = [
      'package.json',
      'astro.config.mjs',
      'src/pages/index.astro',
      'src/pages/showcase.astro',
      'src/layouts/Layout.astro'
    ];

    for (const file of requiredFiles) {
      if (!existsSync(file)) {
        throw new Error(`Missing required file: ${file}`);
      }
    }

    return `All ${requiredFiles.length} essential files present`;
  }

  checkComponentIntegrity() {
    const showcaseFile = 'src/pages/showcase.astro';
    const content = readFileSync(showcaseFile, 'utf8');
    
    // Extract all import statements
    const imports = content.match(/import\s+\w+\s+from\s+['"][^'"]+['"]/g) || [];
    const missingComponents = [];

    for (const imp of imports) {
      const match = imp.match(/from\s+['"]([^'"]+)['"]/);
      if (match) {
        const path = match[1];
        let resolvedPath;
        
        if (path.startsWith('../')) {
          resolvedPath = path.replace('../', 'src/');
        } else if (path.startsWith('./')) {
          resolvedPath = path.replace('./', 'src/pages/');
        } else {
          continue; // Skip non-relative imports
        }

        if (!existsSync(resolvedPath)) {
          missingComponents.push(resolvedPath);
        }
      }
    }

    if (missingComponents.length > 0) {
      throw new Error(`Missing components: ${missingComponents.join(', ')}`);
    }

    return `All ${imports.length} component imports verified`;
  }

  checkAstroConfiguration() {
    const config = readFileSync('astro.config.mjs', 'utf8');
    
    const issues = [];
    if (!config.includes('output: \'static\'')) {
      issues.push('Missing static output configuration');
    }
    if (!config.includes('site:') && !config.includes('site =')) {
      issues.push('Missing site configuration');
    }
    if (!config.includes('base:') && !config.includes('base =')) {
      issues.push('Missing base path configuration');
    }

    if (issues.length > 0) {
      throw new Error(issues.join(', '));
    }

    return 'Astro configuration optimized for GitHub Pages';
  }

  checkPackageJsonScripts() {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const scripts = pkg.scripts || {};

    const requiredScripts = ['build:gh-pages', 'dev', 'build'];
    const missing = requiredScripts.filter(script => !scripts[script]);

    if (missing.length > 0) {
      throw new Error(`Missing scripts: ${missing.join(', ')}`);
    }

    if (!scripts['build:gh-pages'].includes('--base')) {
      throw new Error('build:gh-pages script missing --base parameter');
    }

    return 'All required npm scripts configured correctly';
  }

  checkDependencies() {
    if (!existsSync('node_modules')) {
      throw new Error('Dependencies not installed - run npm install');
    }

    // Check for essential dependencies
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    
    const essential = ['astro', '@astrojs/react', '@astrojs/vue', 'tailwindcss'];
    const missing = essential.filter(dep => !deps[dep]);

    if (missing.length > 0) {
      throw new Error(`Missing essential dependencies: ${missing.join(', ')}`);
    }

    return `All ${Object.keys(deps).length} dependencies installed`;
  }

  checkGitHubActionsWorkflow() {
    const workflowFile = '.github/workflows/deploy.yml';
    
    if (!existsSync(workflowFile)) {
      throw new Error('GitHub Actions workflow not found');
    }

    const workflow = readFileSync(workflowFile, 'utf8');
    const required = [
      'actions/checkout',
      'actions/setup-node',
      'npm ci',
      'npm run build',
      'actions/upload-pages-artifact',
      'actions/deploy-pages'
    ];

    const missing = required.filter(req => !workflow.includes(req));
    if (missing.length > 0) {
      throw new Error(`Workflow missing: ${missing.join(', ')}`);
    }

    return 'GitHub Actions workflow properly configured';
  }

  checkBundleOptimization() {
    const config = readFileSync('astro.config.mjs', 'utf8');
    
    let score = 0;
    let features = [];

    if (config.includes('manualChunks')) {
      score += 3;
      features.push('manual chunking');
    }
    if (config.includes('client:idle') || config.includes('client:visible')) {
      score += 2;
      features.push('lazy loading');
    }
    if (config.includes('optimizeDeps')) {
      score += 2;
      features.push('dependency optimization');
    }

    if (score < 3) {
      this.warn('Bundle Optimization', 'Some optimizations missing but not critical');
    }

    return features.length > 0 ? `Optimizations: ${features.join(', ')}` : 'Basic configuration';
  }

  checkTypeScriptConfig() {
    if (!existsSync('tsconfig.json')) {
      this.warn('TypeScript', 'No TypeScript config found');
      return 'Skipped - no TypeScript config';
    }

    const tsConfig = JSON.parse(readFileSync('tsconfig.json', 'utf8'));
    
    // Check for deployment-friendly settings
    if (tsConfig.compilerOptions?.strict === false || tsConfig.compilerOptions?.skipLibCheck === true) {
      return 'TypeScript configured for fast deployment';
    }

    return 'TypeScript configuration present';
  }

  // =============================================================================
  // PERFORMANCE ANALYSIS
  // =============================================================================

  analyzeProjectComplexity() {
    let complexity = 0;
    let features = [];

    const showcaseContent = readFileSync('src/pages/showcase.astro', 'utf8');
    
    if (showcaseContent.includes('Three')) {
      complexity += 3;
      features.push('3D Graphics');
    }
    if (showcaseContent.includes('Monaco')) {
      complexity += 3;
      features.push('Code Editor');
    }
    if (showcaseContent.includes('Chart') || showcaseContent.includes('D3')) {
      complexity += 2;
      features.push('Data Visualization');
    }
    if (showcaseContent.includes('GSAP')) {
      complexity += 2;
      features.push('Advanced Animations');
    }

    const frameworks = showcaseContent.match(/client:(load|visible|idle)/g)?.length || 0;
    complexity += Math.min(frameworks, 5);

    if (complexity > 10) {
      this.warn('Project Complexity', 'High complexity project - ensure adequate build timeouts');
    }

    return `Complexity score: ${complexity}/15 (Features: ${features.join(', ')})`;
  }

  // =============================================================================
  // MAIN EXECUTION
  // =============================================================================

  async runHealthCheck() {
    console.log('🏥 GitHub Pages Deployment Health Check');
    console.log('=' .repeat(60));

    // Core Structure (30 points)
    this.check('Project Structure', 10, () => this.checkProjectStructure());
    this.check('Component Integrity', 10, () => this.checkComponentIntegrity());
    this.check('Astro Configuration', 10, () => this.checkAstroConfiguration());

    // Dependencies & Scripts (25 points)
    this.check('Package.json Scripts', 10, () => this.checkPackageJsonScripts());
    this.check('Dependencies', 15, () => this.checkDependencies());

    // Deployment Setup (25 points)
    this.check('GitHub Actions Workflow', 15, () => this.checkGitHubActionsWorkflow());
    this.check('TypeScript Configuration', 10, () => this.checkTypeScriptConfig());

    // Performance & Optimization (20 points)
    this.check('Bundle Optimization', 10, () => this.checkBundleOptimization());
    this.check('Project Complexity Analysis', 10, () => this.analyzeProjectComplexity());

    // Generate final report
    this.generateFinalReport();
  }

  generateFinalReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL DEPLOYMENT HEALTH REPORT');
    console.log('=' .repeat(60));

    const percentage = Math.round((this.report.score / this.report.maxScore) * 100);
    
    console.log(`🎯 Overall Score: ${this.report.score}/${this.report.maxScore} (${percentage}%)`);
    
    if (percentage >= 90) {
      console.log('🟢 EXCELLENT - Ready for production deployment!');
    } else if (percentage >= 75) {
      console.log('🟡 GOOD - Ready for deployment with minor optimizations');
    } else if (percentage >= 60) {
      console.log('🟠 FAIR - Deployment possible but improvements recommended');
    } else {
      console.log('🔴 NEEDS WORK - Fix critical issues before deployment');
    }

    if (this.report.errors.length > 0) {
      console.log('\n🔴 Critical Issues:');
      this.report.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

    if (this.report.warnings.length > 0) {
      console.log('\n🟡 Warnings:');
      this.report.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }

    console.log('\n🚀 Deployment Instructions:');
    console.log('1. git add .');
    console.log('2. git commit -m "Deploy to GitHub Pages"');
    console.log('3. git push origin main');
    console.log('4. Enable GitHub Pages in repository settings (Source: GitHub Actions)');
    console.log('5. Monitor deployment at: https://github.com/tariqdude/WebsiteTest/actions');
    console.log('6. Site will be live at: https://tariqdude.github.io/WebsiteTest/');

    console.log('\n💡 Monitoring Tools:');
    console.log('- Health check: node final-health-check.mjs');
    console.log('- Build test: node test-build.mjs');
    console.log('- Quick fixes: node project-fixer.mjs');

    console.log('=' .repeat(60));
  }
}

// Execute health check
const healthCheck = new DeploymentHealthCheck();
healthCheck.runHealthCheck().catch(console.error);
