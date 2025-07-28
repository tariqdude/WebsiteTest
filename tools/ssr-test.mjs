#!/usr/bin/env node

/**
 * SSR Safety Test Suite
 * Validates that all components are properly SSR-safe for GitHub Pages deployment
 */

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const COMPONENTS_TO_TEST = [
  'Advanced3DSceneSSR.jsx',
  'CodeEditorShowcaseSSR.jsx',
  'GSAPAnimationShowcase.jsx',
  'InteractiveTerminal.jsx',
  'PerformanceMetrics.jsx',
];

const SSR_PATTERNS = [
  'window',
  'document',
  'navigator',
  'performance',
  'localStorage',
  'sessionStorage',
];

async function testSSRSafety() {
  console.log('🔍 Testing SSR Safety for Showcase Components...\n');

  const results = [];

  for (const component of COMPONENTS_TO_TEST) {
    const filePath = path.join('src/components/showcases', component);

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const issues = [];

      // Check for direct browser API usage without guards
      for (const pattern of SSR_PATTERNS) {
        const regex = new RegExp(
          `(?<!typeof\\s+)\\b${pattern}\\b(?!\\s*!==\\s*['"]undefined['"])`,
          'g'
        );
        const matches = content.match(regex);

        if (matches) {
          // Check if it's guarded by typeof check or isMounted
          const lines = content.split('\n');
          matches.forEach((match) => {
            const lineIndex = content.indexOf(match);
            const lineNumber = content
              .substring(0, lineIndex)
              .split('\n').length;
            const line = lines[lineNumber - 1];

            // Check if the line has proper SSR guards
            const hasTypeofGuard = line.includes(
              `typeof ${pattern} !== 'undefined'`
            );
            const hasIsMountedGuard =
              content.includes('isMounted') &&
              content.substring(0, lineIndex).includes('if (!isMounted)');

            if (!hasTypeofGuard && !hasIsMountedGuard) {
              issues.push(`Line ${lineNumber}: Unguarded ${pattern} usage`);
            }
          });
        }
      }

      results.push({
        component,
        safe: issues.length === 0,
        issues,
      });
    } catch (error) {
      results.push({
        component,
        safe: false,
        issues: [`File read error: ${error.message}`],
      });
    }
  }

  // Report results
  console.log('📊 SSR Safety Test Results:\n');

  let allSafe = true;

  results.forEach(({ component, safe, issues }) => {
    const status = safe ? '✅' : '❌';
    console.log(`${status} ${component}`);

    if (!safe) {
      allSafe = false;
      issues.forEach((issue) => {
        console.log(`   ⚠️  ${issue}`);
      });
    }
    console.log();
  });

  if (allSafe) {
    console.log('🎉 All components are SSR-safe!');
  } else {
    console.log('⚠️  Some components need SSR safety improvements.');
  }

  return allSafe;
}

async function testBuild() {
  console.log('🏗️  Testing production build...\n');

  return new Promise((resolve) => {
    exec('npm run build:gh-pages', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Build failed:');
        console.log(stderr);
        resolve(false);
      } else {
        console.log('✅ Build successful!');
        resolve(true);
      }
    });
  });
}

async function main() {
  console.log('🚀 SSR Safety & Build Test Suite\n');
  console.log('='.repeat(50) + '\n');

  const ssrSafe = await testSSRSafety();
  const buildSuccess = await testBuild();

  console.log('\n' + '='.repeat(50));
  console.log('📋 FINAL RESULTS:');
  console.log(`SSR Safety: ${ssrSafe ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Build Test: ${buildSuccess ? '✅ PASS' : '❌ FAIL'}`);

  if (ssrSafe && buildSuccess) {
    console.log('\n🎉 ALL TESTS PASSED! Ready for GitHub Pages deployment.');
    process.exit(0);
  } else {
    console.log(
      '\n⚠️  Some tests failed. Please fix issues before deployment.'
    );
    process.exit(1);
  }
}

main().catch(console.error);
