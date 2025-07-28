#!/usr/bin/env node
/**
 * Enhanced Development Environment Setup
 * Sets up the complete development stack with modern tooling
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

// Enhanced development configuration
const DEV_CONFIG = {
  editor: {
    vscode: {
      extensions: [
        'astro-build.astro-vscode',
        'bradlc.vscode-tailwindcss',
        'esbenp.prettier-vscode',
        'dbaeumer.vscode-eslint',
        'ms-vscode.vscode-typescript-next',
        'formulahendry.auto-rename-tag',
        'christian-kohler.path-intellisense',
        'ms-vscode.vscode-json'
      ],
      settings: {
        'typescript.preferences.quoteStyle': 'single',
        'editor.formatOnSave': true,
        'editor.codeActionsOnSave': {
          'source.fixAll.eslint': true
        },
        'emmet.includeLanguages': {
          'astro': 'html'
        },
        'astro.config.path': './astro.config.mjs'
      }
    }
  },
  hotReload: {
    enabled: true,
    frameworks: ['react', 'vue', 'svelte', 'solid', 'preact'],
    watchPaths: ['src/**/*', 'public/**/*']
  },
  debugging: {
    sourceMap: true,
    breakpoints: true,
    consoleCapture: true
  },
  performance: {
    monitoring: true,
    profiling: true,
    bundleAnalysis: true
  }
};

console.log(chalk.blue.bold('🚀 Enhanced Development Environment Setup\n'));

// Check prerequisites
async function checkPrerequisites() {
  console.log(chalk.cyan('📋 Checking prerequisites...'));
  
  const requirements = [
    { cmd: 'node --version', name: 'Node.js', min: '18.0.0' },
    { cmd: 'npm --version', name: 'npm', min: '8.0.0' },
    { cmd: 'git --version', name: 'Git', required: true }
  ];

  for (const req of requirements) {
    try {
      const { stdout } = await execAsync(req.cmd);
      const version = stdout.trim().replace(/[^0-9.]/g, '');
      console.log(chalk.green(`✅ ${req.name}: ${version}`));
    } catch (error) {
      console.log(chalk.red(`❌ ${req.name}: Not found`));
      if (req.required) {
        throw new Error(`${req.name} is required`);
      }
    }
  }
}

// Setup enhanced VS Code configuration
async function setupVSCode() {
  console.log(chalk.cyan('\n⚙️ Setting up VS Code configuration...'));
  
  const vscodeDir = '.vscode';
  
  if (!existsSync(vscodeDir)) {
    await execAsync(`mkdir -p ${vscodeDir}`);
  }

  // Extensions recommendations
  const extensions = {
    recommendations: DEV_CONFIG.editor.vscode.extensions
  };
  
  writeFileSync(`${vscodeDir}/extensions.json`, JSON.stringify(extensions, null, 2));
  console.log(chalk.green('✅ VS Code extensions configured'));

  // Workspace settings
  const settings = DEV_CONFIG.editor.vscode.settings;
  writeFileSync(`${vscodeDir}/settings.json`, JSON.stringify(settings, null, 2));
  console.log(chalk.green('✅ VS Code settings configured'));

  // Debug configuration
  const launch = {
    version: '0.2.0',
    configurations: [
      {
        name: 'Launch Astro Dev Server',
        type: 'node',
        request: 'launch',
        program: '${workspaceFolder}/node_modules/.bin/astro',
        args: ['dev'],
        env: {
          NODE_ENV: 'development'
        },
        console: 'integratedTerminal',
        restart: true
      },
      {
        name: 'Debug Tests',
        type: 'node',
        request: 'launch',
        program: '${workspaceFolder}/node_modules/.bin/vitest',
        args: ['run'],
        env: {
          NODE_ENV: 'test'
        },
        console: 'integratedTerminal'
      }
    ]
  };
  
  writeFileSync(`${vscodeDir}/launch.json`, JSON.stringify(launch, null, 2));
  console.log(chalk.green('✅ VS Code debug configuration set up'));
}

