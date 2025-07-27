#!/usr/bin/env node

/**
 * GitHub Pages Deployment Verification
 * Comprehensive checks for successful deployment
 */

import { performance } from 'perf_hooks';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const startTime = performance.now();

class DeploymentChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checks = [];
  }

  log(level, message) {
    const emoji = {
      success: '✅',
      error: '❌', 
      warning: '⚠️',
      info: '🔵'
    }[level] || '📍';
    
    console.log(`${emoji} ${message}`);
  }

  addCheck(name, status, details = '') {
    this.checks.push({ name, status, details });
    this.log(status ? 'success' : 'error', `${name}${details ? ': ' + details : ''}`);
    
    if (!status) {
      this.errors.push({ name, details });
    }
  }

  async checkPackageConfig() {
    console.log('\n📦 Package Configuration Checks');
    console.log('================================');

    // Check package.json
    if (!existsSync('./package.json')) {
      this.addCheck('Package.json exists', false);
      return;
    }

    const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
    
    // Check essential scripts
    const requiredScripts = ['build', 'build:gh-pages'];
    for (const script of requiredScripts) {
      this.addCheck(
        `Script "${script}" exists`, 
        !!pkg.scripts?.[script],
        pkg.scripts?.[script] || 'Missing'
      );
    }

    // Check GitHub Pages build command
    const ghPagesCmd = pkg.scripts?.['build:gh-pages'];
    if (ghPagesCmd) {
      const hasCorrectSite = ghPagesCmd.includes('tariqdude.github.io');
      const hasCorrectBase = ghPagesCmd.includes('/WebsiteTest');
      
      this.addCheck('GitHub Pages site URL', hasCorrectSite);
      this.addCheck('GitHub Pages base path', hasCorrectBase);
    }
  }

  async checkAstroConfig() {
    console.log('\n⚙️ Astro Configuration Checks');
    console.log('===============================');

    const configFiles = ['astro.config.mjs', 'astro.config.js', 'astro.config.ts'];
    const configFile = configFiles.find(file => existsSync(file));
    
    if (!configFile) {
      this.addCheck('Astro config file exists', false);
      return;
    }

    const configContent = readFileSync(configFile, 'utf8');
    
    // Check for GitHub Pages configuration
    this.addCheck('Site URL configured', configContent.includes('tariqdude.github.io'));
    this.addCheck('Base path configured', configContent.includes('/WebsiteTest'));
    this.addCheck('Static output configured', configContent.includes("output: 'static'"));
    
    // Check framework integrations
    const frameworks = ['react', 'vue', 'svelte', 'solid-js', 'preact'];
    const configuredFrameworks = frameworks.filter(fw => configContent.includes(`@astrojs/${fw}`));
    
    this.addCheck(
      'Multi-framework setup', 
      configuredFrameworks.length > 0,
      `${configuredFrameworks.length} frameworks configured`
    );
  }

  async checkGitHubActions() {
    console.log('\n🚀 GitHub Actions Workflow Checks');
    console.log('===================================');

    const workflowPath = '.github/workflows/deploy.yml';
    if (!existsSync(workflowPath)) {
      this.addCheck('GitHub Actions workflow exists', false);
      return;
    }

    const workflowContent = readFileSync(workflowPath, 'utf8');
    
    // Check workflow configuration
    this.addCheck('Deploys on main branch', workflowContent.includes('branches: [ main ]'));
    this.addCheck('Has pages permissions', workflowContent.includes('pages: write'));
    this.addCheck('Uses Node.js 20', workflowContent.includes("node-version: '20'"));
    this.addCheck('Calls build:gh-pages', workflowContent.includes('build:gh-pages'));
    this.addCheck('Uses latest actions', workflowContent.includes('actions/upload-pages-artifact@v3'));
  }

  async checkFileStructure() {
    console.log('\n📁 File Structure Checks');
    console.log('==========================');

    const requiredPaths = [
      'src/pages',
      'src/components', 
      'src/layouts',
      'public'
    ];

    for (const reqPath of requiredPaths) {
      this.addCheck(`${reqPath} exists`, existsSync(reqPath));
    }

    // Check for showcase.astro specifically
    this.addCheck('Showcase page exists', existsSync('src/pages/showcase.astro'));
    
    // Check for framework components
    const frameworksPath = 'src/components/frameworks';
    if (existsSync(frameworksPath)) {
      const frameworks = readdirSync(frameworksPath).filter(item => 
        statSync(path.join(frameworksPath, item)).isDirectory()
      );
      
      this.addCheck(
        'Framework components organized', 
        frameworks.length > 0,
        `${frameworks.length} framework directories found`
      );
    }
  }

  async checkSyntaxErrors() {
    console.log('\n🔍 Syntax & Build Checks');
    console.log('==========================');

    // Check for syntax errors in showcase.astro
    try {
      const showcaseContent = readFileSync('src/pages/showcase.astro', 'utf8');
      
      // Basic HTML structure checks
      const openTags = (showcaseContent.match(/<section/g) || []).length;
      const closeTags = (showcaseContent.match(/<\/section>/g) || []).length;
      
      this.addCheck('HTML sections balanced', openTags === closeTags, `${openTags} open, ${closeTags} close`);
      
      // Check for common syntax issues
      const hasOrphanedTags = showcaseContent.includes('/>') && showcaseContent.includes('</div>');
      this.addCheck('No orphaned HTML tags', !showcaseContent.includes('\n        />'));
      
      // Check for proper imports
      const hasAllImports = showcaseContent.includes('FrameworkDemo') && 
                           showcaseContent.includes('EnhancedFallback');
      this.addCheck('All components imported', hasAllImports);
      
    } catch (error) {
      this.addCheck('Showcase file readable', false, error.message);
    }
  }

  async checkBuildProcess() {
    console.log('\n🏗️ Build Process Verification');
    console.log('===============================');

    try {
      // Test the build command
      console.log('Testing build process...');
      const { stdout, stderr } = await execAsync('npm run build:gh-pages', { timeout: 60000 });
      
      this.addCheck('Build completes successfully', !stderr || !stderr.includes('error'));
      
      // Check if dist folder is created
      this.addCheck('Dist folder created', existsSync('./dist'));
      
      // Check if index.html is created
      this.addCheck('Index.html generated', existsSync('./dist/index.html'));
      
      // Check if showcase.html is created  
      this.addCheck('Showcase.html generated', existsSync('./dist/showcase/index.html'));
      
    } catch (error) {
      this.addCheck('Build process', false, error.message);
    }
  }

  async checkAssetPaths() {
    console.log('\n🖼️ Asset Path Checks');
    console.log('======================');

    if (existsSync('./dist')) {
      // Check for common assets
      const distFiles = readdirSync('./dist');
      
      this.addCheck('Assets folder exists', distFiles.includes('_astro') || distFiles.includes('assets'));
      this.addCheck('Favicon included', existsSync('./dist/favicon.svg'));
      
      // Check for JavaScript bundles
      const hasJSBundles = distFiles.some(file => 
        file.includes('.js') || (existsSync(`./dist/${file}`) && 
        readdirSync(`./dist/${file}`).some(subFile => subFile.includes('.js')))
      );
      
      this.addCheck('JavaScript bundles generated', hasJSBundles);
    }
  }

  generateReport() {
    const totalTime = Math.round(performance.now() - startTime);
    const totalChecks = this.checks.length;
    const passedChecks = this.checks.filter(c => c.status).length;
    const failedChecks = totalChecks - passedChecks;
    
    console.log('\n📊 GitHub Pages Deployment Report');
    console.log('=====================================');
    console.log(`⏱️  Total Analysis Time: ${totalTime}ms`);
    console.log(`✅ Passed Checks: ${passedChecks}/${totalChecks}`);
    console.log(`❌ Failed Checks: ${failedChecks}`);
    
    if (failedChecks > 0) {
      console.log('\n🚨 Issues Preventing Deployment:');
      this.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.name}${error.details ? ': ' + error.details : ''}`);
      });
    }
    
    const deploymentReady = failedChecks === 0;
    const status = deploymentReady ? '🟢 READY FOR DEPLOYMENT' : '🔴 DEPLOYMENT ISSUES DETECTED';
    
    console.log(`\n${status}`);
    
    if (deploymentReady) {
      console.log('\n🎉 Your project is ready for GitHub Pages deployment!');
      console.log('💡 Push to main branch to trigger automatic deployment.');
    } else {
      console.log('\n🔧 Fix the issues above before deploying to GitHub Pages.');
    }
    
    return deploymentReady;
  }

  async runAllChecks() {
    this.log('info', 'Starting GitHub Pages deployment verification...');
    
    await this.checkPackageConfig();
    await this.checkAstroConfig();
    await this.checkGitHubActions();
    await this.checkFileStructure();
    await this.checkSyntaxErrors();
    await this.checkBuildProcess();
    await this.checkAssetPaths();
    
    return this.generateReport();
  }
}

// Run deployment checks
const checker = new DeploymentChecker();
checker.runAllChecks().catch(error => {
  console.error('🔴 Deployment check failed:', error.message);
  process.exit(1);
});
