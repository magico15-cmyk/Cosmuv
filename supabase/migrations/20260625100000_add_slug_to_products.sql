-- Add slug column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create an index to make looking up products by slug faster
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);

-- Create a unique constraint so two products in the same store can't have the same slug
ALTER TABLE products ADD CONSTRAINT products_store_id_slug_key UNIQUE (store_id, slug);
