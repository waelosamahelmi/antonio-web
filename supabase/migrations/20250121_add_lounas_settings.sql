-- Create lounas_settings table for lunch time configuration
CREATE TABLE IF NOT EXISTS public.lounas_settings (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  
  -- Lunch serving times
  start_time TIME NOT NULL DEFAULT '10:30:00',
  end_time TIME NOT NULL DEFAULT '14:00:00',
  
  -- Days when lunch is served (0=Sunday, 1=Monday, etc.)
  serves_sunday BOOLEAN DEFAULT FALSE,
  serves_monday BOOLEAN DEFAULT TRUE,
  serves_tuesday BOOLEAN DEFAULT TRUE,
  serves_wednesday BOOLEAN DEFAULT TRUE,
  serves_thursday BOOLEAN DEFAULT TRUE,
  serves_friday BOOLEAN DEFAULT TRUE,
  serves_saturday BOOLEAN DEFAULT FALSE,
  
  -- Additional info (multilingual)
  info_text TEXT,
  info_text_en TEXT,
  info_text_ar TEXT,
  info_text_ru TEXT,
  info_text_sv TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one setting per branch
  UNIQUE(branch_id)
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_lounas_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_lounas_settings_updated_at
  BEFORE UPDATE ON public.lounas_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lounas_settings_updated_at();

-- Enable RLS
ALTER TABLE public.lounas_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to lounas settings"
  ON public.lounas_settings
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can manage their branch settings
CREATE POLICY "Allow authenticated users to manage lounas settings"
  ON public.lounas_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default settings for existing branches
INSERT INTO public.lounas_settings (branch_id, start_time, end_time)
SELECT id, '10:30:00', '14:00:00'
FROM public.branches
ON CONFLICT (branch_id) DO NOTHING;

-- Add comment
COMMENT ON TABLE public.lounas_settings IS 'Stores lunch serving time settings per branch';
