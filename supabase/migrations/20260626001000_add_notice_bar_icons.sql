-- Add notice bar icon columns

ALTER TABLE stores
ADD COLUMN IF NOT EXISTS notice_bar_desktop_icon VARCHAR(50) DEFAULT 'flame',
ADD COLUMN IF NOT EXISTS notice_bar_mobile_icon VARCHAR(50) DEFAULT 'flame';

NOTIFY pgrst, 'reload schema';
