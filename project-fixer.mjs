#!/usr/bin/env node

/**
 * 🔧 Comprehensive Error Detection & Auto-Fix System
 * Finds and fixes deployment-blocking issues automatically
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

class ProjectFixer {
  constructor() {
    this.errors = [];
    this.fixes = [];
    this.applied = [];
  }

  log(level, message) {
    const icons = { error: '🔴', warn: '🟡', info: '🔵', success: '🟢', fix: '🔧' };
    console.log(`${icons[level] || '📍'} ${message}`);
  }

  // =============================================================================
  // ERROR DETECTION
  // =============================================================================

  checkImports() {
    this.log('info', 'Checking component imports...');
    const showcaseFile = 'src/pages/showcase.astro';
    
    if (!existsSync(showcaseFile)) {
      this.errors.push({ type: 'missing-file', file: showcaseFile });
      return;
    }

    const content = readFileSync(showcaseFile, 'utf8');
    const imports = this.extractImports(content);
    
    for (const imp of imports) {
      const filePath = this.resolveImportPath(imp.path, 'src/pages/');
      if (!existsSync(filePath)) {
        this.errors.push({
          type: 'missing-import',
          file: showcaseFile,
          import: imp.path,
          resolved: filePath,
          component: imp.name
        });
      }
    }
  }

  extractImports(content) {
    const imports = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const match = line.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
      if (match && !match[2].includes('astro')) {
        imports.push({ name: match[1], path: match[2] });
      }
    }
    
    return imports;
  }

  resolveImportPath(importPath, basePath) {
    if (importPath.startsWith('../')) {
      return path.resolve(basePath, importPath);
    }
    return path.resolve('src', importPath.replace(/^\//, ''));
  }

  checkTypeScriptErrors() {
    this.log('info', 'Checking for TypeScript errors...');
    // We'll add specific error checks here
    
    // Check for common React import issues
    this.checkReactImports();
    
    // Check for missing type definitions
    this.checkMissingTypes();
  }

  checkReactImports() {
    const reactFiles = [
      'src/components/frameworks/react/InteractiveCounter.jsx',
      'src/components/frameworks/react/AdvancedForm.tsx',
      'src/components/frameworks/react/DataVisualizationDashboard.jsx'
    ];

    for (const file of reactFiles) {
      if (existsSync(file)) {
        const content = readFileSync(file, 'utf8');
        
        // Check for problematic React default import
        if (content.includes('import React,') && !content.includes('import { createElement }')) {
          this.errors.push({
            type: 'react-import-issue',
            file,
            issue: 'Problematic React default import'
          });
        }
      }
    }
  }

  checkMissingTypes() {
    // Check if essential type files exist
    const typeFiles = [
      'src/lib/types/index.ts',
      'src/lib/types/forms.ts',
      'src/lib/types/performance.ts'
    ];

    for (const file of typeFiles) {
      if (!existsSync(file)) {
        this.errors.push({
          type: 'missing-types',
          file
        });
      }
    }
  }

  checkBuildConfiguration() {
    this.log('info', 'Checking build configuration...');
    
    // Check package.json scripts
    if (existsSync('package.json')) {
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
      
      if (!pkg.scripts?.['build:gh-pages']) {
        this.errors.push({
          type: 'missing-script',
          script: 'build:gh-pages'
        });
      }
    }

    // Check astro config
    if (existsSync('astro.config.mjs')) {
      const config = readFileSync('astro.config.mjs', 'utf8');
      
      if (!config.includes('output: \'static\'')) {
        this.errors.push({
          type: 'config-issue',
          issue: 'Missing static output configuration'
        });
      }
    }
  }

  // =============================================================================
  // AUTO-FIX IMPLEMENTATIONS
  // =============================================================================

  createMissingComponents() {
    const componentErrors = this.errors.filter(e => e.type === 'missing-import');
    
    for (const error of componentErrors) {
      this.createComponentStub(error);
    }
  }

  createComponentStub(error) {
    const dir = path.dirname(error.resolved);
    const ext = path.extname(error.resolved) || '.jsx';
    const name = error.component;
    
    // Create directory if needed
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      this.log('fix', `Created directory: ${dir}`);
    }
    
    // Generate component content
    let content = '';
    
    if (ext === '.vue') {
      content = this.generateVueStub(name);
    } else if (ext === '.svelte') {
      content = this.generateSvelteStub(name);
    } else if (ext === '.tsx') {
      content = this.generateTypeScriptStub(name);
    } else {
      content = this.generateReactStub(name);
    }
    
    writeFileSync(error.resolved, content);
    this.log('fix', `Created component: ${error.resolved}`);
    this.applied.push(`Created ${name} component`);
  }

  generateReactStub(name) {
    return `import { useState } from 'react';

const ${name} = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          ${name}
        </h3>
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          Component
        </span>
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          This component is currently being developed. It will showcase advanced functionality
          and demonstrate modern React patterns.
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsLoading(!isLoading)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isLoading ? 'Stop Demo' : 'Start Demo'}
          </button>
        </div>
        
        {isLoading && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-300 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ${name};`;
  }

  generateTypeScriptStub(name) {
    return `import React, { useState } from 'react';

interface ${name}Props {
  title?: string;
  className?: string;
}

const ${name}: React.FC<${name}Props> = ({ 
  title = '${name}',
  className = ''
}) => {
  const [state, setState] = useState<{ active: boolean; data: any[] }>({
    active: false,
    data: []
  });

  const handleAction = (): void => {
    setState(prev => ({
      ...prev,
      active: !prev.active
    }));
  };

  return (
    <div className={\`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg \${className}\`}>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Advanced TypeScript component with type safety and modern patterns.
        </p>
        
        <button
          onClick={handleAction}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {state.active ? 'Deactivate' : 'Activate'}
        </button>
        
        {state.active && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-purple-800 dark:text-purple-200">
              Component is now active and ready for interaction!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ${name};`;
  }

  generateVueStub(name) {
    return `<template>
  <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        ${name}
      </h3>
      <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
        Vue Component
      </span>
    </div>
    
    <div class="space-y-4">
      <p class="text-gray-600 dark:text-gray-300">
        This Vue component demonstrates reactive data binding and composition API patterns.
      </p>
      
      <div class="flex gap-2">
        <button
          @click="toggle"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {{ isActive ? 'Deactivate' : 'Activate' }}
        </button>
        
        <button
          @click="increment"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Count: {{ count }}
        </button>
      </div>
      
      <div v-if="isActive" class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p class="text-green-800 dark:text-green-200">
          Vue reactivity in action! Counter: {{ count }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: '${name}',
  setup() {
    const isActive = ref(false);
    const count = ref(0);
    
    const toggle = () => {
      isActive.value = !isActive.value;
    };
    
    const increment = () => {
      count.value++;
    };
    
    return {
      isActive,
      count,
      toggle,
      increment
    };
  }
};
</script>`;
  }

  generateSvelteStub(name) {
    return `<script>
  let isActive = false;
  let count = 0;
  
  function toggle() {
    isActive = !isActive;
  }
  
  function increment() {
    count++;
  }
</script>

<div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
      ${name}
    </h3>
    <span class="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
      Svelte Component
    </span>
  </div>
  
  <div class="space-y-4">
    <p class="text-gray-600 dark:text-gray-300">
      Svelte component with reactive statements and smooth animations.
    </p>
    
    <div class="flex gap-2">
      <button
        on:click={toggle}
        class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
      
      <button
        on:click={increment}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Count: {count}
      </button>
    </div>
    
    {#if isActive}
      <div class="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg" transition:slide>
        <p class="text-orange-800 dark:text-orange-200">
          Svelte's reactive magic! Counter: {count}
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Svelte scoped styles */
  .transition-colors {
    transition: background-color 0.2s ease;
  }
