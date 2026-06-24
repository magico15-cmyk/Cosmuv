const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('subdomain', 'shop1')
    .single();

  if (storeError || !store) {
    console.error('Store not found', storeError);
    return;
  }

  const { error } = await supabase.from('products').insert([{
    store_id: store.id,
    name: 'Turmeric Gummies',
    subtitle: 'Turmeric Gummies (2 Month Supply)',
    price: 45.00,
    originalPrice: 65.00,
    image: JSON.stringify(['/assets/bottle.png', '/assets/bundle.png']),
    visibility: 'active',
    content_blocks: [
      {
        type: 'features',
        content: ['Organic ingredients', 'Joint support', 'Vegan friendly']
      },
      {
        type: 'bundles',
        content: [
          { title: 'Single', price: '45.00', originalPrice: '50.00', sub: '$45.00/Bottle', img: '/assets/bottle.png', badge: null },
          { title: '2 Bottles', price: '79.00', originalPrice: '100.00', sub: '$39.50/Bottle', img: '/assets/bundle.png', badge: 'Most Popular' },
          { title: 'Bundle', price: '106.00', originalPrice: '150.00', sub: 'Best Value Deal', img: '/assets/bundle.png', badge: 'Best Value' }
        ]
      }
    ]
  }]);

  if (error) {
    console.error('Error inserting product:', error);
  } else {
    console.log('Product inserted successfully!');
  }
}

run();
