ALTER TABLE stores ADD COLUMN IF NOT EXISTS homepage_hero_text TEXT DEFAULT 'Profitez des meilleures offres de la semaine avec des réductions incroyables !';
ALTER TABLE stores ADD COLUMN IF NOT EXISTS homepage_hero_button_text TEXT DEFAULT 'Offres du jour';
NOTIFY pgrst, 'reload schema';
