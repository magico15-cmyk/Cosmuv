import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jkejurvqypiytxrgylde.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZWp1cnZxeXBpeXR4cmd5bGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNjEyNDgsImV4cCI6MjA5NzczNzI0OH0.b0tAj-mEBQtjIE2rgMUjVtvQ_aChNul5Pflsi8I5fQs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const testId = '9e46ba6d-b416-4f32-8016-2cd3d2ceb6c9';
  console.log(`\nTesting UPDATE with fake column on store ID: ${testId}`);
  
  const { data: updateData, error: updateError } = await supabase
    .from('stores')
    .update({ fake_column_does_not_exist: 'test' })
    .eq('id', testId)
    .select();

  console.log("Update Error:", updateError);
  console.log("Update Data returned:", updateData);
}

test();
