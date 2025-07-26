#!/usr/bin/env node

/**
 * Final Verification Script for Enhanced Vite Configuration
 * Validates all components of the new diagnostic-enabled build system
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, statSync } from 'fs';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

class VerificationReporter {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  log(type, message, details = null) {
    const elapsed = Date.now() - this.startTime;
    this.results.push({
      type,
      message,
      details,
      timestamp: new Date().toISOString(),
      elapsed: `${elapsed}ms`
    });

    const prefix = {
      'SUCCESS': '✅',
      'ERROR': '❌',
      'WARN': '⚠️',
      'INFO': '📋'
    }[type] || '📋';

    console.log(`${prefix} [${elapsed}ms] ${message}`);
    if (details) {
      console.log(`   ${details}`);
    }
  }

  summary() {
    const counts = this.results.reduce((acc, result) => {
      acc[result.type] = (acc[result.type] || 0) + 1;
      return acc;
    }, {});

    console.log('\n' + '='.repeat(60));
    console.log('🔍 VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successes: ${counts.SUCCESS || 0}`);
    console.log(`❌ Errors: ${counts.ERROR || 0}`);
    console.log(`⚠️  Warnings: ${counts.WARN || 0}`);
    console.log(`📋 Info: ${counts.INFO || 0}`);
    console.log(`⏱️  Total Time: ${Date.now() - this.startTime}ms`);
    console.log('='.repeat(60));

    return counts.ERROR || 0;
  }
}

class ConfigurationVerifier {
  constructor(reporter) {
    this.reporter = reporter;
    this.projectRoot = __dirname;
  }

  async verifyAll() {
    this.reporter.log('INFO', 'Starting comprehensive verification of enhanced Vite configuration');

    // Core configuration files
    await this.verifyAstroConfig();
    await this.verifyDiagnosticSystem();
    await this.verifyPackageJson();
    await this.verifyProjectStructure();
    await this.verifyDependencies();
    await this.verifyTypeScript();

    this.reporter.log('INFO', 'Verification complete');
  }

  async verifyAstroConfig() {
    const configPath = join(this.projectRoot, 'astro.config.mjs');
    
    if (!existsSync(configPath)) {
      this.reporter.log('ERROR', 'astro.config.mjs not found');
      return;
    }

    try {
      const configContent = readFileSync(configPath, 'utf-8');
      const stats = statSync(configPath);

      // Check for enhanced features
      const features = [
        'DiagnosticLogger',
        'PerformanceMonitor',
        'smartChunking',
        'frameworkPatterns',
        'errorRecovery',
        'pathAliases'
      ];

      const missingFeatures = features.filter(feature => !configContent.includes(feature));
      
      if (missingFeatures.length === 0) {
        this.reporter.log('SUCCESS', 'Enhanced Astro configuration verified', 
          `${Math.round(stats.size / 1024)}KB with all diagnostic features`);
      } else {
        this.reporter.log('WARN', 'Some enhanced features missing', 
          `Missing: ${missingFeatures.join(', ')}`);
      }

      // Check for framework integrations
      const frameworks = ['react', 'vue', 'svelte', 'solid', 'preact'];
      const detectedFrameworks = frameworks.filter(fw => 
        configContent.includes(`@astrojs/${fw}`) || configContent.includes(fw)
      );

      this.reporter.log('INFO', 'Framework integrations detected', 
        detectedFrameworks.join(', '));

    } catch (error) {
      this.reporter.log('ERROR', 'Failed to verify Astro config', error.message);
    }
  }

  async verifyDiagnosticSystem() {
    const diagnosticFiles = [
      'build-diagnostics.mjs',
      'run-diagnostics.mjs'
    ];

    for (const file of diagnosticFiles) {
      const filePath = join(this.projectRoot, file);
      
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf-8');
        const stats = statSync(filePath);
        
        this.reporter.log('SUCCESS', `Diagnostic file verified: ${file}`, 
          `${Math.round(stats.size / 1024)}KB`);

        // Check for key classes/functions
        if (file === 'build-diagnostics.mjs') {
          const classes = ['DiagnosticLogger', 'PerformanceMonitor', 'DependencyAnalyzer', 'FileSystemAnalyzer'];
          const missingClasses = classes.filter(cls => !content.includes(cls));
          
          if (missingClasses.length === 0) {
            this.reporter.log('SUCCESS', 'All diagnostic classes present');
          } else {
            this.reporter.log('WARN', 'Some diagnostic classes missing', 
              missingClasses.join(', '));
          }
        }
      } else {
        this.reporter.log('ERROR', `Missing diagnostic file: ${file}`);
      }
    }
  }

  async verifyPackageJson() {
    const packagePath = join(this.projectRoot, 'package.json');
    
    if (!existsSync(packagePath)) {
      this.reporter.log('ERROR', 'package.json not found');
      return;
    }

    try {
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
      
      // Check enhanced scripts
      const expectedScripts = [
        'diagnostics',
        'build:verbose',
        'dev:verbose',
        'check:types',
        'clean',
        'clean:logs'
      ];

      const missingScripts = expectedScripts.filter(script => !packageJson.scripts[script]);
      
      if (missingScripts.length === 0) {
        this.reporter.log('SUCCESS', 'All enhanced scripts present in package.json');
      } else {
        this.reporter.log('WARN', 'Some enhanced scripts missing', 
          missingScripts.join(', '));
      }

      // Check framework dependencies
      const frameworks = ['@astrojs/react', '@astrojs/vue', '@astrojs/svelte', '@astrojs/solid-js', '@astrojs/preact'];
      const installedFrameworks = frameworks.filter(fw => 
        packageJson.dependencies[fw] || packageJson.devDependencies?.[fw]
      );

      this.reporter.log('INFO', 'Framework dependencies found', 
        `${installedFrameworks.length}/5 frameworks installed`);

    } catch (error) {
      this.reporter.log('ERROR', 'Failed to parse package.json', error.message);
    }
  }

  async verifyProjectStructure() {
    const criticalPaths = [
      'src/components',
      'src/pages',
      'src/layouts',
      'src/content',
      'public',
      'src/styles'
    ];

    for (const path of criticalPaths) {
      const fullPath = join(this.projectRoot, path);
      if (existsSync(fullPath)) {
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
          this.reporter.log('SUCCESS', `Directory verified: ${path}`);
        }
      } else {
        this.reporter.log('WARN', `Directory missing: ${path}`);
      }
    }
  }

  async verifyDependencies() {
    try {
      const packageJson = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Check critical dependencies
      const critical = [
        'astro',
        '@astrojs/check',
        'typescript'
      ];

      const missing = critical.filter(dep => !deps[dep]);
      
      if (missing.length === 0) {
        this.reporter.log('SUCCESS', 'All critical dependencies present');
      } else {
        this.reporter.log('ERROR', 'Missing critical dependencies', missing.join(', '));
      }

      // Check Astro version
      const astroVersion = deps.astro;
      if (astroVersion && astroVersion.includes('5.')) {
        this.reporter.log('SUCCESS', 'Astro 5.x detected', astroVersion);
      } else {
        this.reporter.log('WARN', 'Astro version may need updating', astroVersion || 'not found');
      }

    } catch (error) {
      this.reporter.log('ERROR', 'Failed to verify dependencies', error.message);
    }
  }

  async verifyTypeScript() {
    const tsConfigPath = join(this.projectRoot, 'tsconfig.json');
    
    if (existsSync(tsConfigPath)) {
      try {
        const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf-8'));
        
        if (tsConfig.extends?.includes('astro')) {
          this.reporter.log('SUCCESS', 'TypeScript configuration extends Astro settings');
        }

        if (tsConfig.compilerOptions?.strict) {
          this.reporter.log('SUCCESS', 'Strict TypeScript mode enabled');
        } else {
          this.reporter.log('WARN', 'Consider enabling strict TypeScript mode');
        }

      } catch (error) {
        this.reporter.log('ERROR', 'Failed to parse tsconfig.json', error.message);
      }
    } else {
      this.reporter.log('WARN', 'tsconfig.json not found');
    }
  }
}

// Run verification
async function main() {
  const reporter = new VerificationReporter();
  const verifier = new ConfigurationVerifier(reporter);
  
  try {
    await verifier.verifyAll();
    const errorCount = reporter.summary();
    
    if (errorCount === 0) {
      console.log('\n🎉 Enhanced Vite configuration verification passed!');
      console.log('🚀 Your project is ready for development with enhanced diagnostics.');
    } else {
      console.log(`\n⚠️  Verification completed with ${errorCount} error(s).`);
      console.log('📋 Review the issues above and run the verification again.');
    }
    
    process.exit(errorCount);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ConfigurationVerifier, VerificationReporter };
