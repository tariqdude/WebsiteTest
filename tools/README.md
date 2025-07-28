# 🛠️ Deployment Tools

This directory contains unified deployment management tools for the Astro multi-framework showcase project.

## 🚀 Quick Start

```bash
# Check current deployment status
npm run deploy:status

# Run quick validation test
npm run deploy:test

# Full deployment validation
npm run deploy:validate

# Auto-fix common issues
npm run deploy:fix
```

## 📋 Tool Overview

### 1. **deployment-manager.mjs** - Main Deployment System
Comprehensive deployment validation, fixing, and monitoring system.

**Features:**
- Environment validation (Node.js, npm, dependencies)
- Astro configuration validation
- TypeScript checking
- Production build testing
- Auto-fix capabilities
- Detailed reporting

**Usage:**
```bash
npm run deploy:validate  # Validation only
npm run deploy:fix       # Auto-fix issues
npm run deploy:full      # Complete validation + auto-fix
```

### 2. **quick-test.mjs** - Fast Development Testing
Quick pre-deployment validation for development workflow.

**Features:**
- Fast environment check
- Basic build test
- TypeScript validation
- Quick pass/fail results

**Usage:**
```bash
npm run deploy:test
```

### 3. **status-dashboard.mjs** - Project Health Monitor
Real-time deployment status and project health monitoring.

**Features:**
- Visual status indicators
- Component health checks
- Deployment readiness assessment
- Quick command recommendations

**Usage:**
```bash
npm run deploy:status
```

## 🎯 Workflow Integration

### Development Workflow
1. **Before committing**: `npm run deploy:test`
2. **Check status**: `npm run deploy:status`
3. **Fix issues**: `npm run deploy:fix`

### Deployment Workflow
1. **Full validation**: `npm run deploy:validate`
2. **Auto-fix if needed**: `npm run deploy:fix`
3. **Commit and push**: GitHub Actions will handle deployment

### CI/CD Integration
The GitHub Actions workflow automatically runs:
- `npm run deploy:validate` - Pre-deployment validation
- `npm run build:gh-pages` - Production build
- Automated deployment to GitHub Pages

## 📊 Status Indicators

- 🟢 **Good**: Everything working perfectly
- 🟡 **Warning**: Minor issues, deployment possible
- 🔴 **Poor**: Major issues, deployment blocked
- ❌ **Error**: Critical failures
- ⚪ **Missing**: Required components not found
- ❓ **Unknown**: Status unclear

## 🔧 Auto-Fix Capabilities

The deployment manager can automatically fix:
- Missing package.json scripts
- Incorrect Astro configuration
- Dependency issues
- Basic TypeScript errors
- GitHub Actions workflow problems

## 📁 Output Files

Tools generate the following files:
- `deployment-report.json` - Detailed validation report
- `dist/` - Production build output
- `.github/workflows/deploy.yml` - Updated workflow (if auto-fixed)

## 🚨 Troubleshooting

### Common Issues

1. **Node.js Version Error**
   ```bash
   # Update Node.js to 18+ or 20+
   # Check with: node --version
   ```

2. **Build Failures**
   ```bash
   npm run clean:all
   npm install
   npm run deploy:fix
   ```

3. **TypeScript Errors**
   ```bash
   npm run check
   npm run deploy:fix
   ```

4. **GitHub Pages Not Updating**
   - Check GitHub repository settings
   - Ensure GitHub Actions has write permissions
   - Verify workflow is running in Actions tab

### Manual Fixes

If auto-fix doesn't resolve issues:

1. **Check astro.config.mjs**:
   ```javascript
   export default defineConfig({
     site: 'https://tariqdude.github.io',
     base: '/WebsiteTest',
     output: 'static'
   });
   ```

2. **Verify package.json scripts**:
   ```json
   {
     "scripts": {
       "build:gh-pages": "NODE_ENV=production astro build --site https://tariqdude.github.io --base /WebsiteTest"
     }
   }
   ```

## 🎉 Success Indicators

Deployment is ready when:
- ✅ All tools show green status
- ✅ `npm run deploy:test` passes
- ✅ `npm run deploy:validate` scores 80+
- ✅ `dist/` contains index.html and assets
- ✅ GitHub Actions workflow is configured

## 📞 Support

For issues not covered by auto-fix:
1. Run `npm run deploy:status` for diagnosis
2. Check `deployment-report.json` for details
3. Review GitHub Actions logs for deployment issues
4. Ensure all dependencies are compatible
