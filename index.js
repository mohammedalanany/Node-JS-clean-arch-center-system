const fs = require('fs');
const path = require('path');

// Log file path
const logPath = path.join(__dirname, 'crash.log');

// Log function
function logError(title, err) {
  const time = new Date().toISOString();
  const message = `[${time}] === ${title} ===\n${err.stack || err}\n\n`;
  try {
    fs.appendFileSync(logPath, message);
  } catch (e) {
    console.error('Failed to write to crash.log:', e);
  }
}

// Catch runtime unhandled errors
process.on('uncaughtException', (err) => {
  logError('UNCAUGHT EXCEPTION', err);
});

process.on('unhandledRejection', (reason) => {
  logError('UNHANDLED REJECTION', reason);
});

try {
  // Require the compiled application
  require('./dist/index.js');
} catch (err) {
  logError('STARTUP ERROR (Failed to require dist/index.js)', err);
  throw err;
}

