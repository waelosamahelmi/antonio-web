import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export function useAllLocations() {
  return useQuery({
    queryKey: ["locations-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
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

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: Omit<Location, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("locations")
        .insert([location])
        .select()
        .single();

      if (error) throw error;
      return data as Location;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations-all"] });
      queryClient.invalidateQueries({ queryKey: ["locations-by-region"] });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...location }: Partial<Location> & { id: number }) => {
      const { data, error } = await supabase
        .from("locations")
        .update(location)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Location;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations-all"] });
      queryClient.invalidateQueries({ queryKey: ["locations-by-region"] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("locations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations-all"] });
      queryClient.invalidateQueries({ queryKey: ["locations-by-region"] });
    },
  });
}
