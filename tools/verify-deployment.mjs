#!/usr/bin/env node
/**
 * GitHub Pages Deployment Verification
 * Post-deployment verification and monitoring
 */

import https from 'https';
import { URL } from 'url';

const SITE_URL = 'https://tariqdude.github.io/WebsiteTest';
const EXPECTED_PAGES = ['/', '/about', '/projects', '/showcase'];

class DeploymentVerifier {
  constructor() {
    this.results = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m',
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  async checkUrl(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname,
        method: 'GET',
        timeout: timeout,
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
            url: url,
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  async verifyPage(path) {
    const url = `${SITE_URL}${path}`;
    this.log(`🔍 Checking ${url}...`, 'info');

    try {
      const response = await this.checkUrl(url);

      if (response.status === 200) {
        // Basic content checks
        const body = response.body.toLowerCase();
        const hasTitle = body.includes('<title>');
        const hasContent = body.length > 1000;
        const hasAssets = body.includes('/WebsiteTest/');

        this.results.push({
          path,
          status: 'SUCCESS',
          httpStatus: response.status,
          hasTitle,
          hasContent,
          hasAssets,
          size: response.body.length,
        });

        this.log(
          `  ✅ ${path} - Status: ${response.status}, Size: ${response.body.length} bytes`,
          'success'
        );

        if (!hasAssets) {
          this.log(
            `  ⚠️ Warning: Base path '/WebsiteTest/' not found in content`,
            'warning'
          );
        }

        return true;
      } else {
        this.results.push({
          path,
          status: 'FAILED',
          httpStatus: response.status,
          error: `HTTP ${response.status}`,
        });
        this.log(
          `  ❌ ${path} - Failed with status: ${response.status}`,
          'error'
        );
        return false;
      }
    } catch (error) {
      this.results.push({
        path,
        status: 'ERROR',
        httpStatus: null,
        error: error.message,
      });
      this.log(`  ❌ ${path} - Error: ${error.message}`, 'error');
      return false;
    }
  }

  async verifyAssets() {
    const assetUrls = [
      `${SITE_URL}/favicon.svg`,
      `${SITE_URL}/pwa-192x192.png`,
      `${SITE_URL}/robots.txt`,
      `${SITE_URL}/sitemap-index.xml`,
    ];

    this.log('\n🎨 Verifying Assets...', 'info');

    for (const url of assetUrls) {
      try {
        const response = await this.checkUrl(url);
        if (response.status === 200) {
          this.log(`  ✅ ${url.split('/').pop()} - OK`, 'success');
        } else {
          this.log(
            `  ⚠️ ${url.split('/').pop()} - Status: ${response.status}`,
            'warning'
          );
        }
      } catch (error) {
        this.log(
          `  ❌ ${url.split('/').pop()} - Error: ${error.message}`,
          'error'
        );
      }
    }
  }

  async verifyPWA() {
    this.log('\n📱 Verifying PWA Features...', 'info');

    try {
      const manifestUrl = `${SITE_URL}/manifest.webmanifest`;
      const response = await this.checkUrl(manifestUrl);

      if (response.status === 200) {
        const manifest = JSON.parse(response.body);
        this.log(`  ✅ PWA Manifest - Found`, 'success');
        this.log(`  📋 App Name: ${manifest.name || 'Not specified'}`, 'info');
        this.log(
          `  🎨 Theme Color: ${manifest.theme_color || 'Not specified'}`,
          'info'
        );
        this.log(
          `  🖼️ Icons: ${manifest.icons ? manifest.icons.length : 0} found`,
          'info'
        );
      } else {
        this.log(
          `  ⚠️ PWA Manifest - Not found (${response.status})`,
          'warning'
        );
      }
    } catch (error) {
      this.log(`  ❌ PWA Manifest - Error: ${error.message}`, 'error');
    }

    // Check service worker
    try {
      const swUrl = `${SITE_URL}/sw.js`;
      const response = await this.checkUrl(swUrl);

      if (response.status === 200) {
        this.log(`  ✅ Service Worker - Found`, 'success');
      } else {
        this.log(
          `  ⚠️ Service Worker - Not found (${response.status})`,
          'warning'
        );
      }
    } catch (error) {
      this.log(`  ❌ Service Worker - Error: ${error.message}`, 'error');
    }
  }

  async generateReport() {
    const successful = this.results.filter(
      (r) => r.status === 'SUCCESS'
    ).length;
    const failed = this.results.filter((r) => r.status !== 'SUCCESS').length;

    this.log('\n📊 DEPLOYMENT VERIFICATION REPORT', 'info');
    this.log('=====================================', 'info');
    this.log(
      `✅ Successful: ${successful}`,
      successful > 0 ? 'success' : 'info'
    );
    this.log(`❌ Failed: ${failed}`, failed > 0 ? 'error' : 'info');
    this.log(`🌐 Site URL: ${SITE_URL}`, 'info');

    if (failed === 0) {
      this.log('\n🎉 Deployment verification PASSED!', 'success');
      this.log('🚀 Your site is live and working correctly!', 'success');
      return true;
    } else {
      this.log('\n⚠️ Some issues were found:', 'warning');
      this.results
        .filter((r) => r.status !== 'SUCCESS')
        .forEach((result) => {
          this.log(`  • ${result.path}: ${result.error}`, 'error');
        });
      return false;
    }
  }

  async run() {
    this.log('🌐 Starting GitHub Pages Deployment Verification...', 'info');
    this.log(`📍 Site: ${SITE_URL}`, 'info');

    // Wait a bit for deployment to settle
    this.log('⏳ Waiting for deployment to settle...', 'info');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    this.log('\n📄 Verifying Pages...', 'info');
    for (const path of EXPECTED_PAGES) {
      await this.verifyPage(path);
    }

    await this.verifyAssets();
    await this.verifyPWA();

    const success = await this.generateReport();

    if (!success) {
      this.log('\n💡 Troubleshooting Tips:', 'info');
      this.log('  • Check GitHub Pages settings in repository', 'info');
      this.log('  • Verify the source branch is correct', 'info');
      this.log(
        '  • Ensure the site URL matches your repository settings',
        'info'
      );
      this.log('  • Check GitHub Actions logs for build errors', 'info');
      process.exit(1);
    }
  }
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const verifier = new DeploymentVerifier();
  verifier.run().catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
}
