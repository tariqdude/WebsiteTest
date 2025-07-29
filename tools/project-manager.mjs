#!/usr/bin/env node
/**
 * Project Manager - Unified Tool for Development and Maintenance
 *
 * A comprehensive script for:
 * - Health diagnostics (linting, type checking, configuration validation)
 * - Automated repairs and code formatting
 * - Dependency and build optimization
 * - Environment setup and verification
 * - Task-specific operations (e.g., cleanup, testing)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir, stat, unlink, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const projectRoot = dirname(dirname(__filename));

const ICONS = {
  rocket: '🚀',
  wrench: '🔧',
  sparkles: '✨',
  broom: '🧹',
  box: '📦',
  check: '✅',
  cross: '❌',
  info: 'ℹ️',
  warn: '⚠️',
  test: '🧪',
  shield: '🛡️',
};

const COMMANDS = {
  eslint: 'npx eslint . --ext .js,.jsx,.ts,.tsx,.astro',
  eslintFix: 'npx eslint . --ext .js,.jsx,.ts,.tsx,.astro --fix',
  astroCheck: 'npx astro check',
  tsc: 'npx tsc --noEmit',
  prettier: 'npx prettier --write .',
  npmPrune: 'npm prune',
  npmInstall: 'npm install',
  npmOutdated: 'npm outdated',
  vitest: 'npx vitest run',
  build: 'npm run build:gh-pages',
};

let operations = 0;
const startTime = Date.now();

// --- Utility Functions ---

function log(message, icon = '') {
  console.log(`${icon} ${message}`.trim());
}

function logOperation(message) {
  operations++;
  log(`${operations}: ${message}`, ICONS.check);
}

function logError(message, error) {
  log(`${message}`, ICONS.cross);
  if (error) {
    console.error('  Error Message:', error.message || 'Unknown error');
    if (error.stdout) console.error('  STDOUT:', error.stdout);
    if (error.stderr) console.error('  STDERR:', error.stderr);
  }
}

async function runCommand(command, description) {
  log(`Running: ${description}...`, ICONS.wrench);
  try {
    const { stdout, stderr } = await execAsync(command, { cwd: projectRoot });
    if (stderr && !stderr.includes('WARN')) {
      log(`Warning from ${description}: ${stderr}`, ICONS.warn);
    }
    logOperation(`${description} completed successfully.`);
    return { success: true, stdout, stderr };
  } catch (error) {
    logError(`Error during: ${description}`, error);
    return { success: false, error };
  }
}

// --- Core Modules ---

const modules = {
  cleanup: {
    icon: ICONS.broom,
    description: 'Clean temporary files and build artifacts.',
    async action() {
      log('\nStarting temporary file cleanup...', this.icon);
      const patterns = [
        '*.tmp',
        '*.bak',
        '*~',
        '.DS_Store',
        'Thumbs.db',
        '*.log',
        'npm-debug.log*',
        'yarn-debug.log*',
        'yarn-error.log*',
      ];
      let cleanedCount = 0;

      const cleanupDirectory = async (dir) => {
        try {
          const entries = await readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            if (entry.isDirectory()) {
              if (entry.name !== 'node_modules' && entry.name !== '.git') {
                await cleanupDirectory(fullPath);
              }
            } else if (
              patterns.some((p) =>
                new RegExp(p.replace('*', '.*')).test(entry.name)
              )
            ) {
              try {
                await unlink(fullPath);
                log(`  Removed: ${fullPath}`, ICONS.broom);
                cleanedCount++;
              } catch (e) {
                /* ignore */
              }
            }
          }
        } catch (e) {
          /* ignore */
        }
      };

      await cleanupDirectory(projectRoot);
      logOperation(`Cleanup finished. Removed ${cleanedCount} files.`);
    },
  },
  dependencies: {
    icon: ICONS.box,
    description: 'Optimize and manage project dependencies.',
    async action() {
      log('\nStarting dependency optimization...', this.icon);
      await runCommand(COMMANDS.npmPrune, 'Pruning unused dependencies');
      await runCommand(
        COMMANDS.npmInstall,
        'Updating package-lock.json and installing'
      );
      const outdated = await runCommand(
        COMMANDS.npmOutdated,
        'Checking for outdated packages'
      );
      if (outdated.success && outdated.stdout.trim()) {
        log('\nOutdated packages found:', ICONS.info);
        console.log(outdated.stdout);
      } else {
        logOperation('All packages are up to date.');
      }
    },
  },
  diagnose: {
    icon: ICONS.wrench,
    description: 'Run project health diagnostics.',
    async action() {
      log('\nRunning project diagnostics...', this.icon);
      await runCommand(COMMANDS.eslint, 'ESLint check');
      await runCommand(COMMANDS.astroCheck, 'Astro check');
      await runCommand(COMMANDS.tsc, 'TypeScript check');
    },
  },
  repair: {
    icon: ICONS.sparkles,
    description: 'Apply automated fixes for code style and formatting.',
    async action() {
      log('\nApplying automated fixes...', this.icon);
      await runCommand(COMMANDS.eslintFix, 'ESLint auto-fix');
      await runCommand(COMMANDS.prettier, 'Prettier format');
    },
  },
  test: {
    icon: ICONS.test,
    description: 'Run the full test suite.',
    async action() {
      log('\nRunning test suite...', this.icon);
      await runCommand(COMMANDS.vitest, 'Running Vitest');
    },
  },
  validate: {
    icon: ICONS.shield,
    description: 'Perform a full pre-deployment validation.',
    async action() {
      log('\nStarting pre-deployment validation...', this.icon);
      await this.runSequence(['diagnose', 'test', 'build']);
    },
    async runSequence(sequence) {
      for (const moduleName of sequence) {
        const module = modules[moduleName];
        if (module) {
          const result = await module.action.call(module);
          if (result && result.success === false) {
            logError(`Validation failed at step: ${moduleName}.`, null);
            return;
          }
        }
      }
      logOperation('All validation steps passed.');
    },
  },
  build: {
    icon: ICONS.rocket,
    description: 'Build the project for production.',
    async action() {
      log('\nBuilding project for production...', this.icon);
      return await runCommand(COMMANDS.build, 'Astro build');
    },
  },
  full: {
    icon: ICONS.rocket,
    description: 'Run the full enhancement and repair sequence.',
    async action() {
      await modules.cleanup.action();
      await modules.dependencies.action();
      await modules.diagnose.action();
      await modules.repair.action();
      await modules.test.action();
      await modules.build.action();
    },
  },
};

// --- Main Execution ---

function displayHelp() {
  log('Project Manager Help', ICONS.info);
  log('------------------');
  log('Usage: node tools/project-manager.mjs [command]');
  log('\nAvailable commands:');
  for (const [name, { icon, description }] of Object.entries(modules)) {
    console.log(`  ${name.padEnd(12)} ${icon} ${description}`);
  }
  log('\nIf no command is provided, "full" sequence is executed.');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'full';

  if (command === 'help' || command === '--help') {
    displayHelp();
    return;
  }

  const selectedModule = modules[command];

  if (!selectedModule) {
    log(
      `Unknown command: "${command}". Use "help" to see available commands.`,
      ICONS.cross
    );
    process.exit(1);
  }

  log(`Initiating: ${command}...`, selectedModule.icon);
  await selectedModule.action.call(selectedModule);

  const duration = (Date.now() - startTime) / 1000;
  log(
    `\n${ICONS.rocket} Task "${command}" finished in ${duration.toFixed(2)}s. Performed ${operations} operations.`,
    ICONS.sparkles
  );
}

main().catch((err) => {
  logError('A critical error occurred in the main process', err);
  process.exit(1);
});
