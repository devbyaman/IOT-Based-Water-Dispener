const { execSync } = require('child_process');
const path = require('path');

console.log('Starting Vercel build for client...');

// Change to the client directory
process.chdir(path.resolve(__dirname));

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Build the client
console.log('Building client...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Client build completed successfully!'); 