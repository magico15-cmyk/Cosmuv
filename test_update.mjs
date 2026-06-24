import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jkejurvqypiytxrgylde.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZWp1cnZxeXBpeXR4cmd5bGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNjEyNDgsImV4cCI6MjA5NzczNzI0OH0.b0tAj-mEBQtjIE2rgMUjVtvQ_aChNul5Pflsi8I5fQs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data: stores, error: err1 } = await supabase.from('stores').select('*');
  if (err1) {
    console.error("Error fetching stores:", err1);
    return;
  }
  
  console.log("Found stores:", stores.length);
  for (const s of stores) {
    console.log(`- ID: ${s.id}, Name: ${s.store_name}, Subdomain: ${s.subdomain}`);
  }

  // Check RLS by attempting to update the first store
  if (stores.length > 0) {
    const testId = stores[0].id;
    console.log(`\nTesting UPDATE on store ID: ${testId}`);
    
    const { data: updateData, error: updateError } = await supabase
      .from('stores')
      .update({ primary_color: '#112233' })
      .eq('id', testId)
      .select();

    console.log("Update Error:", updateError);
    console.log("Update Data returned:", updateData);
  }
}

test();
