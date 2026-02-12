
-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL, -- Nullable if variant deleted
  quantity INTEGER NOT NULL DEFAULT 1,
  
  -- Snapshots (Price & Details at moment of purchase)
  price_at_purchase NUMERIC NOT NULL,
  product_name_snapshot TEXT NOT NULL,
  variant_name_snapshot TEXT NOT NULL,
  tpop_variant_id_snapshot INTEGER NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admin can do everything
CREATE POLICY "Admin full access order_items"
ON order_items FOR ALL
USING (public.is_admin());

-- Users can view their own order items
-- We check if the parent order belongs to the user
CREATE POLICY "Users can view own order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);
