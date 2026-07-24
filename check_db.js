const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const script = `
    cd /var/www/backend
    node -e "
      const fs = require('fs');
      const lines = fs.readFileSync('index.js', 'utf-8').split('\n');
      console.log(lines.slice(2135, 2155).join('\n'));
    "
  `;
  conn.exec(script, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      conn.end();
    }).on('data', (d) => process.stdout.write(d));
  });
}).connect({
  host: 'srv1404691.hstgr.cloud',
  port: 22,
  username: 'root',
  password: 'P@ssw0rd485226',
  readyTimeout: 20000
});
