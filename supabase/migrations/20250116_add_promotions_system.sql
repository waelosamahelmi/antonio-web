-- Migration: Add promotions system with category and branch filtering
-- Date: 2025-01-16

-- 1. Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  min_order_amount NUMERIC(10, 2) DEFAULT 0,
  max_discount_amount NUMERIC(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promotions_category_id ON promotions(category_id);
CREATE INDEX IF NOT EXISTS idx_promotions_branch_id ON promotions(branch_id);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);

COMMENT ON TABLE promotions IS 'Promotional discounts that can be applied to categories at specific branches';
COMMENT ON COLUMN promotions.category_id IS 'If NULL, promotion applies to all categories';
COMMENT ON COLUMN promotions.branch_id IS 'If NULL, promotion applies to all branches';
COMMENT ON COLUMN promotions.discount_type IS 'Type of discount: percentage (e.g., 20%) or fixed amount (e.g., 5.00€)';
COMMENT ON COLUMN promotions.min_order_amount IS 'Minimum order amount required for promotion to apply';
COMMENT ON COLUMN promotions.max_discount_amount IS 'Maximum discount amount cap (useful for percentage discounts)';

-- 2. Function to get active promotions for a category and branch
CREATE OR REPLACE FUNCTION get_active_promotions(
  target_category_id INTEGER DEFAULT NULL,
  target_branch_id INTEGER DEFAULT NULL,
  check_time TIMESTAMP DEFAULT NOW()
)
RETURNS TABLE(
  id INTEGER,
  name TEXT,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  discount_type TEXT,
  discount_value NUMERIC,
  category_id INTEGER,
  branch_id INTEGER,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  min_order_amount NUMERIC,
  max_discount_amount NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.name_en,
    p.description,
    p.description_en,
    p.discount_type,
    p.discount_value,
    p.category_id,
    p.branch_id,
    p.start_date,
    p.end_date,
    p.min_order_amount,
    p.max_discount_amount
  FROM promotions p
  WHERE p.is_active = true
    AND p.start_date <= check_time
    AND p.end_date >= check_time
    AND (p.category_id IS NULL OR p.category_id = target_category_id OR target_category_id IS NULL)
    AND (p.branch_id IS NULL OR p.branch_id = target_branch_id OR target_branch_id IS NULL)
  ORDER BY p.discount_value DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_active_promotions IS 'Get all active promotions for a specific category and branch. NULL parameters match all.';

-- 3. Function to calculate promotion discount
CREATE OR REPLACE FUNCTION calculate_promotion_discount(
  promotion_id INTEGER,
  order_amount NUMERIC
)
RETURNS NUMERIC AS $$
DECLARE
  promo RECORD;
  calculated_discount NUMERIC;
BEGIN
  SELECT * INTO promo FROM promotions WHERE id = promotion_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Check minimum order amount
  IF order_amount < promo.min_order_amount THEN
    RETURN 0;
  END IF;
  
  -- Calculate discount based on type
  IF promo.discount_type = 'percentage' THEN
    calculated_discount := order_amount * (promo.discount_value / 100);
  ELSE
    calculated_discount := promo.discount_value;
  END IF;
  
  -- Apply maximum discount cap if set
  IF promo.max_discount_amount IS NOT NULL AND calculated_discount > promo.max_discount_amount THEN
    calculated_discount := promo.max_discount_amount;
  END IF;
  
  RETURN calculated_discount;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_promotion_discount IS 'Calculate the actual discount amount for a promotion given an order amount';
