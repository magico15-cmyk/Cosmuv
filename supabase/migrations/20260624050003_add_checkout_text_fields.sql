-- Add checkout text fields to the stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS checkout_main_title text DEFAULT 'CASH ON DELIVERY',
ADD COLUMN IF NOT EXISTS checkout_address_title text DEFAULT 'Enter your shipping address',
ADD COLUMN IF NOT EXISTS checkout_address_desc text DEFAULT 'You will be contacted by one of our operators to confirm your order before shipping.',
ADD COLUMN IF NOT EXISTS checkout_button_text text DEFAULT 'COMPLETE ORDER';
