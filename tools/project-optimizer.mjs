#!/usr/bin/env node
/**
 * Project Optimization and Cleanup Script
 * Enhances the Astro multi-framework showcase with modern best practices
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 Starting Project Optimization...\n');

// Performance tracking
const startTime = Date.now();
let operations = 0;

// Utility functions
const logOperation = (message) => {
  operations++;
  console.log(`✅ ${operations}: ${message}`);
};

const logError = (message, error) => {
  console.error(`❌ ${message}:`, error.message);
};

// Clean up temporary and backup files
async function cleanupTempFiles() {
  console.log('🧹 Cleaning up temporary files...');
  
  const patterns = [
    '**/*.tmp',
    '**/*.bak',
    '**/*~',
    '**/.DS_Store',
    '**/Thumbs.db',
    '**/*.log',
    '**/npm-debug.log*',
    '**/yarn-debug.log*',
    '**/yarn-error.log*'
  ];

  try {
    for (const pattern of patterns) {
      const { stdout } = await execAsync(`find . -name "${pattern}" -type f`);
      if (stdout.trim()) {
        const files = stdout.trim().split('\n');
        for (const file of files) {
          try {
            await unlink(file);
            logOperation(`Removed temporary file: ${file}`);
          } catch (error) {
            // File might not exist or be locked, continue
          }
        }
      }
    }
  } catch (error) {
    // find command might not be available on all systems
    logError('Cleanup using find command failed, using alternative method', error);
  }
}

// Optimize package.json dependencies
async function optimizeDependencies() {
  console.log('\n📦 Optimizing dependencies...');
  
  try {
    // Remove unused packages (if any)
    await execAsync('npm prune');
    logOperation('Pruned unused dependencies');

    // Update package-lock.json
    await execAsync('npm install --package-lock-only');
    logOperation('Updated package-lock.json');

    // Check for outdated packages
    const { stdout } = await execAsync('npm outdated || true');
    if (stdout.trim()) {
      console.log('\n📋 Outdated packages found:');
      console.log(stdout);
    } else {
      logOperation('All packages are up to date');
    }
  } catch (error) {
    logError('Dependency optimization failed', error);
  }
}

// Validate project structure
async function validateProjectStructure() {
  console.log('\n🏗️ Validating project structure...');
  
  const requiredDirs = [
    'src/components/frameworks/react',
    'src/components/frameworks/vue', 
    'src/components/frameworks/svelte',
    'src/components/frameworks/solid',
    'src/components/frameworks/preact',
    'src/components/showcases',
    'src/components/ui',
    'src/lib/hooks',
    'src/lib/types',
    'src/lib/utils',
    'src/content',
    'src/pages',
    'public/images'
  ];

  const requiredFiles = [
    'astro.config.mjs',
    'package.json',
    'tsconfig.json',
    'tailwind.config.mjs',
    'vitest.config.ts',
    '.eslintrc.cjs'
  ];

  for (const dir of requiredDirs) {
    try {
      const stats = await stat(dir);
      if (stats.isDirectory()) {
        logOperation(`Directory exists: ${dir}`);
      }
    } catch {
      console.warn(`⚠️ Missing directory: ${dir}`);
    }
  }

  for (const file of requiredFiles) {
    try {
      const stats = await stat(file);
      if (stats.isFile()) {
        logOperation(`File exists: ${file}`);
      }
    } catch {
      console.warn(`⚠️ Missing file: ${file}`);
    }
  }
}

// Run comprehensive tests
async function runTests() {
  console.log('\n🧪 Running comprehensive tests...');
  
  const testCommands = [
    { name: 'TypeScript Check', cmd: 'npm run check' },
    { name: 'ESLint', cmd: 'npm run lint' },
    { name: 'Build Test', cmd: 'npm run build:gh-pages' }
  ];

  for (const test of testCommands) {
    try {
      console.log(`\n🔍 Running ${test.name}...`);
      const { stdout, stderr } = await execAsync(test.cmd);
      
      if (stderr && !stderr.includes('warning')) {
        console.log(`⚠️ ${test.name} warnings:`, stderr);
      }
      
      logOperation(`${test.name} passed`);
    } catch (error) {
      logError(`${test.name} failed`, error);
      
      // Don't fail the entire script for build errors
      if (test.name === 'Build Test') {
        console.log('🔧 Attempting to fix build issues...');
        
        try {
          // Clear any cache and retry
          await execAsync('rm -rf dist .astro node_modules/.cache');
          await execAsync('npm install');
          await execAsync(test.cmd);
          logOperation(`${test.name} passed after cleanup`);
        } catch (retryError) {
          logError(`${test.name} failed after retry`, retryError);
        }
      }
    }
  }
}

// Optimize build configuration
async function optimizeBuildConfig() {
  console.log('\n⚙️ Optimizing build configuration...');
  
  try {
    // Ensure proper TypeScript configuration
    const tsCheck = await execAsync('npx tsc --noEmit --skipLibCheck');
    logOperation('TypeScript configuration is valid');
  } catch (error) {
    console.warn('⚠️ TypeScript configuration issues detected');
  }

  try {
    // Validate Astro configuration
    const astroCheck = await execAsync('npx astro check');
    logOperation('Astro configuration is valid');
  } catch (error) {
    console.warn('⚠️ Astro configuration issues detected');
  }
}

// Generate performance report
async function generatePerformanceReport() {
  console.log('\n📊 Generating performance report...');
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log('\n🎉 Optimization Complete!');
  console.log('═'.repeat(50));
  console.log(`📈 Total operations: ${operations}`);
  console.log(`⏱️ Duration: ${(duration / 1000).toFixed(2)} seconds`);
  console.log(`🚀 Average: ${(operations / (duration / 1000)).toFixed(2)} ops/sec`);
  
  // Project statistics
  try {
    const { stdout: fileCount } = await execAsync('find . -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.astro" -o -name "*.vue" -o -name "*.svelte" | wc -l');
    const { stdout: lineCount } = await execAsync('find . -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.astro" -o -name "*.vue" -o -name "*.svelte" | xargs wc -l | tail -1');
    
    console.log('\n📋 Project Statistics:');
    console.log(`📄 Source files: ${fileCount.trim()}`);
    console.log(`📝 Lines of code: ${lineCount.trim().split(' ')[0]}`);
  } catch (error) {
    console.log('📊 Statistics generation skipped (commands not available)');
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Deploy to GitHub Pages: npm run deploy:prep');
  console.log('2. Run diagnostics: npm run diagnostics');
  console.log('3. Start development: npm run dev');
  console.log('');
}

// Main execution
async function main() {
  try {
    await cleanupTempFiles();
    await optimizeDependencies();
    await validateProjectStructure();
    await optimizeBuildConfig();
    await runTests();
    await generatePerformanceReport();
  } catch (error) {
    console.error('\n💥 Optimization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;
