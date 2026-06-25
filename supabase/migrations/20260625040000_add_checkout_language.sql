-- Add checkout language option to stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS checkout_language text DEFAULT 'en';
