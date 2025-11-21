-- Create lounas_menus table for weekly lunch menu management
CREATE TABLE IF NOT EXISTS public.lounas_menus (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL, -- ISO week number (1-53)
  year INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
  
  -- Menu item details (multilingual)
  name TEXT NOT NULL,
  name_en TEXT,
  name_ar TEXT,
  name_ru TEXT,
  name_sv TEXT,
  
  description TEXT,
  description_en TEXT,
  description_ar TEXT,
  description_ru TEXT,
  description_sv TEXT,
  
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Dietary tags
  is_lactose_free BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_milk_free BOOLEAN DEFAULT FALSE,
  is_hot BOOLEAN DEFAULT TRUE,
  
  -- Optional image
  image_url TEXT,
  
  -- Display order
  display_order INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique day per week per branch
  UNIQUE(branch_id, year, week_number, day_of_week, display_order)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lounas_menus_branch_week 
  ON public.lounas_menus(branch_id, year, week_number);

CREATE INDEX IF NOT EXISTS idx_lounas_menus_active 
  ON public.lounas_menus(is_active, year, week_number);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_lounas_menus_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lounas_menus_updated_at
  BEFORE UPDATE ON public.lounas_menus
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lounas_menus_updated_at();

-- Enable RLS
ALTER TABLE public.lounas_menus ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read active lounas menus
CREATE POLICY "Public can read active lounas menus"
  ON public.lounas_menus
  FOR SELECT
  USING (is_active = TRUE);

-- Policy: Authenticated users can manage lounas menus
CREATE POLICY "Authenticated users can manage lounas menus"
  ON public.lounas_menus
  FOR ALL
  USING (auth.role() = 'authenticated');

COMMENT ON TABLE public.lounas_menus IS 'Weekly lunch menu items for restaurant branches';
COMMENT ON COLUMN public.lounas_menus.week_number IS 'ISO week number (1-53)';
COMMENT ON COLUMN public.lounas_menus.day_of_week IS '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday';
COMMENT ON COLUMN public.lounas_menus.is_lactose_free IS 'Item is lactose-free';
COMMENT ON COLUMN public.lounas_menus.is_gluten_free IS 'Item is gluten-free';
COMMENT ON COLUMN public.lounas_menus.is_vegan IS 'Item is vegan';
COMMENT ON COLUMN public.lounas_menus.is_milk_free IS 'Item is dairy-free';
COMMENT ON COLUMN public.lounas_menus.is_hot IS 'Item is served hot';
