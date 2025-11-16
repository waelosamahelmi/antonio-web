-- Migration: Add branch filtering for menu items, branch-based order routing, and TikTok social media
-- Date: 2025-01-16

-- 1. Add branch_id to menu_items table (nullable = available in all branches)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_branch_id ON menu_items(branch_id);

COMMENT ON COLUMN menu_items.branch_id IS 'If NULL, the menu item is available at all branches. If set, the item is only available at the specified branch.';

-- 2. Add branch_id to users table for branch-specific user association
ALTER TABLE users
ADD COLUMN IF NOT EXISTS branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_branch_id ON users(branch_id);

COMMENT ON COLUMN users.branch_id IS 'Associates a user with a specific branch. Orders from that branch will be routed to this user.';

-- 3. Update restaurant_config to add TikTok to social media
-- First, check if the column exists (it should be JSONB)
DO $$
BEGIN
  -- Update existing restaurant_config records to add tiktok field to social_media jsonb
  UPDATE restaurant_config
  SET social_media = COALESCE(social_media, '{}'::jsonb) || jsonb_build_object('tiktok', '')
  WHERE social_media IS NOT NULL 
    AND NOT social_media ? 'tiktok';
  
  -- For records without social_media, initialize it with empty values
  UPDATE restaurant_config
  SET social_media = jsonb_build_object(
    'facebook', '',
    'instagram', '',
    'twitter', '',
    'tiktok', ''
  )
  WHERE social_media IS NULL;
END $$;

-- 4. Create a function to automatically associate users with branches based on email pattern
-- This function will be called when assigning orders to users
CREATE OR REPLACE FUNCTION get_branch_users(branch_name TEXT)
RETURNS TABLE(user_id INTEGER, user_email TEXT) AS $$
BEGIN
  -- Return users whose email starts with the branch city name
  -- e.g., lahti@ravintolababylon.fi for Lahti branch
  RETURN QUERY
  SELECT u.id, u.email
  FROM users u
  INNER JOIN branches b ON LOWER(b.city) = LOWER(SPLIT_PART(u.email, '@', 1))
  WHERE LOWER(b.city) = LOWER(branch_name)
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- 5. Create a function to get branch from order
CREATE OR REPLACE FUNCTION get_order_branch_users(order_branch_id INTEGER)
RETURNS TABLE(user_id INTEGER, user_email TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email
  FROM users u
  INNER JOIN branches b ON b.id = order_branch_id
  WHERE LOWER(b.city) = LOWER(SPLIT_PART(u.email, '@', 1))
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- 6. Update existing user records to associate with branches based on email
-- This will map users like lahti@ravintolababylon.fi to Lahti branch
DO $$
DECLARE
  branch_record RECORD;
  user_record RECORD;
BEGIN
  FOR branch_record IN SELECT id, city FROM branches LOOP
    FOR user_record IN 
      SELECT id, email 
      FROM users 
      WHERE LOWER(SPLIT_PART(email, '@', 1)) = LOWER(branch_record.city)
        AND branch_id IS NULL
    LOOP
      UPDATE users
      SET branch_id = branch_record.id
      WHERE id = user_record.id;
      
      RAISE NOTICE 'Associated user % with branch %', user_record.email, branch_record.city;
    END LOOP;
  END LOOP;
END $$;

-- 7. Create a view for menu items with branch availability
CREATE OR REPLACE VIEW menu_items_with_availability AS
SELECT 
  mi.*,
  CASE 
    WHEN mi.branch_id IS NULL THEN 'all_branches'
    ELSE b.name
  END AS branch_availability,
  CASE 
    WHEN mi.branch_id IS NULL THEN 'All Branches'
    ELSE b.name_en
  END AS branch_availability_en
FROM menu_items mi
LEFT JOIN branches b ON mi.branch_id = b.id;

COMMENT ON VIEW menu_items_with_availability IS 'Shows menu items with their branch availability. NULL branch_id means available at all branches.';

-- 8. Create helper function to get menu items for a specific branch
CREATE OR REPLACE FUNCTION get_menu_items_for_branch(target_branch_id INTEGER)
RETURNS TABLE(
  id INTEGER,
  category_id INTEGER,
  name TEXT,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  price NUMERIC,
  image_url TEXT,
  is_vegetarian BOOLEAN,
  is_vegan BOOLEAN,
  is_gluten_free BOOLEAN,
  display_order INTEGER,
  is_available BOOLEAN,
  offer_price NUMERIC,
  offer_percentage INTEGER,
  offer_start_date TIMESTAMP,
  offer_end_date TIMESTAMP,
  has_conditional_pricing BOOLEAN,
  included_toppings_count INTEGER,
  branch_id INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mi.id,
    mi.category_id,
    mi.name,
    mi.name_en,
    mi.description,
    mi.description_en,
    mi.price,
    mi.image_url,
    mi.is_vegetarian,
    mi.is_vegan,
    mi.is_gluten_free,
    mi.display_order,
    mi.is_available,
    mi.offer_price,
    mi.offer_percentage,
    mi.offer_start_date,
    mi.offer_end_date,
    mi.has_conditional_pricing,
    mi.included_toppings_count,
    mi.branch_id
  FROM menu_items mi
  WHERE mi.is_available = true
    AND (mi.branch_id IS NULL OR mi.branch_id = target_branch_id);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_menu_items_for_branch IS 'Returns menu items available for a specific branch (includes items with NULL branch_id which are available everywhere)';
