const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function runDevApp(appName) {
  const appsDir = path.join(process.cwd(), 'apps');
  
  if (!appName) {
    console.error('Error: App name is required');
    console.log('Usage: pnpm dev:app <app-name>');
    process.exit(1);
  }

  if (!fs.existsSync(path.join(appsDir, appName))) {
    console.error(`Error: App '${appName}' not found in apps directory`);
    const apps = fs.readdirSync(appsDir).filter(file => 
      fs.statSync(path.join(appsDir, file)).isDirectory()
    );
    console.log('Available apps:', apps.join(', '));
    process.exit(1);
  }

  spawn('pnpm', ['--filter=' + appName, 'dev'], { 
    stdio: 'inherit',
    shell: true 
  });
}

runDevApp(process.argv[2]);