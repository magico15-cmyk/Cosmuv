const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.jkejurvqypiytxrgylde:Sello159357@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'
});

async function run() {
  try {
    await client.connect();
    await client.query("ALTER TABLE stores ADD COLUMN IF NOT EXISTS menu_font text DEFAULT 'Cairo', ADD COLUMN IF NOT EXISTS body_font text DEFAULT 'Cairo';");
    console.log('Columns added successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
