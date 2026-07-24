const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection ready. Uploading index.js...');
  
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    const localFile = 'backend_export/index.js';
    // The previous run found it at /var/www/html/backend_backup/backend_export
    // Wait, the previous run output: "Found project at: /var/www/html/backend_backup"
    // and backendPath was /var/www/html/backend_backup/backend_export.
    const remoteFile = '/var/www/backend/index.js';
    
    sftp.fastPut(localFile, remoteFile, (errPut) => {
      if (errPut) throw errPut;
      console.log('index.js uploaded successfully.');
      
      console.log('Updating .env and restarting PM2...');
      const script = `
        cd /var/www/backend
        # Update SMTP settings in .env
        sed -i 's/^SMTP_HOST=.*/SMTP_HOST=mail.miet.life/' .env
        sed -i 's/^SMTP_PORT=.*/SMTP_PORT=465/' .env
        sed -i 's/^SMTP_USER=.*/SMTP_USER=info@miet.life/' .env
        sed -i 's/^SMTP_PASS=.*/SMTP_PASS=mietlife@120/' .env
        
        pm2 restart miet-backend --update-env
        pm2 restart miet-frontend --update-env
      `;
      
      conn.exec(script, (errExec, stream) => {
        if (errExec) throw errExec;
        stream.on('close', () => {
          console.log('PM2 restarted successfully. All done!');
          conn.end();
        }).on('data', (d) => process.stdout.write(d))
          .stderr.on('data', (d) => process.stderr.write(d));
      });
    });
  });
}).connect({
  host: 'srv1404691.hstgr.cloud',
  port: 22,
  username: 'root',
  password: 'P@ssw0rd485226',
  readyTimeout: 20000
});