// Enhanced Git hooks
async function setupGitHooks() {
  console.log(chalk.cyan('\n🔗 Setting up Git hooks...'));
  
  try {
    // Install husky if not present
    if (!existsSync('node_modules/husky')) {
      console.log(chalk.yellow('Installing husky...'));
      await execAsync('npm install --save-dev husky');
    }

    // Setup husky
    await execAsync('npx husky install');
    
    // Pre-commit hook
    const preCommitHook = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting and type checking before commit
npm run lint
npm run check:types
npm run test:changed
`;
    
    await execAsync('npx husky add .husky/pre-commit "npm run lint && npm run check:types"');
    console.log(chalk.green('✅ Pre-commit hooks configured'));

    // Pre-push hook
    await execAsync('npx husky add .husky/pre-push "npm run build:gh-pages"');
    console.log(chalk.green('✅ Pre-push hooks configured'));
    
  } catch (error) {
    console.log(chalk.yellow('⚠️ Git hooks setup skipped (repository may not be initialized)'));
  }
}

// Enhanced development scripts
async function enhancePackageScripts() {
  console.log(chalk.cyan('\n📝 Enhancing package.json scripts...'));
  
  try {
    const packagePath = 'package.json';
    const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
    
    // Add enhanced development scripts
    const enhancedScripts = {
      'dev:debug': 'astro dev --host --verbose',
      'dev:profile': 'NODE_OPTIONS="--inspect" astro dev',
      'dev:analyze': 'npm run build && npx astro build --experimental-static-build',
      'test:watch': 'vitest',
      'test:coverage': 'vitest run --coverage',
      'test:changed': 'vitest related',
      'test:ui': 'vitest --ui',
      'debug:build': 'DEBUG=astro:* npm run build',
      'debug:ssr': 'DEBUG=astro:ssr npm run dev',
      'perf:lighthouse': 'lhci autorun',
      'perf:bundle': 'npx bundle-analyzer dist/_astro/*.js',
      'health:check': 'npm run lint && npm run check:types && npm run test && npm run build',
      'health:full': 'npm run health:check && npm run perf:lighthouse',
      'upgrade:deps': 'npx npm-check-updates -u && npm install',
      'security:audit': 'npm audit && npm audit fix',
      'clean:all': 'rm -rf dist .astro node_modules/.cache',
      'reset:hard': 'npm run clean:all && npm install'
    };

    // Merge with existing scripts
    pkg.scripts = { ...pkg.scripts, ...enhancedScripts };
    
    // Add development dependencies if not present
    const devDeps = {
      'husky': '^8.0.3',
      '@types/node': '^20.0.0',
      'cross-env': '^7.0.3'
    };

    pkg.devDependencies = { ...pkg.devDependencies, ...devDeps };
    
    writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
    console.log(chalk.green('✅ Package.json enhanced with development scripts'));
    
  } catch (error) {
    console.log(chalk.red('❌ Failed to enhance package.json:', error.message));
  }
}

// Performance monitoring setup
async function setupPerformanceMonitoring() {
  console.log(chalk.cyan('\n📊 Setting up performance monitoring...'));
  
  // Lighthouse CI configuration
  const lighthouseConfig = {
    ci: {
      collect: {
        url: ['http://localhost:4321'],
        startServerCommand: 'npm run preview',
        numberOfRuns: 3
      },
      assert: {
        preset: 'lighthouse:recommended',
        assertions: {
          'categories:performance': ['warn', { minScore: 0.8 }],
          'categories:accessibility': ['error', { minScore: 0.9 }],
          'categories:best-practices': ['error', { minScore: 0.9 }],
          'categories:seo': ['error', { minScore: 0.9 }]
        }
      },
      upload: {
        target: 'temporary-public-storage'
      }
    }
  };
  
  writeFileSync('lighthouserc.json', JSON.stringify(lighthouseConfig, null, 2));
  console.log(chalk.green('✅ Lighthouse CI configured'));

  // Bundle analyzer configuration
  const bundleConfig = {
    analyzerMode: 'server',
    analyzerHost: 'localhost',
    analyzerPort: 8888,
    openAnalyzer: true
  };
  
  writeFileSync('.bundleanalyzerrc.json', JSON.stringify(bundleConfig, null, 2));
  console.log(chalk.green('✅ Bundle analyzer configured'));
}

// Enhanced environment variables
async function setupEnvironment() {
  console.log(chalk.cyan('\n🌍 Setting up environment configuration...'));
  
  const envExample = `# Development Environment Variables
NODE_ENV=development
ASTRO_SITE=https://tariqdude.github.io
ASTRO_BASE=/WebsiteTest

# Performance Monitoring
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_BUDGET_SIZE=500000
PERFORMANCE_BUDGET_TIME=3000

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_ERROR_TRACKING=false
ENABLE_A11Y_CHECKS=true

# Development Tools
ENABLE_SOURCE_MAPS=true
ENABLE_HOT_RELOAD=true
ENABLE_DEBUG_OVERLAY=false

# Build Configuration
BUILD_TARGET=modern
MINIFY_HTML=true
MINIFY_CSS=true
MINIFY_JS=true

# Testing
TEST_TIMEOUT=10000
TEST_COVERAGE_THRESHOLD=80
`;

  if (!existsSync('.env.example')) {
    writeFileSync('.env.example', envExample);
    console.log(chalk.green('✅ Environment example file created'));
  }

  if (!existsSync('.env.local')) {
    writeFileSync('.env.local', envExample.replace(/=false/g, '=true'));
    console.log(chalk.green('✅ Local environment file created'));
  }
}

// Main setup function
async function main() {
  try {
    await checkPrerequisites();
    await setupVSCode();
    await setupGitHooks();
    await enhancePackageScripts();
    await setupPerformanceMonitoring();
    await setupEnvironment();
    
    console.log(chalk.green.bold('\n🎉 Enhanced development environment setup complete!'));
    console.log(chalk.cyan('\n📚 Available commands:'));
    console.log(chalk.white('• npm run dev:debug    - Debug mode with verbose output'));
    console.log(chalk.white('• npm run dev:profile  - Profile performance during development'));
    console.log(chalk.white('• npm run test:watch   - Watch mode for tests'));
    console.log(chalk.white('• npm run test:ui      - Visual test interface'));
    console.log(chalk.white('• npm run health:check - Complete health check'));
    console.log(chalk.white('• npm run perf:lighthouse - Performance audit'));
    console.log(chalk.white('• npm run optimize     - Project optimization'));
    console.log(chalk.white('• npm run supercharge  - Full optimization and build'));
    
    console.log(chalk.cyan('\n🚀 Next steps:'));
    console.log(chalk.white('1. Install VS Code extensions: code --install-extension astro-build.astro-vscode'));
    console.log(chalk.white('2. Start development: npm run dev'));
    console.log(chalk.white('3. Run health check: npm run health:check'));
    
  } catch (error) {
    console.error(chalk.red('\n💥 Setup failed:'), error.message);
    process.exit(1);
  }
}

// Export for programmatic use
export default main;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
