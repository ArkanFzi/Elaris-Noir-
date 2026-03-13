export interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    price_cents: number;
    image_url: string;
    top_notes?: string;
    heart_notes?: string;
    base_notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface WishlistItem {
    id: number;
    product_id: number;
    added_at: string;
    product?: Product;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: "admin" | "customer";
    created_at?: string;
}
