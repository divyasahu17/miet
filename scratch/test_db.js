import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function test() {
  try {
    const db = await open({
      filename: '../backend_export/database.sqlite',
      driver: sqlite3.Database
    });
    const users = await db.all('SELECT * FROM users LIMIT 5');
    console.log('Users in database:', users);
    const consultants = await db.all('SELECT * FROM consultants LIMIT 5');
    console.log('Consultants in database:', consultants);
  } catch (error) {
    console.error('Error querying database:', error);
  }
}
test();
