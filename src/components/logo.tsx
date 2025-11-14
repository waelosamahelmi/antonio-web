import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import * as LucideIcons from "lucide-react";

export function Logo({ className = "h-12" }: { className?: string }) {
  const { config } = useRestaurant();
  
  // Debug logging
  console.log('Logo config:', config.logo);
  
  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[config.logo.icon] || LucideIcons.UtensilsCrossed;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {config.logo.imageUrl ? (
        <img 
          src={config.logo.imageUrl} 
          alt={config.name} 
          className="h-16 w-auto object-contain"
          onError={(e) => console.error('Logo image failed to load:', e)}
          onLoad={() => console.log('Logo image loaded successfully')}
        />
      ) : (
        <div className="flex items-center space-x-3">
          <IconComponent className="w-10 h-10 text-red-600 dark:text-red-400" />
          {config.logo.showText && (
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {config.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
}