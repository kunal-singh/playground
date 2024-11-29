const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Utility functions
const validateAppName = (name) => {
  if (!name) {
    throw new Error('Please provide an app name');
  }
  
  const validNameRegex = /^[a-z0-9-]+$/;
  if (!validNameRegex.test(name)) {
    throw new Error('App name can only contain lowercase letters, numbers, and hyphens');
  }
  
  if (name.length > 214) {
    throw new Error('App name is too long');
  }
};

const ensureDirectoryExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
  }
};

const cleanupOnError = (appPath) => {
  if (fs.existsSync(appPath)) {
    try {
      fs.rmSync(appPath, { recursive: true, force: true });
      console.log('\x1b[33mCleaned up partially created app directory\x1b[0m');
    } catch (error) {
      console.error(`\x1b[31mFailed to cleanup directory ${appPath}: ${error.message}\x1b[0m`);
    }
  }
};

const writeFileWithBackup = (filePath, content) => {
  const backupPath = `${filePath}.backup`;
  try {
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
    }
    fs.writeFileSync(filePath, content);
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
  } catch (error) {
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
    }
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
};

async function createApp() {
  let currentDir = process.cwd();
  let appDir = null;
  
  try {
    // Validate app name
    const appName = process.argv[2];
    validateAppName(appName);

    // Setup directories
    const rootDir = process.cwd();
    const appsDir = path.join(rootDir, 'apps');
    appDir = path.join(appsDir, appName);

    // Check if app already exists
    if (fs.existsSync(appDir)) {
      throw new Error(`App '${appName}' already exists`);
    }

    // Ensure apps directory exists
    ensureDirectoryExists(appsDir);

    // Create Vite app
    console.log('\x1b[32mCreating Vite React app...\x1b[0m');
    process.chdir(appsDir);
    execSync(`pnpm create vite ${appName} --template react-ts`, { 
      stdio: 'inherit',
      timeout: 60000 // 1 minute timeout
    });

    // Configure app
    process.chdir(appDir);
    
    // Update package.json
    const packageJsonPath = path.join(appDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Remove the type: "module" field
    delete packageJson.type;
    
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      "@playground/eslint": "workspace:*",
      "@playground/tsconfig": "workspace:*",
      "@playground/tailwindcss": "workspace:*"
    };
    writeFileWithBackup(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Create configuration files
    const configs = {
      'tsconfig.json': JSON.stringify({
        files: [],
        references: [
          { path: "./tsconfig.app.json" },
          { path: "./tsconfig.node.json" }
        ]
      }, null, 2),
      
      'tsconfig.app.json': JSON.stringify({
        extends: "@playground/tsconfig/tsconfig.json",
        compilerOptions: {
          target: "ES2020",
          useDefineForClassFields: true,
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,

          /* Bundler mode */
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          isolatedModules: true,
          moduleDetection: "force",
          noEmit: true,
          jsx: "react-jsx",

          /* Linting */
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true
        },
        include: ["src"]
      }, null, 2),

      'tsconfig.node.json': JSON.stringify({
        extends: "@playground/tsconfig/tsconfig.json",
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2023"],
          module: "ESNext",
          skipLibCheck: true,

          /* Bundler mode */
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          isolatedModules: true,
          moduleDetection: "force",
          noEmit: true,

          /* Linting */
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true
        },
        include: ["vite.config.ts"]
      }, null, 2),

      'eslint.config.js': `import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintConfig from '@playground/eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, ...eslintConfig],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)`,
      'postcss.config.js': `module.exports = require("@playground/tailwindcss/postcss.config");`,
      'tailwind.config.js': `import config from "@playground/tailwindcss/tailwind.config";\n\n/** @type {import("tailwindcss").Config} */\nmodule.exports = {\n  ...config,\n  content: [\n    "./src/**/*.{ts,tsx}",\n  ],\n};`,
    };

    for (const [filename, content] of Object.entries(configs)) {
      writeFileWithBackup(path.join(appDir, filename), content);
    }

    // Install dependencies
    console.log('\x1b[32mInstalling dependencies...\x1b[0m');
    execSync('pnpm install', { 
      stdio: 'inherit',
      timeout: 120000 // 2 minutes timeout
    });

    console.log('\x1b[32mApp created successfully!\x1b[0m');

  } catch (error) {
    console.error(`\x1b[31mError: ${error.message}\x1b[0m`);
    if (appDir) {
      cleanupOnError(appDir);
    }
    process.exit(1);
  } finally {
    // Always return to original directory
    process.chdir(currentDir);
  }
}

createApp();