require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  const { data, error } = await supabase.storage.getBucket('products');
  if (error) {
    if (error.message.includes('Bucket not found') || error.message.includes('row not found')) {
      console.log('Creating products bucket...');
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('products', { public: true });
      if (createError) {
         console.log('Error creating bucket:', createError.message);
      } else {
         console.log('Created bucket:', newBucket);
      }
    } else {
      console.log('Error fetching bucket:', error);
    }
  } else {
    console.log('Bucket products already exists.', data);
  }
}
setupStorage();
