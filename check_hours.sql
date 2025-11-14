-- Check current restaurant hours in database
SELECT 
  id,
  is_open,
  is_busy,
  opening_hours::text as opening_hours,
  pickup_hours::text as pickup_hours,
  delivery_hours::text as delivery_hours,
  updated_at
FROM restaurant_settings
LIMIT 1;

-- This will show you exactly what's stored in the database
-- The hours should be in JSON format like:
-- {"monday":"08:30-21:30","tuesday":"08:30-21:30",...}
