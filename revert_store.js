const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function revertStore() {
  const { data, error } = await supabase.from('stores')
    .update({ 
      subdomain: 'sello',
      custom_domain: 'sello.com'
    })
    .eq('id', '9e46ba6d-b416-4f32-8016-2cd3d2ceb6c9')
    .select();
    
  if (error) {
    console.error(error);
  } else {
    console.log("Successfully reverted store to sello:", data);
  }
}

revertStore();
