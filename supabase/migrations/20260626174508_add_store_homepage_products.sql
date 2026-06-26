-- Add homepage products settings to stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS homepage_products_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS homepage_products_title TEXT DEFAULT 'Featured Products',
ADD COLUMN IF NOT EXISTS homepage_products_limit INTEGER DEFAULT 8;
