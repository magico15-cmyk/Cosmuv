-- Update default values for future stores to match Morocco defaults
ALTER TABLE stores
ALTER COLUMN country SET DEFAULT 'MA',
ALTER COLUMN currency SET DEFAULT 'DH',
ALTER COLUMN language SET DEFAULT 'en';
