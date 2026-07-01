const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateStore() {
  const { data, error } = await supabase.from('stores')
    .update({ 
      subdomain: 'cosmuv',
      custom_domain: 'cosmuv.com'
    })
    .eq('id', '9e46ba6d-b416-4f32-8016-2cd3d2ceb6c9')
    .select();
    
  if (error) {
    console.error(error);
  } else {
    console.log("Successfully updated store to cosmuv:", data);
  }
}

updateStore();
