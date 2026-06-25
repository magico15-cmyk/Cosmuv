-- Migration to add checkout_field_order to stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS checkout_field_order jsonb DEFAULT '["name", "phone", "city", "address"]'::jsonb;
