import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jkejurvqypiytxrgylde.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZWp1cnZxeXBpeXR4cmd5bGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNjEyNDgsImV4cCI6MjA5NzczNzI0OH0.b0tAj-mEBQtjIE2rgMUjVtvQ_aChNul5Pflsi8I5fQs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const htmlText = "HIGH DEMAND: SELLING OUT FAST";
  
  const { data, error } = await supabase
    .from('stores')
    .update({
      notice_bar_desktop_enabled: true,
      notice_bar_desktop_text: htmlText,
      notice_bar_desktop_bg_color: '#FF0054', // or whatever var(--primary-pink) is
      notice_bar_mobile_enabled: true,
      notice_bar_mobile_text: htmlText,
      notice_bar_mobile_bg_color: '#FF0054'
    })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all stores

  if (error) {
    console.error('Error updating stores:', error);
  } else {
    console.log('Successfully updated stores to enable notice bars and set default text.');
  }
}

main();
