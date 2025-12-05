import { useState, useEffect, useMemo, useRef } from "react";
import { useCategories, useMenuItems } from "@/hooks/use-menu";
import { useLanguage } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { useBranches } from "@/hooks/use-branches";
import { usePageVariant } from "@/hooks/use-page-variant";
import { cn } from "@/lib/utils";
import { useActivePromotions, calculatePromotionDiscount } from "@/hooks/use-promotions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemDetailModal } from "@/components/item-detail-modal";
import { CartModal } from "@/components/cart-modal";
import { CheckoutModal } from "@/components/checkout-modal";
import { RestaurantClosedModal } from "@/components/restaurant-closed-modal";
import { UniversalHeader } from "@/components/universal-header";
import { MobileNav } from "@/components/mobile-nav";
import { MultiBranchStatusHeaderV2 } from "@/components/multi-branch-status-header-v2";
import { 
  Search, 
  Leaf, 
  Wheat, 
  Heart, 
  Pizza,
  UtensilsCrossed,
  Beef,
  Fish,
  Coffee,
  Beer,
  IceCream,
  Salad,
  ChefHat,
  Sandwich,
  AlertTriangle,
  Store,
  MapPin,
  Flame,
  Plus,
  Star,
  Sparkles,
  Filter,
  X,
  ArrowRight,
  ShoppingBag,
  Clock,
  TrendingUp,
  Grid3X3,
  LayoutList,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { isAnyBranchOpen, isBranchOrderingAvailable } from "@/lib/branch-business-hours";
import { useRestaurantSettings } from "@/hooks/use-restaurant-settings";

export default function Menu() {
  const { t, language } = useLanguage();
  const { data: categories } = useCategories();
  const { data: menuItems, isLoading } = useMenuItems();
  const { data: branches } = useBranches();
  const { addItem } = useCart();
  const { config } = useRestaurantSettings();
  const { data: promotions } = useActivePromotions();
  const variant = usePageVariant('menu');
  
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [isOrderingAvailable, setIsOrderingAvailable] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'comfortable'>('grid');
  
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const checkOrderingStatus = () => {
      if (config && config.isOpen) {
        setIsOrderingAvailable(true);
        setShowClosedModal(false);
        return;
      }

      if (config && config.isBusy) {
        setIsOrderingAvailable(false);
        if (!showClosedModal) setShowClosedModal(true);
        return;
      }

      if (branches && branches.length > 0) {
        const anyBranchOpen = isAnyBranchOpen(branches);
        setIsOrderingAvailable(anyBranchOpen);
        if (!anyBranchOpen && !showClosedModal) setShowClosedModal(true);
      } else {
        setIsOrderingAvailable(true);
      }
    };

    checkOrderingStatus();
    const interval = setInterval(checkOrderingStatus, 60000);
    return () => clearInterval(interval);
  }, [showClosedModal, config, branches]);

  const handleCartOpen = () => {
    if (!isOrderingAvailable) { setShowClosedModal(true); return; }
    setIsCartOpen(true);
  };
  
  const handleCartClose = () => setIsCartOpen(false);
  
  const handleCheckoutOpen = () => {
    if (!isOrderingAvailable) { setShowClosedModal(true); return; }
    setIsCheckoutOpen(true);
  };
  
  const handleCheckoutClose = () => setIsCheckoutOpen(false);
  const handleBackToCart = () => { setIsCheckoutOpen(false); setIsCartOpen(true); };

  const itemsWithPromotions = useMemo(() => {
    if (!menuItems || !promotions) return menuItems || [];

    return menuItems.map((item: any) => {
      const applicablePromotions = promotions.filter((promo: any) => {
        const categoryMatch = !promo.category_id || promo.category_id === item.categoryId;
        const branchMatch = !promo.branch_id || !selectedBranch || promo.branch_id === selectedBranch;
        return categoryMatch && branchMatch;
      });

      if (applicablePromotions.length === 0) return item;

      const bestPromotion = applicablePromotions[0];
      const itemPrice = parseFloat(item.offerPrice || item.price);
      const discount = calculatePromotionDiscount(itemPrice, bestPromotion);
      
      if (discount > 0) {
        return {
          ...item,
          promotionalPrice: (itemPrice - discount).toFixed(2),
          promotionDiscount: discount.toFixed(2),
          promotionPercentage: Math.round((discount / itemPrice) * 100),
          activePromotion: bestPromotion,
        };
      }
      return item;
    });
  }, [menuItems, promotions, selectedBranch]);

  const filteredItems = itemsWithPromotions?.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.categoryId?.toString() === selectedCategory;
    const matchesSearch = searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameEn?.toLowerCase().includes(searchTerm.toLowerCase());

    const itemBranchId = (item as any).branch_id;
    
    if (selectedBranch === null) {
      if (itemBranchId === null || itemBranchId === undefined) {
        return matchesCategory && matchesSearch && item.isAvailable;
      }
      const itemBranch = branches?.find(b => b.id === itemBranchId);
      const isBranchOpen = itemBranch ? isBranchOrderingAvailable(itemBranch) : false;
      return matchesCategory && matchesSearch && item.isAvailable && isBranchOpen;
    }
    
    const matchesBranch = itemBranchId === null || itemBranchId === undefined || itemBranchId === selectedBranch;
    return matchesCategory && matchesSearch && matchesBranch && item.isAvailable;
  }) || [];

  // Group items by category for section view
  const itemsByCategory = useMemo(() => {
    if (!categories || !filteredItems) return {};
    const grouped: { [key: string]: any[] } = {};
    
    if (selectedCategory === "all") {
      categories.forEach(cat => {
        const items = filteredItems.filter(item => item.categoryId === cat.id);
        if (items.length > 0) {
          grouped[cat.id] = items;
        }
      });
    } else {
      grouped[selectedCategory] = filteredItems;
    }
    return grouped;
  }, [categories, filteredItems, selectedCategory]);

  const handleItemClick = (item: any) => {
    if (!isOrderingAvailable) { setShowClosedModal(true); return; }
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleAddToCart = (item: any, quantity: number, size?: string, toppings?: string[], specialInstructions?: string, toppingsPrice?: number, sizePrice?: number) => {
    if (!isOrderingAvailable) { setShowClosedModal(true); return; }
    addItem(item, quantity, size, toppings, specialInstructions, toppingsPrice, sizePrice);
    setShowItemModal(false);
  };

  const formatPrice = (price: string) => `${parseFloat(price).toFixed(2)} €`;

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('pizza')) return Pizza;
    if (name.includes('kebab')) return Beef;
    if (name.includes('kana') || name.includes('chicken')) return ChefHat;
    if (name.includes('burger')) return Sandwich;
    if (name.includes('salaatti') || name.includes('salad')) return Salad;
    if (name.includes('juomat') || name.includes('drink')) return Coffee;
    if (name.includes('olut') || name.includes('beer')) return Beer;
    if (name.includes('jälkiruoka') || name.includes('dessert')) return IceCream;
    if (name.includes('kala') || name.includes('fish')) return Fish;
    return UtensilsCrossed;
  };

  const getCategoryName = (categoryId: number | string | null) => {
    if (!categoryId) return '';
    const category = categories?.find(cat => cat.id === Number(categoryId));
    return category?.name?.replace(/🍕😍|🥗|🍗|🍔|🥤/g, '').trim() || '';
  };

  const scrollToCategory = (categoryId: string) => {
    setSelectedCategory("all");
    setTimeout(() => {
      categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Popular items (items with offers or high in list)
  const popularItems = useMemo(() => {
    return itemsWithPromotions
      ?.filter(item => item.isAvailable && (item.promotionalPrice || item.offerPrice))
      .slice(0, 4) || [];
  }, [itemsWithPromotions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <UniversalHeader onCartClick={handleCartOpen} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-full mb-6 rounded-xl" />
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-28 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <UniversalHeader onCartClick={handleCartOpen} />
      
      {/* Restaurant Status */}
      <MultiBranchStatusHeaderV2 />

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            {t("Ruokalista", "Menu")}
          </h1>
          <p className="text-muted-foreground">
            {t("Valitse herkullinen annoksesi", "Choose your delicious meal")}
          </p>
        </div>

        {/* Quick Category Navigation */}
        {categories && categories.length > 0 && (
          <div className="mb-8">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4">
              {categories.map((cat) => {
                const IconComponent = getCategoryIcon(cat.name);
                const count = menuItems?.filter(item => item.categoryId === cat.id && item.isAvailable).length || 0;
                if (count === 0) return null;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id.toString())}
                    className="flex-shrink-0 group"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-1.5 group-hover:scale-105">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground text-center line-clamp-1 px-1">
                        {cat.name.replace(/🍕😍|🥗|🍗|🍔|🥤/g, '').trim().split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("Etsi ruokalistalta...", "Search the menu...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-6 text-base bg-card border-border rounded-2xl shadow-sm focus:shadow-md transition-shadow"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Branch Selection */}
        {branches && branches.length > 1 && (
          <div className="mb-8 p-4 bg-card rounded-2xl border border-border">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Store className="w-4 h-4" />
                <span className="text-sm font-medium">{t("Toimipiste", "Branch")}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedBranch(null)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    selectedBranch === null
                      ? "bg-primary text-white shadow-md"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  {t("Kaikki", "All")}
                </button>
                {branches.filter(b => isBranchOrderingAvailable(b)).map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                      selectedBranch === branch.id
                        ? "bg-primary text-white shadow-md"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {language === 'en' ? branch.name_en : branch.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deals Section */}
        {popularItems.length > 0 && !searchTerm && selectedCategory === "all" && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{t("Tarjoukset", "Deals")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularItems.map((item) => (
                <div
                  key={`deal-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  className="group cursor-pointer bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-200 dark:border-orange-900/30 rounded-2xl p-4 hover:shadow-lg hover:border-orange-300 transition-all"
                >
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                      <img 
                        src={item.imageUrl || "/placeholder-food.jpg"} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span className="text-xs font-bold text-orange-600">
                          -{item.promotionPercentage || item.offerPercentage}%
                        </span>
                      </div>
                      <h3 className="font-bold text-foreground text-sm line-clamp-1 mb-1">{item.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-primary">
                          {formatPrice(item.promotionalPrice || item.offerPrice)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchTerm && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredItems.length} {t("tulosta haulle", "results for")} "{searchTerm}"
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="text-sm text-primary hover:underline"
              >
                {t("Tyhjennä", "Clear")}
              </button>
            </div>
          </div>
        )}

        {/* Menu Sections by Category */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {t("Ei tuloksia", "No results")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("Kokeile toista hakusanaa", "Try a different search")}
            </p>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
              {t("Näytä kaikki", "Show all")}
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(itemsByCategory).map(([categoryId, items]) => {
              const category = categories?.find(c => c.id === Number(categoryId));
              if (!category || items.length === 0) return null;
              
              const IconComponent = getCategoryIcon(category.name);
              const categoryName = category.name.replace(/🍕😍|🥗|🍗|🍔|🥤/g, '').trim();
              
              return (
                <div 
                  key={categoryId} 
                  ref={el => categoryRefs.current[categoryId] = el}
                  className="scroll-mt-4"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-5 sticky top-0 bg-background/95 backdrop-blur-sm py-3 -mx-4 px-4 z-10">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{categoryName}</h2>
                      <p className="text-sm text-muted-foreground">{items.length} {t("tuotetta", "items")}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "group bg-card rounded-2xl border border-border overflow-hidden transition-all",
                          isOrderingAvailable 
                            ? "cursor-pointer hover:shadow-xl hover:border-primary/20 hover:scale-[1.02]" 
                            : "opacity-60 cursor-not-allowed"
                        )}
                      >
                        <div className="flex">
                          {/* Image */}
                          <div className="w-32 md:w-40 flex-shrink-0 relative overflow-hidden">
                            <img
                              src={item.imageUrl || "/placeholder-food.jpg"}
                              alt={item.name}
                              className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                            
                            {/* Badges */}
                            {(item.promotionPercentage || item.offerPercentage) && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                -{item.promotionPercentage || item.offerPercentage}%
                              </div>
                            )}
                            
                            {!isOrderingAvailable && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                            <div>
                              {/* Title & Dietary */}
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                  {item.name}
                                </h3>
                                <div className="flex gap-1 flex-shrink-0">
                                  {item.isVegetarian && (
                                    <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center" title="Vegetarian">
                                      <Leaf className="w-3 h-3 text-green-600" />
                                    </span>
                                  )}
                                  {item.isVegan && (
                                    <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center" title="Vegan">
                                      <Heart className="w-3 h-3 text-green-600" />
                                    </span>
                                  )}
                                  {item.isGlutenFree && (
                                    <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center" title="Gluten-free">
                                      <Wheat className="w-3 h-3 text-amber-600" />
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {item.description || t("Herkullinen annos ravintolastamme", "Delicious dish from our restaurant")}
                              </p>
                            </div>

                            {/* Price & Action */}
                            <div className="flex items-center justify-between">
                              {parseFloat(item.price) === 0 ? (
                                <span className="text-sm text-muted-foreground italic">
                                  {t("Kysy hinta", "Ask price")}
                                </span>
                              ) : (
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl font-black text-primary">
                                    {formatPrice(item.promotionalPrice || item.offerPrice || item.price)}
                                  </span>
                                  {(item.promotionalPrice || item.offerPrice) && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {formatPrice(item.price)}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {isOrderingAvailable && (
                                <button 
                                  className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                                  onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        onAddToCart={handleAddToCart}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onCheckout={handleCheckoutOpen}
      />
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCheckoutClose}
        onBack={handleBackToCart}
      />

      <RestaurantClosedModal
        isOpen={showClosedModal}
        onClose={() => setShowClosedModal(false)}
      />
    </div>
  );
}