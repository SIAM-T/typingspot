import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

async function applyMigrations() {
  try {
    console.log('Starting database migration...');
    
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'src', 'migrations', 'setup_database.sql');
    console.log('Reading migration file:', sqlPath);
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (const statement of statements) {
      try {
        console.log('Executing statement:', statement.substring(0, 100) + '...');
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error('Error executing statement:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error executing statement:', error);
        throw error;
      }
    }
    
    console.log('Migrations applied successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exit(1);
  }
}

// Run migrations
console.log('Using Supabase URL:', supabaseUrl);
applyMigrations(); 