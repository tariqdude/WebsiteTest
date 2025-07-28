#!/usr/bin/env node

/**
 * 📊 Deployment Status Dashboard
 * Real-time deployment status and project health monitoring
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

class StatusDashboard {
  constructor() {
    this.status = {
      overall: 'unknown',
      environment: 'unknown',
      dependencies: 'unknown',
      build: 'unknown',
      deployment: 'unknown',
    };
  }

  async checkEnvironment() {
    try {
      const { stdout: nodeVersion } = await execAsync('node --version');
      const version = parseInt(nodeVersion.slice(1).split('.')[0]);

      this.status.environment = version >= 18 ? 'good' : 'poor';
      return {
        nodeVersion: nodeVersion.trim(),
        status: this.status.environment,
        message:
          version >= 18
            ? 'Node.js version compatible'
            : 'Node.js version too old',
      };
    } catch (error) {
      this.status.environment = 'error';
      return { status: 'error', message: error.message };
    }
  }

  async checkDependencies() {
    try {
      if (!existsSync('node_modules')) {
        this.status.dependencies = 'missing';
        return { status: 'missing', message: 'node_modules not found' };
      }

      if (!existsSync('package-lock.json')) {
        this.status.dependencies = 'warning';
        return { status: 'warning', message: 'package-lock.json missing' };
      }

      this.status.dependencies = 'good';
      return { status: 'good', message: 'Dependencies installed' };
    } catch (error) {
      this.status.dependencies = 'error';
      return { status: 'error', message: error.message };
    }
  }

  async checkBuild() {
    try {
      if (!existsSync('dist')) {
        this.status.build = 'missing';
        return { status: 'missing', message: 'No build output found' };
      }

      const files = this.countDistFiles();
      const hasIndex = existsSync('dist/index.html');
      const hasAssets = existsSync('dist/_astro');

      if (!hasIndex) {
        this.status.build = 'poor';
        return { status: 'poor', message: 'Missing index.html' };
      }

      if (!hasAssets) {
        this.status.build = 'warning';
        return { status: 'warning', message: 'Missing assets directory' };
      }

      this.status.build = files > 10 ? 'good' : 'warning';
      return {
        status: this.status.build,
        message: `Build found with ${files} files`,
        fileCount: files,
      };
    } catch (error) {
      this.status.build = 'error';
      return { status: 'error', message: error.message };
    }
  }

  async checkDeployment() {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const hasScript = packageJson.scripts['build:gh-pages'];

      if (!hasScript) {
        this.status.deployment = 'poor';
        return { status: 'poor', message: 'Missing GitHub Pages build script' };
      }

      const configExists = existsSync('astro.config.mjs');
      if (!configExists) {
        this.status.deployment = 'poor';
        return { status: 'poor', message: 'Missing Astro config' };
      }

      const workflowExists = existsSync('.github/workflows/deploy.yml');
      if (!workflowExists) {
        this.status.deployment = 'warning';
        return {
          status: 'warning',
          message: 'Missing GitHub Actions workflow',
        };
      }

      this.status.deployment = 'good';
      return { status: 'good', message: 'Deployment configuration ready' };
    } catch (error) {
      this.status.deployment = 'error';
      return { status: 'error', message: error.message };
    }
  }

  countDistFiles() {
    let count = 0;
    const countRecursive = (dir) => {
      try {
        const fs = require('fs');
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = statSync(filePath);
          if (stat.isDirectory()) {
            countRecursive(filePath);
          } else {
            count++;
          }
        }
      } catch (error) {
        // Ignore errors
      }
    };

    countRecursive('dist');
    return count;
  }

  getStatusIcon(status) {
    const icons = {
      good: '🟢',
      warning: '🟡',
      poor: '🔴',
      error: '❌',
      missing: '⚪',
      unknown: '❓',
    };
    return icons[status] || '❓';
  }

  calculateOverallStatus() {
    const statuses = Object.values(this.status);

    if (statuses.includes('error') || statuses.includes('poor')) {
      this.status.overall = 'poor';
    } else if (statuses.includes('warning') || statuses.includes('missing')) {
      this.status.overall = 'warning';
    } else if (statuses.every((s) => s === 'good')) {
      this.status.overall = 'good';
    } else {
      this.status.overall = 'unknown';
    }
  }

  async run() {
    console.log('📊 Deployment Status Dashboard');
    console.log('='.repeat(40));

    const checks = [
      { name: 'Environment', fn: () => this.checkEnvironment() },
      { name: 'Dependencies', fn: () => this.checkDependencies() },
      { name: 'Build Output', fn: () => this.checkBuild() },
      { name: 'Deployment Config', fn: () => this.checkDeployment() },
    ];

    const results = {};

    for (const check of checks) {
      try {
        const result = await check.fn();
        results[check.name] = result;
        console.log(
          `${this.getStatusIcon(result.status)} ${check.name}: ${result.message}`
        );
      } catch (error) {
        results[check.name] = { status: 'error', message: error.message };
        console.log(`❌ ${check.name}: ${error.message}`);
      }
    }

    this.calculateOverallStatus();

    console.log('\n' + '='.repeat(40));
    console.log(
      `${this.getStatusIcon(this.status.overall)} Overall Status: ${this.status.overall.toUpperCase()}`
    );

    // Recommendations
    console.log('\n💡 Recommendations:');

    if (this.status.environment !== 'good') {
      console.log('   • Update Node.js to version 18 or higher');
    }

    if (this.status.dependencies !== 'good') {
      console.log('   • Run: npm ci');
    }

    if (this.status.build !== 'good') {
      console.log('   • Run: npm run build:gh-pages');
    }

    if (this.status.deployment !== 'good') {
      console.log('   • Run: npm run deploy:fix');
    }

    if (this.status.overall === 'good') {
      console.log('   🚀 Ready for deployment!');
      console.log('   • Commit changes and push to main branch');
    }

    console.log('\n📋 Quick Commands:');
    console.log('   npm run deploy:validate  - Full validation');
    console.log('   npm run deploy:fix       - Auto-fix issues');
    console.log('   npm run deploy:test      - Quick test');

    return {
      status: this.status.overall,
      details: results,
      ready: this.status.overall === 'good',
    };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  new StatusDashboard()
    .run()
    .then((result) => {
      process.exit(result.ready ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Status check failed:', error);
      process.exit(1);
    });
}

export default StatusDashboard;
