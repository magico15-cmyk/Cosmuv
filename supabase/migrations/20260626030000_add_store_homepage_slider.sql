-- Add slider_images to stores table for homepage settings
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS slider_images JSONB DEFAULT '[]'::jsonb;
