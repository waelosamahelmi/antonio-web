import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Get category topping groups with all related data
export function useCategoryToppingGroups(categoryId?: number) {
  return useQuery({
    queryKey: categoryId ? ["category-topping-groups", categoryId] : ["category-topping-groups"],
    queryFn: async () => {
      console.log('📋 Fetching category topping groups for categoryId:', categoryId);
      
      if (!categoryId) {
        return [];
      }

      const { data, error } = await supabase
        .from('category_topping_groups')
        .select(`
          *,
          topping_groups!inner (
            *,
            topping_group_items (
              *,
              toppings (*)
            )
          )
        `)
        .eq('category_id', categoryId);

      if (error) {
        console.error('❌ Failed to fetch category topping groups:', error);
        throw error;
      }

      console.log('✅ Category topping groups fetched:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('📊 First group structure:', data[0]);
      }
      return data || [];
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get menu item specific topping groups (overrides)
export function useMenuItemToppingGroups(menuItemId?: number) {
  return useQuery({
    queryKey: menuItemId ? ["menu-item-topping-groups", menuItemId] : ["menu-item-topping-groups"],
    queryFn: async () => {
      console.log('📋 Fetching menu item topping groups for itemId:', menuItemId);
      
      if (!menuItemId) {
        return [];
      }

      const { data, error } = await supabase
        .from('menu_item_topping_groups')
        .select(`
          *,
          topping_groups!inner (
            *,
            topping_group_items (
              *,
              toppings (*)
            )
          )
        `)
        .eq('menu_item_id', menuItemId);

      if (error) {
        console.error('❌ Failed to fetch menu item topping groups:', error);
        throw error;
      }

      console.log('✅ Menu item topping groups fetched:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('📊 First item group structure:', data[0]);
      }
      return data || [];
    },
    enabled: !!menuItemId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get all topping groups assigned to a category or menu item
export function useToppingGroupsForItem(categoryId?: number, menuItemId?: number) {
  const { data: categoryGroups } = useCategoryToppingGroups(categoryId);
  const { data: itemGroups } = useMenuItemToppingGroups(menuItemId);

  // Menu item overrides take precedence
  if (itemGroups && itemGroups.length > 0) {
    return { data: itemGroups, source: 'item' };
  }

  return { data: categoryGroups || [], source: 'category' };
}
