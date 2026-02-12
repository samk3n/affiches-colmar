
-- Step A: User Profiles & Roles

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profile RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Admins can read all profiles (we need is_admin function first, or basic check)
-- See helper function below.

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_role TEXT;
BEGIN
  SELECT role INTO current_role FROM public.profiles WHERE id = auth.uid();
  RETURN current_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updates Profile RLS with Admin powers
CREATE POLICY "Admins can do everything on profiles"
ON profiles FOR ALL
USING (public.is_admin());


-- Step B: Refactor Products (The Parent)

-- Remove variant/price specific columns from products
ALTER TABLE products 
DROP COLUMN price_eur,
DROP COLUMN stripe_price_id,
DROP COLUMN tpop_variant_id;

-- Ensure is_active acts as a pause button (already exists, but just confirming intent)
-- No SQL needed if column exists, but let's ensure RLS uses it properly later.


-- Step C: Create Variants (The Children)

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "A4"
  price_eur NUMERIC NOT NULL,
  stripe_price_id TEXT NOT NULL UNIQUE,
  tpop_variant_id INTEGER NOT NULL,
  stock_status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on product_id
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);

-- Enable RLS on variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;


-- Step D: Update RLS (Security) for Products & Variants

-- Drop existing public read policy on products to update it (optional, but cleaner)
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;

-- Products: Public can read active
CREATE POLICY "Public read active products"
ON products FOR SELECT
USING (is_active = true);

-- Products: Admin can do everything
CREATE POLICY "Admin full access products"
ON products FOR ALL
USING (public.is_admin());

-- Variants: Public can read if parent product is active
CREATE POLICY "Public read variants of active products"
ON product_variants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM products p
    WHERE p.id = product_variants.product_id
    AND p.is_active = true
  )
);

-- Variants: Admin can do everything
CREATE POLICY "Admin full access variants"
ON product_variants FOR ALL
USING (public.is_admin());
