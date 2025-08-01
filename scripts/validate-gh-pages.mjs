import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// --- Enhanced Logging ---
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

const log = (message, color = colors.reset) => console.log(`${color}${message}${colors.reset}`);
const logSuccess = (message) => log(`✅ ${message}`, colors.green);
const logError = (message) => log(`❌ ${message}`, colors.red);
const logInfo = (message) => log(`ℹ️ ${message}`, colors.cyan);

// Helper to normalize paths relative to distDir
const resolveDistPath = (baseFile, relativeOrAbsolutePath, distDir) => {
  if (relativeOrAbsolutePath.startsWith("/")) {
    return path.join(distDir, relativeOrAbsolutePath.substring(1));
  }
  return path.resolve(path.dirname(baseFile), relativeOrAbsolutePath);
};

// --- Helper Functions ---
const getAllHtmlFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(file));
    } else if (file.endsWith(".html")) {
      results.push(file);
    }
  });
  return results;
};

// --- Main Script ---
logInfo("Starting pre-commit validation suite...");

// Function to get Git config
const getGitConfig = (key) => {
  try {
    return execSync(`git config --get ${key}`).toString().trim();
  } catch (err) {
    logError(`Error getting Git config: ${err.message}`);
    return null;
  }
};

// Get GitHub username and repo name
const githubUrl = getGitConfig("remote.origin.url");
if (!githubUrl) {
  logError("Could not find remote.origin.url in Git config.");
  process.exit(1);
}

const match = githubUrl.match(/github\.com[/:](?<username>[^/]+)\/(?<repo>[^/]+)\.git/);
if (!match) {
  logError("Could not parse GitHub username and repo from remote.origin.url.");
  process.exit(1);
}

const { username, repo } = match.groups;

const expectedSite = `https://${username}.github.io`;
const expectedBase = `/${repo}`;

// Check astro.config.mjs
const astroConfigPath = path.resolve(process.cwd(), "astro.config.mjs");
if (!fs.existsSync(astroConfigPath)) {
  logError("astro.config.mjs not found.");
  process.exit(1);
}

let astroConfigModule;
try {
  // Dynamically import the Astro config file
  astroConfigModule = await import(astroConfigPath);
} catch (err) {
  logError(`Failed to load astro.config.mjs: ${err.message}`);
  process.exit(1);
}

const configuredSite = astroConfigModule.default.site;
const configuredBase = astroConfigModule.default.base;

if (configuredSite !== expectedSite) {
  logError(
    `astro.config.mjs has an incorrect site property. Expected: '${expectedSite}', Got: '${configuredSite}'`
  );
  process.exit(1);
}

if (configuredBase !== expectedBase) {
  logError(
    `astro.config.mjs has an incorrect base property. Expected: '${expectedBase}', Got: '${configuredBase}'`
  );
  process.exit(1);
}

logSuccess("astro.config.mjs is configured correctly for GitHub Pages.");

// --- Code Quality Gates ---
try {
  logInfo("Running linter...");
  execSync("npm run lint", { stdio: "inherit" });
  logSuccess("Linter check passed.");
} catch (_err) {
  logError(`Linter check failed: ${_err.message}. Please fix the errors and try again.`);
  process.exit(1);
}

try {
  logInfo("Checking formatting...");
  execSync("npm run format", { stdio: "inherit" });
  logSuccess("Formatting check passed.");
} catch (_err) {
  logError(
    `Formatting check failed: ${_err.message}. Please run npm run format to fix the issues.`
  );
  process.exit(1);
}

// Run a test build
try {
  logInfo("Running a test build...");
  execSync("npm run build", { stdio: "inherit" });
  logSuccess("Test build successful.");
} catch (_err) {
  logError(`Test build failed: ${_err.message}.`);
  process.exit(1);
}

// Check for .nojekyll file
const noJekyllPath = path.resolve(process.cwd(), "dist", ".nojekyll");
if (!fs.existsSync(noJekyllPath)) {
  logError(".nojekyll file not found in dist directory after build.");
  process.exit(1);
}

logSuccess(".nojekyll file found.");

// --- Post-Build Integrity Checks ---
logInfo("Running post-build integrity checks...");

const distDir = path.resolve(process.cwd(), "dist");
const htmlFiles = getAllHtmlFiles(distDir);
let brokenLinksFound = false;

htmlFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8");
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[1];

    // Ignore external links, anchor links, and mailto links
    if (link.startsWith("http") || link.startsWith("#") || link.startsWith("mailto:")) {
      continue;
    }

    // Resolve the absolute path for the linked file
    const absoluteLinkPath = resolveDistPath(file, link, distDir);

    // Check if the linked file or its corresponding index.html exists
    if (
      !fs.existsSync(absoluteLinkPath) &&
      !fs.existsSync(path.join(absoluteLinkPath, "index.html"))
    ) {
      logError(`Broken link found in ${file}:\n  -> ${link}`);
      brokenLinksFound = true;
    }
  }
});

if (brokenLinksFound) {
  logError("Broken links detected. Please fix them before committing.");
  process.exit(1);
} else {
  logSuccess("No broken links found.");
}

let missingAssetsFound = false;

htmlFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8");
  const assetRegex = /<(?:img|script|link)\s+(?:[^>]*?\s+)?(?:src|href)="([^"]*)"/g;
  let match;

  while ((match = assetRegex.exec(content)) !== null) {
    const asset = match[1];

    // Ignore external assets
    if (asset.startsWith("http")) {
      continue;
    }

    // Resolve the absolute path for the asset
    const absoluteAssetPath = resolveDistPath(file, asset, distDir);

    if (!fs.existsSync(absoluteAssetPath)) {
      logError(`Missing asset found in ${file}:\n  -> ${asset}`);
      missingAssetsFound = true;
    }
  }
});

if (missingAssetsFound) {
  logError("Missing assets detected. Please fix them before committing.");
  process.exit(1);
} else {
  logSuccess("No missing assets found.");
}

logInfo("All GitHub Pages validation checks passed!");
