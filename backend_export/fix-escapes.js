import fs from 'fs';
let content = fs.readFileSync('index.js', 'utf8');
content = content.replace(/\\\`/g, '`');
fs.writeFileSync('index.js', content);
console.log('Fixed escaped backticks');
