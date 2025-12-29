-- schema.sql
-- PostgreSQL schema for Elaris Noir backend

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    price_cents INTEGER NOT NULL CHECK (price_cents > 0),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT,
    line1 TEXT,
    line2 TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address_id INTEGER REFERENCES addresses(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0)
);

-- Wishlist Items
CREATE TABLE IF NOT EXISTS wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist_items(user_id);

-- Articles/Journal
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    author_name TEXT NOT NULL,
    author_title TEXT,
    author_image TEXT,
    text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);

-- Sample product data
INSERT INTO products (name, category, description, price_cents, image_url)
VALUES
('Midnight Bloom', 'Eau de Parfum', 'An intoxicating blend of night-blooming jasmine, dark amber, and rare woods.', 18000, 'https://images.unsplash.com/photo-1594121764658-00fc48a4365c?q=80&w=1000&auto=format&fit=crop'),
('Golden Amber', 'Eau de Parfum', 'A warm amber-forward fragrance with golden warmth.', 21000, 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop'),
('Velvet Rose', 'Eau de Parfum', 'A velvety rose with deep leathery undertones.', 19500, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop'),
('Noir Intense', 'Parfum', 'Concentrated noir parfum with smoky woods.', 25000, 'https://images.unsplash.com/photo-1523293188086-b431e96000ec?q=80&w=1000&auto=format&fit=crop'),
('Eclat d''Or', 'Eau de Toilette', 'Bright citrus opening with golden floral heart.', 14000, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=1000&auto=format&fit=crop'),
('Mystique', 'Eau de Parfum', 'Mystical, gourmand floral with depth and mystery.', 20000, 'https://images.unsplash.com/photo-1595166668700-128e448d3c16?q=80&w=2670&auto=format&fit=crop')
ON CONFLICT DO NOTHING;
