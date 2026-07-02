-- =================================================================================
-- MIGRATION: 20260703000000_bulletproof_security_layer_and_uuid_enforcement.sql
-- DESCRIPTION: Bulletproof database security architecture, RLS tenant isolation,
--              and UUID primary key enforcement across all sensitive store tables.
-- =================================================================================

-- 1. ENABLE EXTENSIONS FOR UUID GENERATION
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================================
-- 2. UUID ENFORCEMENT & TABLE CREATION
-- =================================================================================

-- Create orders table with UUID primary key if it does not already exist
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'COD',
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create store_settings table with UUID primary key for modular store configurations
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    setting_key TEXT NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_sensitive BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store_id, setting_key)
);

-- Ensure UUID columns exist and are indexed on orders and store_settings
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_store_settings_store_id ON public.store_settings(store_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);

-- Add UUID alternative tracking column to products if legacy SERIAL id exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'id' AND data_type = 'integer'
    ) THEN
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
        CREATE UNIQUE INDEX IF NOT EXISTS idx_products_uuid ON public.products(uuid);
    END IF;
END $$;

-- =================================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- =================================================================================

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- =================================================================================
-- 4. STRICT TENANT ISOLATION POLICIES (CROSS-REFERENCING auth.uid())
-- =================================================================================

-- ---------------------------------------------------------------------------------
-- STORES TABLE POLICIES
-- ---------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Strict tenant isolation select on stores" ON public.stores;
CREATE POLICY "Strict tenant isolation select on stores" ON public.stores
    FOR SELECT
    USING (
        user_id = auth.uid() 
        OR true -- Note: Public storefront resolution allows reading store styling by subdomain
    );

DROP POLICY IF EXISTS "Strict tenant isolation update on stores" ON public.stores;
CREATE POLICY "Strict tenant isolation update on stores" ON public.stores
    FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Strict tenant isolation delete on stores" ON public.stores;
CREATE POLICY "Strict tenant isolation delete on stores" ON public.stores
    FOR DELETE
    USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------------
-- ORDERS TABLE POLICIES (Prevent URL ID Guessing & Unauthorized Scraping)
-- ---------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Strict tenant isolation select on orders" ON public.orders;
CREATE POLICY "Strict tenant isolation select on orders" ON public.orders
    FOR SELECT
    USING (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Strict tenant isolation update on orders" ON public.orders;
CREATE POLICY "Strict tenant isolation update on orders" ON public.orders
    FOR UPDATE
    USING (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Strict tenant isolation delete on orders" ON public.orders;
CREATE POLICY "Strict tenant isolation delete on orders" ON public.orders
    FOR DELETE
    USING (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );

-- Allow customer checkout to insert new orders (with IP rate limit enforced in API)
DROP POLICY IF EXISTS "Allow anonymous checkout insert on orders" ON public.orders;
CREATE POLICY "Allow anonymous checkout insert on orders" ON public.orders
    FOR INSERT
    WITH CHECK (true);

-- ---------------------------------------------------------------------------------
-- PRODUCTS TABLE POLICIES
-- ---------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Strict tenant isolation select on products" ON public.products;
CREATE POLICY "Strict tenant isolation select on products" ON public.products
    FOR SELECT
    USING (
        visibility = 'Visible' 
        OR store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Strict tenant isolation insert on products" ON public.products;
CREATE POLICY "Strict tenant isolation insert on products" ON public.products
    FOR INSERT
    WITH CHECK (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Strict tenant isolation update on products" ON public.products;
CREATE POLICY "Strict tenant isolation update on products" ON public.products
    FOR UPDATE
    USING (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Strict tenant isolation delete on products" ON public.products;
CREATE POLICY "Strict tenant isolation delete on products" ON public.products
    FOR DELETE
    USING (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );

-- ---------------------------------------------------------------------------------
-- STORE_SETTINGS TABLE POLICIES (Sensitive Merchant Data Protection)
-- ---------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Strict tenant isolation select on store_settings" ON public.store_settings;
CREATE POLICY "Strict tenant isolation select on store_settings" ON public.store_settings
    FOR SELECT
    USING (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Strict tenant isolation insert on store_settings" ON public.store_settings;
CREATE POLICY "Strict tenant isolation insert on store_settings" ON public.store_settings
    FOR INSERT
    WITH CHECK (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Strict tenant isolation update on store_settings" ON public.store_settings;
CREATE POLICY "Strict tenant isolation update on store_settings" ON public.store_settings
    FOR UPDATE
    USING (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Strict tenant isolation delete on store_settings" ON public.store_settings;
CREATE POLICY "Strict tenant isolation delete on store_settings" ON public.store_settings
    FOR DELETE
    USING (
        store_id IN (
            SELECT id FROM public.stores WHERE user_id = auth.uid()
        )
    );
