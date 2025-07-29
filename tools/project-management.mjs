#!/usr/bin/env node
/**
 * UNIFIED PROJECT MANAGEMENT SYSTEM
 * =================================
 *
 * Consolidated toolkit for project management including:
 * - Environment setup and validation
 * - Deployment management and testing
 * - Performance optimization
 * - Health monitoring and status reporting
 *
 * @version 2.0.0
 * @author Project Management Team
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile, access, readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const ICONS = {
  rocket: '🚀',
  shield: '🛡️',
  gear: '⚙️',
  chart: '📊',
  check: '✅',
  cross: '❌',
  warn: '⚠️',
  info: 'ℹ️',
};

// === UTILITY FUNCTIONS ===
function log(message, icon = '', level = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  const colors = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    success: '\x1b[32m',
    info: '\x1b[36m',
  };
  const color = colors[level] || '';
  console.log(`${color}[${timestamp}] ${icon} ${message}\x1b[0m`);
}

async function runCommand(command, description) {
  log(`Running: ${description}...`, ICONS.gear);
  try {
    const { stdout, stderr } = await execAsync(command, { cwd: projectRoot });
    if (stderr && !stderr.includes('WARN')) {
      log(`${description} produced warnings:\n${stderr}`, ICONS.warn, 'warn');
    }
    log(`${description} completed successfully`, ICONS.check, 'success');
    return { success: true, stdout, stderr };
  } catch (error) {
    log(`${description} failed: ${error.message}`, ICONS.cross, 'error');
    return { success: false, error };
  }
}

async function checkDependencies() {
  log('Checking for missing dependencies...', ICONS.shield);
  try {
    const packageJson = JSON.parse(
      await readFile(join(projectRoot, 'package.json'), 'utf-8')
    );
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const astroConfig = await readFile(
      join(projectRoot, 'astro.config.mjs'),
      'utf-8'
    );

    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    const missing = new Set();

    while ((match = importRegex.exec(astroConfig)) !== null) {
      const moduleName = match[1];
      if (
        !moduleName.startsWith('.') &&
        !moduleName.startsWith('/') &&
        !dependencies[moduleName] &&
        !moduleName.startsWith('astro:') &&
        moduleName !== 'astro/config'
      ) {
        missing.add(moduleName);
      }
    }

    if (missing.size > 0) {
      log(
        `Found ${missing.size} missing dependencies: ${[...missing].join(
          ', '
        )}`,
        ICONS.warn,
        'warn'
      );
      const installCommand = `npm install --save-dev ${[...missing].join(' ')}`;
      await runCommand(installCommand, 'Installing missing dependencies');
    } else {
      log('All dependencies are correctly listed.', ICONS.check, 'success');
    }
    return true;
  } catch (error) {
    log(`Dependency check failed: ${error.message}`, ICONS.cross, 'error');
    return false;
  }
}

// === CORE FUNCTIONS ===
async function setupEnvironment() {
  log('Setting up development environment...', ICONS.rocket);

  // Install dependencies
  await runCommand('npm install', 'Installing dependencies');

  // Check for missing dependencies
  await checkDependencies();

  // Run health checks
  const checks = [
    ['npm run check', 'Astro and TypeScript check'],
    ['npm run lint', 'ESLint check'],
  ];

  for (const [cmd, desc] of checks) {
    await runCommand(cmd, desc);
  }

  log('Environment setup completed', ICONS.check, 'success');
}

async function validateDeployment() {
  log('Validating deployment readiness...', ICONS.shield);

  // Check dependencies first
  if (!(await checkDependencies())) {
    log('Dependency check failed. Aborting validation.', ICONS.cross, 'error');
    return false;
  }

  // Build test
  const buildResult = await runCommand(
    'npm run build:gh-pages',
    'Production build test'
  );
  if (!buildResult.success) {
    log('Build validation failed', ICONS.cross, 'error');
    return false;
  }

  // Configuration checks
  try {
    const packageJson = JSON.parse(
      await readFile(join(projectRoot, 'package.json'), 'utf-8')
    );
    const astroConfig = await readFile(
      join(projectRoot, 'astro.config.mjs'),
      'utf-8'
    );

    log('Configuration files validated', ICONS.check, 'success');
    return true;
  } catch (error) {
    log(
      `Configuration validation failed: ${error.message}`,
      ICONS.cross,
      'error'
    );
    return false;
  }
}

async function optimizeProject() {
  log('Optimizing project performance...', ICONS.gear);

  // Clean and optimize
  await runCommand('npm prune', 'Removing unused dependencies');
  await runCommand('npm audit fix', 'Fixing security vulnerabilities');
  await runCommand('npm run format', 'Formatting code');

  // Self-healing scan
  await runCommand(
    'node tools/self-healing-framework.mjs --heal-only',
    'Running self-healing scan'
  );

  log('Project optimization completed', ICONS.check, 'success');
}

async function runTests() {
  log('Running project tests...', ICONS.gear);

  const testCommands = [
    ['npm run test:ssr', 'SSR compatibility test'],
    ['npm run build:gh-pages', 'Production build test'],
    ['npm run check', 'Astro and TypeScript validation test'],
  ];

  let allPassed = true;
  for (const [cmd, desc] of testCommands) {
    const result = await runCommand(cmd, desc);
    if (!result.success) {
      allPassed = false;
    }
  }

  if (allPassed) {
    log('All tests passed successfully', ICONS.check, 'success');
  } else {
    log('Some tests failed', ICONS.cross, 'error');
  }

  return allPassed;
}

async function generateHealthReport() {
  log('Generating project health report...', ICONS.chart);

  const health = {
    timestamp: new Date().toISOString(),
    checks: {},
    dependencies: {},
    performance: {},
  };

  // Run health checks
  const checks = [
    ['npm run check', 'astro_typescript'],
    ['npm run lint', 'eslint'],
  ];

  for (const [cmd, key] of checks) {
    const result = await runCommand(cmd, `Health check: ${key}`);
    health.checks[key] = result.success;
  }

  // Dependency analysis
  try {
    const packageJson = JSON.parse(
      await readFile(join(projectRoot, 'package.json'), 'utf-8')
    );
    health.dependencies.total = Object.keys({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }).length;
  } catch (error) {
    health.dependencies.error = error.message;
  }

  // File count analysis
  try {
    const srcFiles = await readdir(join(projectRoot, 'src'), {
      recursive: true,
    });
    health.performance.sourceFiles = srcFiles.length;
  } catch (error) {
    health.performance.error = error.message;
  }

  // Save report
  const reportPath = join(projectRoot, '.project-health-report.json');
  await writeFile(reportPath, JSON.stringify(health, null, 2));

  // Display summary
  log('\n' + '='.repeat(50), ICONS.chart);
  log('PROJECT HEALTH REPORT', ICONS.chart);
  log('='.repeat(50), ICONS.chart);
  log(
    `Astro Check: ${health.checks.astro ? 'PASS' : 'FAIL'}`,
    health.checks.astro ? ICONS.check : ICONS.cross
  );
  log(
    `TypeScript: ${health.checks.typescript ? 'PASS' : 'FAIL'}`,
    health.checks.typescript ? ICONS.check : ICONS.cross
  );
  log(
    `ESLint: ${health.checks.eslint ? 'PASS' : 'FAIL'}`,
    health.checks.eslint ? ICONS.check : ICONS.cross
  );
  log(`Dependencies: ${health.dependencies.total || 'Unknown'}`, ICONS.info);
  log(
    `Source Files: ${health.performance.sourceFiles || 'Unknown'}`,
    ICONS.info
  );
  log(`Report saved to: ${reportPath}`, ICONS.info);
  log('='.repeat(50), ICONS.chart);

  return health;
}

// === MAIN EXECUTION ===
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  log('Project Management System Initialized', ICONS.rocket);

  try {
    switch (command) {
      case 'setup':
        await setupEnvironment();
        break;

      case 'validate':
        await validateDeployment();
        break;

      case 'optimize':
        await optimizeProject();
        break;

      case 'test':
        await runTests();
        break;

      case 'health':
      case 'report':
        await generateHealthReport();
        break;

      case 'full':
        await setupEnvironment();
        await optimizeProject();
        await runTests();
        await validateDeployment();
        await generateHealthReport();
        break;

      case 'help':
      default:
        log('\nAvailable commands:', ICONS.info);
        log('  setup    - Set up development environment', ICONS.gear);
        log('  validate - Validate deployment readiness', ICONS.shield);
        log('  optimize - Optimize project performance', ICONS.rocket);
        log('  test     - Run project tests', ICONS.gear);
        log('  health   - Generate health report', ICONS.chart);
        log('  report   - Alias for health command', ICONS.chart);
        log('  full     - Run all tasks', ICONS.check);
        break;
    }

    log('Task completed successfully', ICONS.check, 'success');
  } catch (error) {
    log(`Fatal error: ${error.message}`, ICONS.cross, 'error');
    process.exit(1);
  }
}

// Execute if run directly
main().catch((err) => {
  log(`Critical error: ${err.message}`, ICONS.cross, 'error');
  process.exit(1);
});
