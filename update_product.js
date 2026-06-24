require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: product } = await supabase.from('products').select('*').eq('id', 14).single();
  if (product) {
    const blocks = product.content_blocks || [];
    const existingIndex = blocks.findIndex(b => b.type === 'comparison');
    const newBlock = {
      id: 'comparison-1234',
      type: 'comparison',
      content: {
        title: 'What Makes Stepprs So Special?',
        highlightWord: 'Special',
        description: "We're dedicated to your comfort and satisfaction. We strive to make a real difference in your daily life.",
        storeName: 'Stepprs.',
        competitorName: 'Others',
        rows: [
          { feature: 'Cushioning', store: true, others: false },
          { feature: 'Breathable', store: true, others: false },
          { feature: 'Instant Relief', store: true, others: false },
          { feature: 'Arch Support', store: true, others: false },
          { feature: 'Shock Absorption', store: true, others: false },
          { feature: 'Bad-Odor Removal', store: true, others: false },
          { feature: 'Costs $$$', store: false, others: true }
        ]
      }
    };

    if (existingIndex > -1) {
      blocks[existingIndex] = newBlock;
    } else {
      blocks.push(newBlock);
    }
    
    await supabase.from('products').update({ content_blocks: blocks }).eq('id', 14);
    console.log('Successfully updated product 14 with comparison block');
  } else {
    console.log('Product 14 not found');
  }
}
main();
