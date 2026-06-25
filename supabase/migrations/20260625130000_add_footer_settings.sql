ALTER TABLE stores
ADD COLUMN IF NOT EXISTS footer_newsletter_title TEXT DEFAULT 'Subscribe to our emails',
ADD COLUMN IF NOT EXISTS footer_newsletter_subtitle TEXT DEFAULT 'Join our email list for exclusive offers and the latest news.',
ADD COLUMN IF NOT EXISTS footer_show_newsletter BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS footer_logo_text TEXT DEFAULT 'Yu.',
ADD COLUMN IF NOT EXISTS footer_links_title TEXT DEFAULT 'Products';
