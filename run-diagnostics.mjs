#!/usr/bin/env node

/**
 * Diagnostics Runner
 * 
 * This script runs comprehensive diagnostics on the project
 * and generates detailed reports for troubleshooting.
 */

import { runDiagnostics } from './build-diagnostics.mjs';

async function main() {
  console.log('🔍 Starting Astro Project Diagnostics...\n');
  
  try {
    const result = await runDiagnostics();
    
    console.log('\n📊 Diagnostic Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`Total Duration: ${result.report.totalDuration}ms`);
    console.log(`Errors Found: ${result.summary.errors}`);
    console.log(`Warnings: ${result.summary.warnings}`);
    console.log(`Performance Metrics: ${Object.keys(result.summary.metrics).length}`);
    
    if (result.summary.errors > 0) {
      console.log('\n🔴 Errors detected! Check .logs/build-errors.json for details.');
      process.exit(1);
    } else {
      console.log('\n✅ All diagnostics passed successfully!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('\n💥 Diagnostics failed:', error.message);
    process.exit(1);
  }
}

main();
