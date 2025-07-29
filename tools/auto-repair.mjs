#!/usr/bin/env node
/**
 * Automated Project Repair and Enhancement Tool
 *
 * This script provides a centralized system for:
 * - Diagnosing project health (linting, type checking)
 * - Automatically fixing common issues (ESLint, Prettier)
 * - Optimizing project configuration and dependencies
 * - Cleaning up temporary files and build artifacts
 */

import { exec }
from 'child_process';
import { promisify }
from 'util';
import { readdir, stat, unlink, writeFile, readFile }
from 'fs/promises';
import { join, extname }
from 'path';
import { fileURLToPath }
from 'url';
import { dirname }
from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

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
};

let operations = 0;
const startTime = Date.now();

// --- Utility Functions ---

function log(message, icon = '') {
    console.log(`${icon} ${message}`);
}

function logOperation(message) {
    operations++;
    log(`${operations}: ${message}`, ICONS.check);
}

function logError(message, error) {
    log(`${message}: ${error.message || 'Unknown error'}`, ICONS.cross);
    if (error.stdout) console.error('STDOUT:', error.stdout);
    if (error.stderr) console.error('STDERR:', error.stderr);
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

// --- Core Functions ---

async function cleanupTempFiles() {
    log('\nStarting temporary file cleanup...', ICONS.broom);
    const patterns = [
        '*.tmp', '*.bak', '*~', '.DS_Store', 'Thumbs.db', '*.log',
        'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*',
    ];
    let cleanedCount = 0;

    const cleanupDirectory = async (dir) => {
        try {
            const entries = await readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = join(dir, entry.name);
                if (entry.isDirectory()) {
                    if (entry.name !== 'node_modules') {
                        await cleanupDirectory(fullPath);
                    }
                } else if (patterns.some(p => new RegExp(p.replace('*', '.*')).test(entry.name))) {
                    try {
                        await unlink(fullPath);
                        log(`Removed: ${fullPath}`, ICONS.broom);
                        cleanedCount++;
                    } catch (e) {
                        // ignore errors
                    }
                }
            }
        } catch (e) {
            // ignore errors
        }
    };

    await cleanupDirectory(projectRoot);
    logOperation(`Temporary file cleanup finished. Removed ${cleanedCount} files.`);
}

async function optimizeDependencies() {
    log('\nStarting dependency optimization...', ICONS.box);
    await runCommand(COMMANDS.npmPrune, 'Pruning unused dependencies');
    await runCommand(COMMANDS.npmInstall, 'Updating package-lock.json and installing');
    const outdated = await runCommand(COMMANDS.npmOutdated, 'Checking for outdated packages');
    if (outdated.success && outdated.stdout.trim()) {
        log('\nOutdated packages found:', ICONS.info);
        console.log(outdated.stdout);
    } else {
        logOperation('All packages are up to date.');
    }
}

async function runDiagnostics() {
    log('\nRunning project diagnostics...', ICONS.wrench);
    await runCommand(COMMANDS.eslint, 'ESLint check');
    await runCommand(COMMANDS.astroCheck, 'Astro check');
    await runCommand(COMMANDS.tsc, 'TypeScript check');
}

async function runAutoFixes() {
    log('\nApplying automated fixes...', ICONS.sparkles);
    await runCommand(COMMANDS.eslintFix, 'ESLint auto-fix');
    await runCommand(COMMANDS.prettier, 'Prettier format');
}

// --- Main Execution ---

async function main() {
    log('Initiating Auto-Repair and Enhancement Sequence...', ICONS.rocket);

    const args = process.argv.slice(2);

    if (args.includes('--cleanup-only')) {
        await cleanupTempFiles();
    } else if (args.includes('--optimize-only')) {
        await optimizeDependencies();
    } else if (args.includes('--diagnose-only')) {
        await runDiagnostics();
    } else if (args.includes('--fix-only')) {
        await runAutoFixes();
    } else {
        // Full run
        await cleanupTempFiles();
        await optimizeDependencies();
        await runDiagnostics();
        await runAutoFixes();
    }

    const duration = (Date.now() - startTime) / 1000;
    log(`\n${ICONS.rocket} Project auto-repair finished in ${duration.toFixed(2)}s. Performed ${operations} operations.`, ICONS.sparkles);
}

main().catch(err => {
    logError('A critical error occurred in the main process', err);
    process.exit(1);
});
