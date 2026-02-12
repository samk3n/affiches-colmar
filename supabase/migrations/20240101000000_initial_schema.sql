
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_eur NUMERIC, -- Display price only
  image_url TEXT,
  stripe_price_id TEXT NOT NULL, -- Stripe Price ID 'price_...'
  tpop_variant_id INTEGER NOT NULL, -- T-Pop Variant ID
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  stripe_session_id TEXT UNIQUE,
  tpop_order_id INTEGER, -- Nullable, populated after webhook
  amount_total NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  shipping_address JSONB,
  tracking_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
-- Public read access for active products
CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT 
USING (is_active = true);

-- Service Role only for insert/update/delete (Implicitly default deny for anon/authenticated)

-- RLS Policies for orders
-- Users can see their own orders
CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

-- Service Role has full access (Implicit in Supabase, but good to be explicit if needed, 
-- usually Service Role bypasses RLS so no specific policy needed for it to work, 
-- but we rely on the default deny for others)
