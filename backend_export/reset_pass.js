const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');

async function reset() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  const email = 'james@gmail.com';
  const newPassword = 'password123';
  const password_hash = await bcrypt.hash(newPassword, 10);

  // Check if consultant exists
  const consultant = await db.get('SELECT * FROM consultants WHERE email = ?', email);
  if (consultant) {
    console.log('Found consultant:', consultant.email);
    // update status to approved
    await db.run('UPDATE consultants SET approval_status = ? WHERE id = ?', 'approved', consultant.id);
    
    // update user password
    await db.run('UPDATE users SET password = ? WHERE id = ?', password_hash, consultant.user_id);
    console.log('Password reset to password123 and status set to approved.');
  } else {
    console.log('Consultant not found. Creating one...');
    const userResult = await db.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      email, password_hash, 'consultant'
    );
    const userId = userResult.lastID;
    
    await db.run(
      `INSERT INTO consultants (user_id, name, email, status, featured, approval_status)
       VALUES (?, ?, ?, 'offline', 0, 'approved')`,
      userId, 'James Consultant', email
    );
    console.log('Created consultant james@gmail.com with password123');
  }
}

reset().catch(console.error);
