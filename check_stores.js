const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkStores() {
  const { data, error } = await supabase.from('stores').select('id, store_name, subdomain, custom_domain');
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
}
checkStores();
