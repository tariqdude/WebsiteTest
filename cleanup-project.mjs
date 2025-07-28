#!/usr/bin/env node
/**
 * Project Cleanup and Organization Script
 * Removes old diagnostic files and organizes the project structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Files to remove (old diagnostic tools)
const filesToRemove = [
  'deploy-check.mjs',
  'deployment-fixer.mjs', 
  'deployment-tester.mjs',
  'deployment-validator.mjs',
  'enhanced-diagnostics.mjs',
  'final-health-check.mjs',
  'health-check.mjs',
  'project-fixer.mjs',
  'quick-fixer.mjs',
  'run-diagnostics.mjs',
  'run-diagnostics-new.mjs',
  'test-build.mjs',
  'build-monitor.mjs'
];

// Shell scripts to remove (replaced by npm scripts)
const scriptsToRemove = [
  'auto-fix.sh',
  'deploy-prep.sh', 
  'deploy-robust.sh'
];

function cleanupFiles() {
  console.log('🧹 Cleaning up old diagnostic files...\n');
  
  let removedCount = 0;
  
  // Remove old .mjs files
  filesToRemove.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Removed: ${file}`);
        removedCount++;
      } catch (error) {
        console.log(`❌ Failed to remove ${file}: ${error.message}`);
      }
    }
  });
  
  // Remove old shell scripts
  scriptsToRemove.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Removed: ${file}`);
        removedCount++;
      } catch (error) {
        console.log(`❌ Failed to remove ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n📊 Cleanup Summary: ${removedCount} files removed`);
}

function createProjectStructureDoc() {
  const content = `# Project Organization

## Core Files

### Deployment & Build
- \`deployment-manager.mjs\` - Unified deployment management system
- \`astro.config.mjs\` - Main Astro configuration  
- \`package.json\` - Dependencies and npm scripts
- \`.github/workflows/deploy.yml\` - GitHub Actions deployment

### Key Scripts (npm run ...)
- \`deploy:health\` - Quick health check
- \`deploy:validate\` - Full validation with build test
- \`deploy:fix\` - Auto-fix issues  
- \`deploy:prep\` - Prepare for deployment
- \`build:gh-pages\` - Build for GitHub Pages
- \`diagnostics\` - Verbose health diagnostics

## Multi-Framework Architecture

### Framework Components (\`src/components/frameworks/\`)
- \`react/\` - React components with TypeScript
- \`vue/\` - Vue 3 Composition API components  
- \`svelte/\` - Svelte components
- \`solid/\` - Solid.js components
- \`preact/\` - Preact lightweight components

### Advanced Features (\`src/components/showcases/\`)
- \`Advanced3DScene.jsx\` - Three.js 3D graphics
- \`CodeEditorShowcase.jsx\` - Monaco code editor
- \`GSAPAnimationShowcase.jsx\` - GSAP animations
- \`InteractiveTerminal.jsx\` - Terminal simulation

## Deployment Workflow

1. **Health Check**: \`npm run deploy:health\`
2. **Fix Issues**: \`npm run deploy:fix\` 
3. **Build Test**: \`npm run deploy:validate\`
4. **Deploy**: Push to main branch (auto-deploys via GitHub Actions)

## Performance Optimization

- Islands architecture with selective hydration
- Framework isolation with include patterns
- Smart dependency chunking
- Optimized build for GitHub Pages
`;

  fs.writeFileSync(path.join(__dirname, 'PROJECT-STRUCTURE.md'), content);
  console.log('📝 Created PROJECT-STRUCTURE.md');
}

function main() {
  console.log('🚀 Starting Project Cleanup and Organization\n');
  
  cleanupFiles();
  createProjectStructureDoc();
  
  console.log(`
✨ Project Organization Complete!

📁 Simplified Structure:
   • deployment-manager.mjs (unified tool)
   • PROJECT-STRUCTURE.md (documentation)
   • Clean npm scripts in package.json

🚀 Next Steps:
   1. npm run deploy:health
   2. npm run deploy:validate  
   3. Push to GitHub for deployment

💡 All old diagnostic files removed, project is now organized and simplified!
`);
}

main();
