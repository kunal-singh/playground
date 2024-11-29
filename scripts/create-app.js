const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function createApp() {
  // Get app name from command line argument
  const appName = process.argv[2];
  
  if (!appName) {
    console.error('Please provide an app name');
    process.exit(1);
  }

  // Ensure we're in the root directory
  const rootDir = process.cwd();
  const appsDir = path.join(rootDir, 'apps');

  // Create apps directory if it doesn't exist
  if (!fs.existsSync(appsDir)) {
    fs.mkdirSync(appsDir);
  }

  // Change to apps directory before creating the app
  process.chdir(appsDir);

  // Create Vite React app
  console.log('Creating Vite React app...');
  execSync(`pnpm create vite ${appName} --template react-ts`, { stdio: 'inherit' });

  // Navigate to the newly created app directory
  const appDir = path.join(appsDir, appName);
  process.chdir(appDir);
  
  // Update package.json to use workspace dependencies
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    "@playground/eslint": "workspace:*",
    "@playground/tsconfig": "workspace:*",
    "@playground/tailwindcss": "workspace:*"
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

  // Create eslint config
  const eslintConfig = `import eslintConfig from '@playground/eslint';
export default eslintConfig;`;
  fs.writeFileSync('eslint.config.js', eslintConfig);

  // Create tsconfig
  const tsConfig = {
    extends: "@playground/tsconfig/tsconfig.json",
    compilerOptions: {
      jsx: "react-jsx"
    },
    include: ["src"]
  };
  fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2));

  // Create postcss config for tailwind
  const postcssConfig = `module.exports = require("@playground/tailwindcss/postcss.config");`;
  fs.writeFileSync('postcss.config.js', postcssConfig);

  // Create tailwind config
  const tailwindConfig = `import config from "@playground/tailwindcss/tailwind.config";

/** @type {import("tailwindcss").Config} */
module.exports = {
  ...config,
  content: [
    "./src/**/*.{ts,tsx}",
  ],
};`;
  fs.writeFileSync('tailwind.config.js', tailwindConfig);

  // Install dependencies from the app directory
  console.log('Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  // Return to root directory
  process.chdir(rootDir);

  console.log('App created successfully!');
}

createApp();