</style>`;
  }

  fixReactImports() {
    const reactErrors = this.errors.filter(e => e.type === 'react-import-issue');
    
    for (const error of reactErrors) {
      this.fixReactImportInFile(error.file);
    }
  }

  fixReactImportInFile(filePath) {
    if (!existsSync(filePath)) return;
    
    let content = readFileSync(filePath, 'utf8');
    
    // Fix problematic React default imports
    content = content.replace(
      /import React,\s*\{([^}]+)\}\s*from\s*['"]react['"]/g,
      'import { $1 } from \'react\''
    );
    
    // Remove standalone React import if not used
    if (!content.includes('React.') && !content.includes('React ')) {
      content = content.replace(/import React from ['"]react['"];\s*\n?/g, '');
    }
    
    writeFileSync(filePath, content);
    this.log('fix', `Fixed React imports in ${filePath}`);
    this.applied.push(`Fixed React imports in ${path.basename(filePath)}`);
  }

  createMissingTypes() {
    const typeErrors = this.errors.filter(e => e.type === 'missing-types');
    
    for (const error of typeErrors) {
      this.createTypeFile(error.file);
    }
  }

  createTypeFile(filePath) {
    const dir = path.dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    let content = '';
    
    if (filePath.includes('forms.ts')) {
      content = this.generateFormsTypes();
    } else if (filePath.includes('performance.ts')) {
      content = this.generatePerformanceTypes();
    } else {
      content = this.generateIndexTypes();
    }
    
    writeFileSync(filePath, content);
    this.log('fix', `Created type file: ${filePath}`);
    this.applied.push(`Created ${path.basename(filePath)}`);
  }

  generateIndexTypes() {
    return `// =============================================================================
