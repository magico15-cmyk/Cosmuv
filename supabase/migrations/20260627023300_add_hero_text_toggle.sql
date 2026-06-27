ALTER TABLE stores ADD COLUMN IF NOT EXISTS homepage_hero_text_enabled BOOLEAN DEFAULT true;
NOTIFY pgrst, 'reload schema';
