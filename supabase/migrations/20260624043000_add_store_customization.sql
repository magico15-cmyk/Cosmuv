-- Migration: Add Store Customization Columns
-- Description: Adds dynamic configuration columns for multi-tenant stores

ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#f899a2',
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US';

-- Note: 
-- You can run this directly in your Supabase SQL Editor.
-- The default values ensure your existing stores won't break 
-- when the new columns are introduced.
