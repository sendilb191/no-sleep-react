#!/usr/bin/env node

/**
 * No Sleep App Launcher
 * A simple launcher script to serve the app with clean URLs
 */

import { execSync } from 'child_process';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || 'localhost';

// ANSI colors for better console output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if dist folder exists and has index.html
function checkBuild() {
  const distPath = path.join(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');

  if (!fs.existsSync(distPath) || !fs.existsSync(indexPath)) {
    log('❌ Build not found! Building the app first...', 'yellow');
    try {
      execSync('npm run build', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      });
      log('✅ Build completed!', 'green');
    } catch (error) {
      log('❌ Build failed!', 'red');
      process.exit(1);
    }
  }

  return indexPath;
}

// Create HTTP server
function createServer(indexPath) {
  return http.createServer((req, res) => {
    // Set CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Always serve index.html for SPA routing
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading the app');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  });
}

// Open browser automatically
function openBrowser(url) {
  const platform = process.platform;
  let command;

  if (platform === 'darwin') {
    command = 'open';
  } else if (platform === 'win32') {
    command = 'start';
  } else {
    command = 'xdg-open';
  }

  try {
    execSync(`${command} ${url}`, { stdio: 'ignore' });
  } catch (error) {
    log(
      'Could not open browser automatically. Please open the URL manually.',
      'yellow'
    );
  }
}

// Main function
async function main() {
  log('🚀 No Sleep App Launcher', 'blue');
  log('========================', 'blue');

  const indexPath = checkBuild();
  const server = createServer(indexPath);
  const localIP = await getLocalIP();

  server.listen(PORT, HOST, () => {
    const url = `http://${HOST}:${PORT}`;

    log('');
    log('✅ Server started successfully!', 'green');
    log('');
    log(`🌐 Local URL:    ${colors.bold}${url}${colors.reset}`, 'green');
    log(
      `📱 Network URL:  ${colors.bold}http://${localIP}:${PORT}${colors.reset}`,
      'green'
    );
    log('');
    log('📍 Available routes:', 'blue');
    log(`   • Home:     ${url}/`, 'blue');
    log(`   • Settings: ${url}/#/settings`, 'blue');
    log(`   • About:    ${url}/#/about`, 'blue');
    log('');
    log('💡 Tips:', 'yellow');
    log('   • Press Ctrl+C to stop the server', 'yellow');
    log(
      '   • Share the Network URL with devices on the same network',
      'yellow'
    );
    log('   • The app uses hash routing for compatibility', 'yellow');
    log('');

    // Open browser after a short delay
    setTimeout(() => {
      openBrowser(url);
    }, 1000);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('');
    log('👋 Shutting down server...', 'yellow');
    server.close(() => {
      log('✅ Server stopped successfully!', 'green');
      process.exit(0);
    });
  });
}

// Get local IP address
async function getLocalIP() {
  try {
    const os = await import('os');
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (error) {
    // Fallback if we can't get the IP
  }

  return 'localhost';
}

// Run the launcher
main();
