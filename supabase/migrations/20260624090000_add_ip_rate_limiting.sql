-- Migration to add IP rate limiting features
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS max_orders_per_ip integer DEFAULT NULL;

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS ip_address text DEFAULT NULL;
