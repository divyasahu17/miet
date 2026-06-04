const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function migrate() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  console.log('Starting migration...');

  try {
    // 1. Rename old table
    await db.exec('ALTER TABLE subscription_plans RENAME TO subscription_plans_old;');
    console.log('Renamed to subscription_plans_old');

    // 2. Create new table
    await db.exec(`
      CREATE TABLE subscription_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_key TEXT,
        plan_name TEXT,
        billing_cycle TEXT CHECK(billing_cycle IN ('monthly','quarterly','yearly')),
        target_audience TEXT DEFAULT 'user',
        base_price REAL,
        currency TEXT DEFAULT 'INR',
        description TEXT,
        features_json TEXT DEFAULT '{}',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created new subscription_plans table');

    // 3. Migrate data
    const oldPlans = await db.all('SELECT * FROM subscription_plans_old');
    for (const plan of oldPlans) {
      // Treat existing plans as consultant plans for now since they existed before
      await db.run(`
        INSERT INTO subscription_plans (
          id, plan_key, plan_name, billing_cycle, target_audience, base_price, currency, description, is_active, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        plan.id, plan.plan_key, plan.plan_name, plan.billing_cycle, 'consultant', plan.base_price, plan.currency, plan.description, plan.is_active, plan.created_at
      ]);
    }
    console.log('Migrated data');

    // 4. Drop old table
    await db.exec('DROP TABLE subscription_plans_old;');
    console.log('Dropped old table');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
