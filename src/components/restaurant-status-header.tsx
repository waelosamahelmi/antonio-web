import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { Clock, Store, ShoppingCart } from "lucide-react";
import { getRestaurantStatus } from "@/lib/business-hours";
import { useRestaurantSettings } from "@/hooks/use-restaurant-settings";

export function RestaurantStatusHeader() {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { config, isOpen: dbIsOpen } = useRestaurantSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Don't render if no config available
  if (!config) {
    console.warn('⚠️ RestaurantStatusHeader: No config available');
    return null;
  }

  console.log('🏪 Restaurant Status Header Check:', {
    currentTime: currentTime.toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' }),
    configHours: {
      general: config.hours.general,
      pickup: config.hours.pickup,
      delivery: config.hours.delivery
    },
    dbIsOpen
  });

  const status = getRestaurantStatus(config, currentTime);
  const { isOpen: restaurantOpen, isOrderingOpen, nextOpening, nextOrdering } = status;

  console.log('📊 Status Result:', {
    restaurantOpen,
    isOrderingOpen,
    nextOpening,
    nextOrdering,
    dbIsOpen
  });

  // Use database override if available, otherwise use calculated status
  const effectiveIsOpen = dbIsOpen !== undefined ? dbIsOpen : restaurantOpen;

  return (
    <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 border-b border-red-100/50 dark:border-stone-700/50 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${
              effectiveIsOpen 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50' 
                : 'bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/50'
            } transition-all`}>
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${
                  effectiveIsOpen 
                    ? 'bg-green-500 animate-pulse shadow-green-500/50' 
                    : 'bg-red-500 shadow-red-500/50'
                }`}></div>
                <span className="text-sm font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  {effectiveIsOpen 
                    ? t("Avoinna", "Open")
                    : t("Suljettu", "Closed")
                  }
                </span>
              </div>
              {!effectiveIsOpen && nextOpening && (
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {t(`Avautuu ${nextOpening.day} ${nextOpening.time}`, `Opens ${nextOpening.day} ${nextOpening.time}`)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Online Ordering Status */}
            <div className="flex items-center space-x-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className={`p-1.5 rounded-lg ${
                isOrderingOpen 
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                  : 'bg-gradient-to-br from-gray-400 to-gray-500'
              } transition-all`}>
                <ShoppingCart className="w-3.5 h-3.5 text-white" />
              </div>
              <div className={`w-2 h-2 rounded-full ${isOrderingOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-xs font-semibold hidden sm:inline text-gray-700 dark:text-gray-300">
                {isOrderingOpen 
                  ? t("Tilaukset avoinna", "Orders open")
                  : t("Tilaukset suljettu", "Orders closed")
                }
              </span>
            </div>
            
            {/* Current Time */}
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>
                {currentTime.toLocaleTimeString('fi-FI', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Europe/Helsinki'
                })}
              </span>
            </div>
          </div>
        </div>
        
        {/* Ordering hours info when closed */}
        {!isOrderingOpen && nextOrdering && (
          <div className="mt-3 pt-3 border-t border-red-200/50 dark:border-stone-700/50">
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <p className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                {t(
                  `Verkkokauppa avautuu: ${nextOrdering.day} klo ${nextOrdering.time}`,
                  `Online ordering opens: ${nextOrdering.day} at ${nextOrdering.time}`
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}