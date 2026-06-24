-- Add general settings to stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS store_name text,
ADD COLUMN IF NOT EXISTS store_email text,
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS favicon_url text,
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';
