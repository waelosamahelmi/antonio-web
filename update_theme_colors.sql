-- =====================================================
-- UI Theme Modernization SQL Update
-- =====================================================
-- This SQL updates the restaurant_config table with modern theme colors
-- Apply this to your Supabase database to update the visual appearance
-- =====================================================

-- Update the theme colors for modern, vibrant design
UPDATE restaurant_config
SET 
  theme = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  theme,
                  '{primary}', '"#DC2626"'  -- Modern red (Tailwind red-600)
                ),
                '{secondary}', '"#F97316"'  -- Vibrant orange (Tailwind orange-500)
              ),
              '{accent}', '"#FEF3C7"'       -- Warm cream (Tailwind amber-100)
            ),
            '{success}', '"#10B981"'        -- Fresh green (Tailwind emerald-500)
          ),
          '{warning}', '"#F59E0B"'          -- Bright amber (Tailwind amber-500)
        ),
        '{error}', '"#EF4444"'              -- Alert red (Tailwind red-500)
      ),
      '{foreground}', '"#111827"'           -- Dark gray (Tailwind gray-900)
    ),
    '{background}', '"#FFFFFF"'             -- White
  ),
  updated_at = NOW()
WHERE is_active = true;

-- =====================================================
-- Alternative: Complete theme update with light/dark modes
-- =====================================================
-- Uncomment the following if you want to update the complete theme including light/dark mode colors

/*
UPDATE restaurant_config
SET 
  theme = jsonb_build_object(
    -- Legacy colors (required)
    'primary', '#DC2626',
    'secondary', '#F97316',
    'accent', '#FEF3C7',
    'success', '#10B981',
    'warning', '#F59E0B',
    'error', '#EF4444',
    'background', '#FFFFFF',
    'foreground', '#111827',
    
    -- Light theme
    'light', jsonb_build_object(
      'background', 'hsl(0, 0%, 100%)',
      'foreground', 'hsl(222.2, 84%, 4.9%)',
      'card', 'hsl(0, 0%, 100%)',
      'cardForeground', 'hsl(222.2, 84%, 4.9%)',
      'popover', 'hsl(0, 0%, 100%)',
      'popoverForeground', 'hsl(222.2, 84%, 4.9%)',
      'primary', '#DC2626',
      'primaryForeground', 'hsl(0, 0%, 98%)',
      'secondary', 'hsl(210, 40%, 96%)',
      'secondaryForeground', 'hsl(222.2, 84%, 4.9%)',
      'muted', 'hsl(210, 40%, 96%)',
      'mutedForeground', 'hsl(215.4, 16.3%, 46.9%)',
      'accent', '#F97316',
      'accentForeground', 'hsl(0, 0%, 98%)',
      'destructive', 'hsl(0, 84.2%, 60.2%)',
      'destructiveForeground', 'hsl(0, 0%, 98%)',
      'border', 'hsl(214.3, 31.8%, 91.4%)',
      'input', 'hsl(214.3, 31.8%, 91.4%)',
      'ring', '#DC2626'
    ),
    
    -- Dark theme
    'dark', jsonb_build_object(
      'background', 'hsl(222.2, 84%, 4.9%)',
      'foreground', 'hsl(0, 0%, 98%)',
      'card', 'hsl(222.2, 84%, 10%)',
      'cardForeground', 'hsl(0, 0%, 98%)',
      'popover', 'hsl(222.2, 84%, 4.9%)',
      'popoverForeground', 'hsl(0, 0%, 98%)',
      'primary', '#DC2626',
      'primaryForeground', 'hsl(0, 0%, 98%)',
      'secondary', 'hsl(217.2, 32.6%, 17.5%)',
      'secondaryForeground', 'hsl(0, 0%, 98%)',
      'muted', 'hsl(217.2, 32.6%, 17.5%)',
      'mutedForeground', 'hsl(215, 20.2%, 65.1%)',
      'accent', '#F97316',
      'accentForeground', 'hsl(0, 0%, 98%)',
      'destructive', 'hsl(0, 62.8%, 30.6%)',
      'destructiveForeground', 'hsl(0, 0%, 98%)',
      'border', 'hsl(217.2, 32.6%, 17.5%)',
      'input', 'hsl(217.2, 32.6%, 17.5%)',
      'ring', 'hsl(212.7, 26.8%, 83.9%)'
    )
  ),
  updated_at = NOW()
WHERE is_active = true;
*/

-- =====================================================
-- Logo configuration update (optional)
-- =====================================================
-- Update logo background to match new primary color

UPDATE restaurant_config
SET 
  logo = jsonb_set(
    logo,
    '{backgroundColor}', '"#DC2626"'  -- Match primary color
  ),
  updated_at = NOW()
WHERE is_active = true;

-- =====================================================
-- Verify the update
-- =====================================================
-- Run this to see the updated theme colors

SELECT 
  name,
  theme->>'primary' as primary_color,
  theme->>'secondary' as secondary_color,
  theme->>'accent' as accent_color,
  theme->>'success' as success_color,
  theme->>'warning' as warning_color,
  logo->>'backgroundColor' as logo_bg_color,
  updated_at
FROM restaurant_config
WHERE is_active = true;

-- =====================================================
-- Rollback (if needed)
-- =====================================================
-- If you want to revert to original brown theme, uncomment below:

/*
UPDATE restaurant_config
SET 
  theme = jsonb_build_object(
    'primary', '#8B4513',     -- Saddle brown
    'secondary', '#FF8C00',   -- Dark orange
    'accent', '#F5E6D3',      -- Creamy/beige
    'success', '#16a34a',
    'warning', '#ea580c',
    'error', '#dc2626',
    'background', '#ffffff',
    'foreground', '#1f2937'
  ),
  logo = jsonb_set(
    logo,
    '{backgroundColor}', '"#8B4513"'
  ),
  updated_at = NOW()
WHERE is_active = true;
*/