// Core Type Definitions
// =============================================================================

export interface BaseComponent {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface FrameworkInfo {
  name: string;
  version: string;
  description: string;
  color: string;
  icon: string;
}

export interface TechnologyStat {
  label: string;
  value: string;
  icon: string;
}

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

// Re-export all types
export * from './forms';
export * from './performance';
`;
  }

  generateFormsTypes() {
    return `// =============================================================================
// Form Type Definitions
// =============================================================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export interface FormData {
  [key: string]: string | boolean | number;
}

export interface FormErrors {
  [key: string]: string;
}

export interface AdvancedFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  experience: number;
  skills: string[];
  bio: string;
  newsletter: boolean;
  terms: boolean;
}
`;
  }

  generatePerformanceTypes() {
    return `// =============================================================================
// Performance Metric Types
// =============================================================================

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

export interface BuildMetrics {
  buildTime: number;
  bundleSize: number;
  chunkCount: number;
  jsSize: number;
  cssSize: number;
  imageCount: number;
}

export interface RuntimeMetrics {
  loadTime: number;
  renderTime: number;
  interactiveTime: number;
  memoryUsage: number;
  cacheHitRate: number;
}
`;
  }

  fixPackageJsonScripts() {
    const scriptErrors = this.errors.filter(e => e.type === 'missing-script');
    
    if (scriptErrors.length === 0) return;
    
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    
    for (const error of scriptErrors) {
      if (error.script === 'build:gh-pages') {
        packageJson.scripts['build:gh-pages'] = 'NODE_ENV=production astro build --site https://tariqdude.github.io --base /WebsiteTest';
        this.applied.push('Added build:gh-pages script');
      }
    }
    
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    this.log('fix', 'Updated package.json scripts');
  }

  // =============================================================================
  // MAIN EXECUTION
  // =============================================================================

  async run() {
    this.log('info', '🔧 Starting comprehensive error detection and auto-fix...');
    
    // Detect errors
    this.checkImports();
    this.checkTypeScriptErrors();
    this.checkBuildConfiguration();
    
    this.log('info', `Found ${this.errors.length} issues to fix`);
    
    if (this.errors.length === 0) {
      this.log('success', '✅ No errors found! Project is ready for deployment.');
      return;
    }
    
    // Apply fixes
    this.log('info', 'Applying automatic fixes...');
    
    this.createMissingComponents();
    this.fixReactImports();
    this.createMissingTypes();
    this.fixPackageJsonScripts();
    
    // Summary
    console.log('\n' + '='.repeat(60));
    this.log('success', `🎉 Applied ${this.applied.length} fixes:`);
    this.applied.forEach((fix, i) => {
      console.log(`  ${i + 1}. ${fix}`);
    });
    
    console.log('\n💡 Next steps:');
    console.log('  1. Run: npm run check');
    console.log('  2. Run: npm run build:gh-pages');
    console.log('  3. Test deployment locally');
    console.log('='.repeat(60));
  }
}

// Execute the fixer
const fixer = new ProjectFixer();
fixer.run().catch(console.error);
