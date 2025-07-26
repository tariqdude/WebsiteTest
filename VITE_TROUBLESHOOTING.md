# Vite Configuration Troubleshooting Guide

## 🔧 Enhanced Vite Configuration

This project now includes a completely rewritten Vite configuration with enhanced error reporting, diagnostics, and smart optimization strategies.

## 📊 Available Commands

### Development
```bash
npm run dev              # Standard development server
npm run dev:verbose      # Development with verbose logging
```

### Building
```bash
npm run build           # Standard production build
npm run build:verbose   # Build with verbose logging
npm run build:analyze   # Run diagnostics before building
```

### Diagnostics
```bash
npm run diagnostics     # Run comprehensive project analysis
npm run check           # Astro type checking
npm run check:types     # TypeScript checking
```

### Maintenance
```bash
npm run clean           # Clean build artifacts and cache
npm run clean:logs      # Clean diagnostic logs
```

## 🔍 Diagnostic Features

### 1. Enhanced Logging
- Timestamped messages with elapsed time
- Categorized log levels (ERROR, WARN, INFO, SUCCESS, DEBUG)
- Automatic error log persistence to `.logs/build-errors.json`

### 2. Performance Monitoring
- Build time tracking for each phase
- Memory usage analysis
- Dependency optimization metrics

### 3. Smart Chunking Strategy
The new configuration includes intelligent code splitting:

- **Framework Chunks**: Separate chunks for React, Vue, Svelte, Solid.js, Preact
- **Library Chunks**: Dedicated chunks for Three.js, D3, animations, etc.
- **Component Chunks**: Organized by framework and purpose
- **Asset Organization**: Images, fonts, and CSS in organized folders

### 4. Dependency Analysis
- Automatic detection of missing peer dependencies
- Framework redundancy warnings
- Bundle size optimization suggestions

## 🚨 Common Issues & Solutions

### Build Failures

#### Import Resolution Errors
```
Could not resolve "../components/..."
```
**Solution**: The new config includes comprehensive path aliases:
- `@` → `src/`
- `@components` → `src/components/`
- `@lib` → `src/lib/`

#### Framework Conflicts
```
Multiple instances of React/Vue detected
```
**Solution**: The smart chunking strategy prevents framework conflicts by isolating each framework's components.

#### Memory Issues
```
JavaScript heap out of memory
```
**Solution**: The enhanced config includes:
- Optimized dependency chunking
- Proper memory management
- Build size monitoring

### Development Issues

#### HMR (Hot Module Replacement) Problems
- Enhanced HMR configuration with better error overlay
- Improved file change detection
- Framework-specific HMR optimizations

#### Slow Build Times
- Optimized dependency pre-bundling
- Smart chunk splitting reduces rebuild times
- Parallel processing where possible

## 📈 Performance Optimizations

### 1. Dependency Optimization
```javascript
// Automatically optimized dependencies
const OPTIMIZED_DEPS = {
  react: ['react', 'react-dom', 'react-hook-form'],
  vue: ['vue'],
  charts: ['chart.js', 'd3'],
  animations: ['gsap', 'framer-motion'],
  // ... and more
};
```

### 2. Smart Asset Handling
- Images: `assets/images/[name]-[hash].[ext]`
- Fonts: `assets/fonts/[name]-[hash].[ext]`
- CSS: `assets/css/[name]-[hash].[ext]`

### 3. Build Size Monitoring
- Automatic compressed size reporting
- Chunk size warnings (>1MB threshold)
- Bundle analysis recommendations

## 🔧 Configuration Customization

### Environment Variables
```bash
NODE_ENV=development    # Enable debug logging
VERBOSE_LOGS=true      # Extra verbose output
```

### Custom Aliases
Add new path aliases in `astro.config.mjs`:
```javascript
resolve: {
  alias: {
    '@custom': resolvePath('src/custom'),
    // Add your aliases here
  }
}
```

## 📝 Diagnostic Reports

### Error Logs
Location: `.logs/build-errors.json`
Contains detailed error information with stack traces.

### Performance Reports
Run `npm run diagnostics` to get:
- Dependency analysis
- File system analysis
- Build performance metrics
- Optimization recommendations

## 🆘 Getting Help

### Debug Information
1. Run `npm run diagnostics` for comprehensive analysis
2. Check `.logs/build-errors.json` for detailed error information
3. Use `npm run build:verbose` for detailed build output

### Common Debug Commands
```bash
# Check for TypeScript errors
npm run check:types

# Analyze dependencies
npm run diagnostics

# Clean all caches and rebuild
npm run clean && npm run build

# Verbose development mode
npm run dev:verbose
```

### Manual Debugging
1. Check component organization in `src/components/frameworks/`
2. Verify imports use correct paths with aliases
3. Ensure all frameworks are properly configured
4. Review chunk splitting in build output

## 📚 Additional Resources

- [Astro Documentation](https://docs.astro.build/)
- [Vite Configuration Guide](https://vitejs.dev/config/)
- [Performance Optimization](https://docs.astro.build/en/guides/performance/)

---

*This enhanced configuration provides comprehensive error reporting and diagnostics to help identify and resolve issues quickly.*
