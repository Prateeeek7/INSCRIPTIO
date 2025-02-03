// Import dependencies
const path = require('path');
const fs = require('fs');

// Get all .js files in current directory
const jsFiles = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index1.js');

// Export all files
module.exports = jsFiles.reduce((exports, file) => {
  const name = path.basename(file, '.js');
  exports[name] = require(`./${file}`);
  return exports;
}, {});

// Log loaded files
console.log('Loaded JavaScript files:', jsFiles);