-- Add extended homepage products settings to stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS homepage_products_subtitle TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS homepage_products_category TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS homepage_products_load_more BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS homepage_products_view_type TEXT DEFAULT 'Grid';
