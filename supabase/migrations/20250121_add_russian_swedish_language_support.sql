-- Add Russian and Swedish language support to menu_items table
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS name_ru TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS name_sv TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS description_ru TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS description_sv TEXT;

-- Add Russian and Swedish language support to categories table
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name_ru TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name_sv TEXT;

-- Add Russian and Swedish language support to toppings table
ALTER TABLE public.toppings ADD COLUMN IF NOT EXISTS name_ru TEXT;
ALTER TABLE public.toppings ADD COLUMN IF NOT EXISTS name_sv TEXT;

-- Add Russian and Swedish language support to topping_groups table
ALTER TABLE public.topping_groups ADD COLUMN IF NOT EXISTS name_ru TEXT;
ALTER TABLE public.topping_groups ADD COLUMN IF NOT EXISTS name_sv TEXT;

-- Add Russian and Swedish language support to branches table
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS name_ru TEXT;
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS name_sv TEXT;

-- Add Russian and Swedish language support to promotions table
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS name_ru TEXT;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS name_sv TEXT;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS description_ru TEXT;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS description_sv TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.menu_items.name_ru IS 'Menu item name in Russian';
COMMENT ON COLUMN public.menu_items.name_sv IS 'Menu item name in Swedish';
COMMENT ON COLUMN public.menu_items.description_ru IS 'Menu item description in Russian';
COMMENT ON COLUMN public.menu_items.description_sv IS 'Menu item description in Swedish';

COMMENT ON COLUMN public.categories.name_ru IS 'Category name in Russian';
COMMENT ON COLUMN public.categories.name_sv IS 'Category name in Swedish';

COMMENT ON COLUMN public.toppings.name_ru IS 'Topping name in Russian';
COMMENT ON COLUMN public.toppings.name_sv IS 'Topping name in Swedish';

COMMENT ON COLUMN public.topping_groups.name_ru IS 'Topping group name in Russian';
COMMENT ON COLUMN public.topping_groups.name_sv IS 'Topping group name in Swedish';

COMMENT ON COLUMN public.branches.name_ru IS 'Branch name in Russian';
COMMENT ON COLUMN public.branches.name_sv IS 'Branch name in Swedish';

COMMENT ON COLUMN public.promotions.name_ru IS 'Promotion name in Russian';
COMMENT ON COLUMN public.promotions.name_sv IS 'Promotion name in Swedish';
COMMENT ON COLUMN public.promotions.description_ru IS 'Promotion description in Russian';
COMMENT ON COLUMN public.promotions.description_sv IS 'Promotion description in Swedish';
