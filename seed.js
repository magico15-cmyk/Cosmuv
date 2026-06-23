require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// We need to parse the products array from TS.
// Since it's TS, it's easier to just read it, replace 'export const products: Product[] = ' with '' and eval it.
const fileContent = fs.readFileSync('src/data/products.ts', 'utf-8');
const arrayStr = fileContent.substring(fileContent.indexOf('['));
const products = eval(arrayStr.replace(/;\s*$/, ''));

async function seed() {
  console.log('Seeding', products.length, 'products...');
  
  const mappedProducts = products.map(p => ({
    name: p.name,
    subtitle: p.subtitle,
    price: p.price,
    originalPrice: p.originalPrice || null,
    image: p.image,
    category: p.category,
    gender: p.gender,
    size: p.size,
    isFavorite: p.isFavorite,
    inventory: p.inventory,
    stock: p.stock,
    orders: p.orders,
    visibility: p.visibility,
    // let createdAt default
  }));

  const { data, error } = await supabase.from('products').insert(mappedProducts).select();
  if (error) {
    console.error('Error seeding:', error);
  } else {
    console.log('Successfully seeded items!');
  }
}

seed();
