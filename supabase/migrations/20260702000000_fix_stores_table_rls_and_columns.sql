-- Ensure all homepage configuration columns exist in stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS slider_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS homepage_hero_text TEXT DEFAULT 'Profitez des meilleures offres de la semaine avec des réductions incroyables !',
ADD COLUMN IF NOT EXISTS homepage_hero_button_text TEXT DEFAULT 'Offres du jour',
ADD COLUMN IF NOT EXISTS homepage_hero_text_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS homepage_products_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS homepage_products_title TEXT DEFAULT 'Featured Products',
ADD COLUMN IF NOT EXISTS homepage_products_subtitle TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS homepage_products_limit INTEGER DEFAULT 8,
ADD COLUMN IF NOT EXISTS homepage_products_category TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS homepage_products_load_more BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS homepage_products_view_type TEXT DEFAULT 'Grid',
ADD COLUMN IF NOT EXISTS homepage_ticker_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS homepage_ticker_items JSONB DEFAULT '["https://pub-33219faf94984e759ea6b688e0938491.r2.dev/1782523114620-4af3073e4ce7d21a.png", "https://pub-33219faf94984e759ea6b688e0938491.r2.dev/1782523120209-a1f6e87acb4941f4.png"]'::jsonb,
ADD COLUMN IF NOT EXISTS homepage_features_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS homepage_features_view_type TEXT DEFAULT 'Grid (2x2)',
ADD COLUMN IF NOT EXISTS homepage_features_title TEXT DEFAULT 'Why Choose Us',
ADD COLUMN IF NOT EXISTS homepage_features_subtitle TEXT DEFAULT '✦ OUR BENEFITS ✦',
ADD COLUMN IF NOT EXISTS homepage_features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS homepage_layout_order JSONB DEFAULT '["ticker", "features", "products"]'::jsonb;

-- Fix Row Level Security (RLS) on stores table so updates from store subdomains succeed
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on stores" ON stores;
CREATE POLICY "Allow public read access on stores" ON stores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update access on stores" ON stores;
CREATE POLICY "Allow public update access on stores" ON stores FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public insert access on stores" ON stores;
CREATE POLICY "Allow public insert access on stores" ON stores FOR INSERT WITH CHECK (true);
