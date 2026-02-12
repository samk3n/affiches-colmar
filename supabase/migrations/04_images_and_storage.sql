
-- 1. Schema Changes: Refactor for Multiple Images

-- Refactor products table
ALTER TABLE products 
DROP COLUMN IF EXISTS image_url;

-- Refactor product_variants table
ALTER TABLE product_variants 
DROP COLUMN IF EXISTS image_url;

ALTER TABLE product_variants
ADD COLUMN images JSONB[] DEFAULT '{}'::JSONB[]; 
-- Requirement: [{ "id": string, "url": string, "alt": string, "width": number, "height": number }]

-- 2. Storage Setup

-- Create Bucket 'product-images' if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Security)

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy "Public Access": Allow SELECT for everyone
CREATE POLICY "Public Access to product-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Policy "Admin Management": Allow INSERT, UPDATE, DELETE for Admins
CREATE POLICY "Admin Management of product-images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'product-images' 
  AND public.is_admin()
);
