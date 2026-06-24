-- Add RTL (Right-to-Left) toggle to stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS store_rtl boolean DEFAULT false;
