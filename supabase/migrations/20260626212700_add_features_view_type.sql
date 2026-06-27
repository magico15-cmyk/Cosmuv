-- Add features view type column to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS homepage_features_view_type TEXT DEFAULT 'Grid (2x2)';
