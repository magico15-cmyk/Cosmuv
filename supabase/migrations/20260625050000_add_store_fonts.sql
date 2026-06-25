-- Add font options to stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS menu_font text DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS body_font text DEFAULT 'Inter';
