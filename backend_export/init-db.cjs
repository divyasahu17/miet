const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function run() {
  console.log('Opening database...');
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  console.log('Creating tables...');
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const defaultSettings = [
    ['commission_course', '10', 'Commission percentage for Course products'],
    ['commission_ebook', '10', 'Commission percentage for E-Book products'],
    ['commission_gadget', '10', 'Commission percentage for Gadget products'],
    ['commission_app', '10', 'Commission percentage for App products']
  ];
  
  for (const [key, val, desc] of defaultSettings) {
    await db.run(
      'INSERT OR IGNORE INTO admin_settings (setting_key, setting_value, description) VALUES (?, ?, ?)',
      [key, val, desc]
    );
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultant_id INTEGER NOT NULL,
      order_id INTEGER,
      amount REAL NOT NULL,
      type TEXT CHECK(type IN ('earning', 'withdrawal', 'adjustment')) NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(consultant_id) REFERENCES consultants(id) ON DELETE CASCADE,
      FOREIGN KEY(order_id) REFERENCES orders_new(id) ON DELETE SET NULL
    );
  `);

  try {
    await db.exec(`ALTER TABLE consultants ADD COLUMN wallet_balance REAL DEFAULT 0.00;`);
    console.log('Added wallet_balance to consultants');
  } catch (e) {
    if (!e.message.includes('duplicate column name')) console.error(e);
  }

  console.log('DB init done!');
}

run().catch(console.error);
