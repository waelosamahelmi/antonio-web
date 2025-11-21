import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { Clock, Store, ShoppingCart, MapPin } from "lucide-react";
import { useBranches } from "@/hooks/use-branches";
import { isBranchOpen, isAnyBranchOpen } from "@/lib/branch-business-hours";
import { useRestaurantSettings } from "@/hooks/use-restaurant-settings";

export function MultiBranchStatusHeaderV2() {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data: branches, isLoading } = useBranches();
  const { isOpen: dbIsOpen } = useRestaurantSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Don't render if still loading
  if (isLoading || !branches) {
    return null;
  }

  const anyBranchOpen = isAnyBranchOpen(branches, currentTime);

  // Use database override if available, otherwise use calculated status
  const effectiveIsOpen = dbIsOpen !== undefined ? dbIsOpen : anyBranchOpen;

  return (
    <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 border-b border-red-100/50 dark:border-stone-700/50 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Left: General Status */}
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${
              effectiveIsOpen
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50'
                : 'bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/50'
            } transition-all`}>
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${
                  effectiveIsOpen
                    ? 'bg-green-500 animate-pulse shadow-green-500/50'
                    : 'bg-red-500 shadow-red-500/50'
                }`}></div>
                <span className="text-sm font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  {effectiveIsOpen
                    ? t("Ravintolat avoinna", "Restaurants Open")
                    : t("Ravintolat suljettu", "Restaurants Closed")
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Center: Branch Status Pills */}
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {branches.map((branch) => {
              const isOpen = isBranchOpen(branch, currentTime);
              const branchName = language === 'fi' ? branch.name : branch.name_en;

              return (
                <div
                  key={branch.id}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isOpen
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{branchName}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* Right: Ordering Status & Time */}
          <div className="flex items-center space-x-4">
            {/* Online Ordering Status */}
            <div className="flex items-center space-x-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className={`p-1.5 rounded-lg ${
                effectiveIsOpen
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  : 'bg-gradient-to-br from-gray-400 to-gray-500'
              } transition-all`}>
                <ShoppingCart className="w-3.5 h-3.5 text-white" />
              </div>
              <div className={`w-2 h-2 rounded-full ${effectiveIsOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-xs font-semibold hidden sm:inline text-gray-700 dark:text-gray-300">
                {effectiveIsOpen
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
      </div>
    </div>
  );
}
