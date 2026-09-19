-- Whop Affiliate Leaderboard & Discord Notifier MVP schema

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id VARCHAR UNIQUE NOT NULL,
  company_id VARCHAR UNIQUE NOT NULL,
  company_name VARCHAR,
  discord_webhook TEXT,
  subscription_status VARCHAR DEFAULT 'trial',
  whop_access_status VARCHAR DEFAULT 'not_subscribed',
  whop_user_id VARCHAR,
  whop_subscription_id VARCHAR,
  whop_product_id VARCHAR,
  whop_plan_id VARCHAR,
  whop_last_synced_at TIMESTAMP,
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  affiliate_id VARCHAR NOT NULL,
  affiliate_name VARCHAR,
  sales_count INT DEFAULT 0,
  total_sales_cents INT DEFAULT 0,
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(seller_id, affiliate_id)
);

CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  amount_cents INT,
  product_name VARCHAR,
  whop_order_id VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_seller_id ON sales(seller_id);
CREATE INDEX idx_sales_affiliate_id ON sales(affiliate_id);
