-- Add homepage features columns to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS homepage_features_enabled BOOLEAN DEFAULT true;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS homepage_features JSONB DEFAULT '[]'::jsonb;
