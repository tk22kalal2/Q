
const fs = require('fs');
const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

const token = generateToken();
const data = JSON.stringify({ token: token, date: new Date().toISOString().split('T')[0] });
fs.writeFileSync('Plugins/daily_token.json', data);
console.log('Token generated and saved:', token);
