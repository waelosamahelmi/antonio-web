import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  postal_code: string | null;
  icon: string;
  logo_url: string | null;
  region: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Location[];
    },
  });
}

export function useLocationsByRegion() {
  return useQuery({
    queryKey: ["locations-by-region"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;

      // Group by region
      const grouped = (data as Location[]).reduce((acc, location) => {
        const region = location.region || location.city;
        if (!acc[region]) {
          acc[region] = [];
        }
        acc[region].push(location);
        return acc;
      }, {} as Record<string, Location[]>);

      return grouped;
    },
  });
}
