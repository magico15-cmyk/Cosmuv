import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://jkejurvqypiytxrgylde.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZWp1cnZxeXBpeXR4cmd5bGRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjE2MTI0OCwiZXhwIjoyMDk3NzM3MjQ4fQ.dyHeB6vuuv6t0AHVsKjuNwasZv2vNm4ff7orwipedAg';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateStore() {
  console.log("Updating store for cosmuv...");
  const { data, error } = await supabase
    .from('stores')
    .update({ store_name: 'COSMUV' })
    .eq('subdomain', 'cosmuv')
    .select();

  if (error) {
    console.error("Error updating store:", error);
  } else {
    console.log("Successfully updated store to COSMUV:", data);
  }
}

updateStore();
