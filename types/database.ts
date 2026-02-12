
export type UserRole = 'admin' | 'customer';

export interface Profile {
    id: string; // UUID from auth.users
    role: UserRole;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: string; // UUID
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}


export interface ProductImage {
    id: string;
    url: string;
    alt: string;
    width: number;
    height: number;
}

export interface ProductVariant {
    id: string; // UUID
    product_id: string; // UUID
    name: string; // e.g. "A4"
    price_eur: number;
    stripe_price_id: string;
    tpop_variant_id: number;
    stock_status: boolean;
    images: ProductImage[];
    created_at?: string;
    updated_at?: string;
}

export interface ProductWithVariants extends Product {
    variants: ProductVariant[];
}

export interface CartItem {
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

export interface Order {
    id: string; // UUID
    user_id: string | null;
    stripe_session_id: string | null;
    tpop_order_id: number | null;
    amount_total: number | null;
    status: OrderStatus;
    shipping_address: any | null; // JSONB
    tracking_url: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface OrderItem {
    id: string; // UUID
    order_id: string;
    product_variant_id: string | null;
    quantity: number;
    price_at_purchase: number;
    product_name_snapshot: string;
    variant_name_snapshot: string;
    tpop_variant_id_snapshot: number;
    created_at?: string;
}

export interface OrderWithItems extends Order {
    items: OrderItem[];
}
