#!/usr/bin/env node

/**
 * 🧪 Quick Build Tester
 * Fast pre-deployment validation for development workflow
 */

import { performance } from 'perf_hooks';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, statSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const startTime = performance.now();

class QuickTester {
  constructor() {
    this.results = { passed: 0, failed: 0, warnings: 0 };
  }

  log(level, message) {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
    const icons = { success: '✅', error: '❌', warn: '⚠️', info: '🔵' };
    console.log(`${icons[level]} [+${elapsed}s] ${message}`);
  }

  async test(name, testFn) {
    try {
      const result = await testFn();
      if (result === true) {
        this.results.passed++;
        this.log('success', name);
      } else if (result === 'warn') {
        this.results.warnings++;
        this.log('warn', name);
      } else {
        this.results.failed++;
        this.log('error', name);
      }
    } catch (error) {
      this.results.failed++;
      this.log('error', `${name}: ${error.message}`);
    }
  }

  async run() {
    console.log('🧪 Quick Build Test Starting...\n');

    await this.test('Environment Check', async () => {
      await execAsync('node --version');
      await execAsync('npm --version');
      return true;
    });

    await this.test('Dependencies Check', async () => {
      if (!existsSync('node_modules')) {
        await execAsync('npm ci --no-audit');
      }
      return true;
    });

    await this.test('TypeScript Check', async () => {
      try {
        await execAsync('npx astro check', { timeout: 30000 });
        return true;
      } catch (error) {
        if (error.stdout && !error.stdout.includes('error')) {
          return 'warn';
        }
        throw error;
      }
    });

    await this.test('Build Test', async () => {
      const buildStart = performance.now();
      await execAsync('npm run build:gh-pages', { 
        timeout: 120000,
        env: { ...process.env, NODE_ENV: 'production' }
      });
      
      const buildTime = (performance.now() - buildStart) / 1000;
      
      if (!existsSync('dist/index.html')) {
        throw new Error('No index.html generated');
      }
      
      const files = this.countFiles('dist');
      if (files < 5) {
        return 'warn';
      }
      
      this.log('info', `Build completed in ${buildTime.toFixed(1)}s, ${files} files generated`);
      return true;
    });

    // Results
    const total = this.results.passed + this.results.failed + this.results.warnings;
    const totalTime = (performance.now() - startTime) / 1000;
    
    console.log('\n' + '='.repeat(50));
    console.log(`🧪 Quick Test Results (${totalTime.toFixed(1)}s)`);
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${this.results.passed}/${total}`);
    console.log(`❌ Failed: ${this.results.failed}/${total}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}/${total}`);
    
    if (this.results.failed === 0) {
      console.log('\n🚀 Quick test PASSED - Ready for deployment!');
      process.exit(0);
    } else {
      console.log('\n🔧 Quick test FAILED - Run npm run deploy:fix');
      process.exit(1);
    }
  }

  countFiles(dir, count = 0) {
    try {
      const fs = require('fs');
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
          count = this.countFiles(filePath, count);
        } else {
          count++;
        }
      }
    } catch (error) {
      // Ignore errors
    }
    return count;
  }
}

new QuickTester().run().catch(console.error);
