-- Create store_menus table
CREATE TABLE IF NOT EXISTS store_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(store_id, slug)
);

-- Set up Row Level Security (RLS)
ALTER TABLE store_menus ENABLE ROW LEVEL SECURITY;

-- Policy: Store owners can insert their own menus
CREATE POLICY "Store owners can insert menus" ON store_menus
    FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT user_id FROM stores WHERE id = store_id));

-- Policy: Store owners can update their own menus
CREATE POLICY "Store owners can update menus" ON store_menus
    FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM stores WHERE id = store_id));

-- Policy: Store owners can delete their own menus
CREATE POLICY "Store owners can delete menus" ON store_menus
    FOR DELETE
    USING (auth.uid() IN (SELECT user_id FROM stores WHERE id = store_id));

-- Policy: Anyone can view menus (needed for public storefront)
CREATE POLICY "Anyone can view menus" ON store_menus
    FOR SELECT
    USING (true);

-- Function to seed default menus for a specific store
CREATE OR REPLACE FUNCTION seed_menus_for_store(p_store_id UUID)
RETURNS void AS $$
BEGIN
    -- Insert Main Menu
    INSERT INTO store_menus (store_id, name, slug, items)
    VALUES (
        p_store_id, 
        'Main Menu', 
        'main-menu', 
        '[
            {"label": "Home", "url": "/"},
            {"label": "About Us", "url": "/pages/about-us"},
            {"label": "Shipping", "url": "/pages/shipping"},
            {"label": "FAQ", "url": "/pages/faq"}
        ]'::jsonb
    )
    ON CONFLICT (store_id, slug) DO NOTHING;

    -- Insert Footer Menu
    INSERT INTO store_menus (store_id, name, slug, items)
    VALUES (
        p_store_id, 
        'Footer Menu', 
        'footer-menu', 
        '[
            {"label": "About Us", "url": "/pages/about-us"},
            {"label": "Privacy Policy & Confidentiality", "url": "/pages/privacy-policy-confidentiality"},
            {"label": "Terms and Conditions", "url": "/pages/terms-and-conditions"},
            {"label": "Shipping & Delivery", "url": "/pages/shipping"},
            {"label": "Contact Us", "url": "/pages/contact-us"},
            {"label": "FAQ", "url": "/pages/faq"}
        ]'::jsonb
    )
    ON CONFLICT (store_id, slug) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for new stores
CREATE OR REPLACE FUNCTION trigger_seed_default_store_menus()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM seed_menus_for_store(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Hook trigger to stores table
DROP TRIGGER IF EXISTS on_store_created_seed_menus ON stores;
CREATE TRIGGER on_store_created_seed_menus
    AFTER INSERT ON stores
    FOR EACH ROW
    EXECUTE FUNCTION trigger_seed_default_store_menus();

-- Backfill missing menus for all existing stores
DO $$ 
DECLARE
    store_record RECORD;
BEGIN
    FOR store_record IN SELECT id FROM stores LOOP
        PERFORM seed_menus_for_store(store_record.id);
    END LOOP;
END $$;
