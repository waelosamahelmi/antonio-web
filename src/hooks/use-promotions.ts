import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Promotion {
  id: number;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  category_id: number | null;
  branch_id: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  created_at: string;
  updated_at: string;
}

// Get active promotions
export function useActivePromotions(categoryId?: number, branchId?: number) {
  return useQuery({
    queryKey: ["active-promotions", categoryId, branchId],
    queryFn: async () => {
      const now = new Date().toISOString();

      let query = supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now);

      if (categoryId) {
        query = query.or(`category_id.is.null,category_id.eq.${categoryId}`);
      }

      if (branchId) {
        query = query.or(`branch_id.is.null,branch_id.eq.${branchId}`);
      }

      const { data, error } = await query.order('discount_value', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch active promotions:', error);
        throw error;
      }

      return (data || []) as Promotion[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get all active promotions for hero banner
export function useHeroPromotions() {
  return useQuery({
    queryKey: ["hero-promotions"],
    queryFn: async () => {
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('discount_value', { ascending: false })
        .limit(5); // Limit to 5 promotions for rotation

      if (error) {
        console.error('❌ Failed to fetch hero promotions:', error);
        throw error;
      }

      return (data || []) as Promotion[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Calculate discount for a given price
export function calculatePromotionDiscount(
  price: number,
  promotion: Promotion,
  orderTotal?: number
): number {
  // Check min order amount if applicable
  if (promotion.min_order_amount && orderTotal && orderTotal < promotion.min_order_amount) {
    return 0;
  }

  let discount = 0;

  if (promotion.discount_type === 'percentage') {
    discount = (price * promotion.discount_value) / 100;
  } else {
    discount = promotion.discount_value;
  }

  // Apply max discount cap if set
  if (promotion.max_discount_amount && discount > promotion.max_discount_amount) {
    discount = promotion.max_discount_amount;
  }

  return Math.min(discount, price); // Don't exceed the item price
}
