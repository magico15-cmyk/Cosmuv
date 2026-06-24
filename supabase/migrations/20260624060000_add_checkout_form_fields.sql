-- Add checkout form field customizations to the stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS field_name_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS field_name_label text DEFAULT 'Full name',
ADD COLUMN IF NOT EXISTS field_phone_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS field_phone_label text DEFAULT 'Phone number',
ADD COLUMN IF NOT EXISTS field_city_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS field_city_label text DEFAULT 'City',
ADD COLUMN IF NOT EXISTS field_address_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS field_address_label text DEFAULT 'Address (Road, House number)';
