import { query } from '../config/db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Read and execute initial schema
    const initialSchema = readFileSync(join(__dirname, '../../../database/migrations/001_initial_schema.sql'), 'utf8');
    await query(initialSchema);
    console.log('Initial schema applied');

    // Read and execute asset allocation schema
    const assetSchema = readFileSync(join(__dirname, '../../../database/migrations/002_asset_allocation_schema.sql'), 'utf8');
    await query(assetSchema);
    console.log('Asset allocation schema applied');

    // Read and execute PIN authentication migration
    const pinMigration = readFileSync(join(__dirname, '../../../database/migrations/003_add_pin_authentication.sql'), 'utf8');
    await query(pinMigration);
    console.log('PIN authentication migration applied');

    // Read and execute password reset migration
    const passwordReset = readFileSync(join(__dirname, '../../../database/migrations/003_password_reset.sql'), 'utf8');
    await query(passwordReset);
    console.log('Password reset migration applied');

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();