-- Create store_pages table
CREATE TABLE IF NOT EXISTS store_pages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text,
    is_published boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(store_id, slug)
);

-- RLS Policies
ALTER TABLE store_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published pages
CREATE POLICY "Public can view published pages" ON store_pages
    FOR SELECT
    USING (is_published = true);

-- Allow authenticated users (store owners) to manage their pages
-- For simplicity in this project, we'll allow authenticated users to manage all pages, 
-- or we can restrict it to the store owner if user_id is linked to stores.
-- Assuming stores table has user_id, let's link it:
CREATE POLICY "Users can manage their store's pages" ON store_pages
    FOR ALL
    TO authenticated
    USING (
        store_id IN (
            SELECT id FROM stores WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        store_id IN (
            SELECT id FROM stores WHERE user_id = auth.uid()
        )
    );

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_store_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_store_pages_updated_at
    BEFORE UPDATE ON store_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_store_pages_updated_at();
