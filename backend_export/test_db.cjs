const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function test() {
  try {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
    const info = await db.all("PRAGMA table_info(blogs)");
    console.log('Blogs Table Info:', info);
  } catch (error) {
    console.error('Error querying database:', error);
  }
}
test();
