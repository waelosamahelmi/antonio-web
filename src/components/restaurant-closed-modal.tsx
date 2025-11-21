import { useLanguage } from "@/lib/language-context";
import { useRestaurantSettings } from "@/hooks/use-restaurant-settings";
import { useBranches } from "@/hooks/use-branches";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Store, Phone, MapPin } from "lucide-react";
import { getBranchNextOpeningTime, formatBranchHours } from "@/lib/branch-business-hours";

interface RestaurantClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RestaurantClosedModal({ isOpen, onClose }: RestaurantClosedModalProps) {
  const { t, language } = useLanguage();
  const { config } = useRestaurantSettings();
  const { data: branches } = useBranches();

  const isBusy = config?.isBusy || false;

  // Get next opening time from first branch
  const nextOpening = branches && branches.length > 0
    ? getBranchNextOpeningTime(branches[0])
    : null;

  // Get first branch for contact info
  const firstBranch = branches && branches.length > 0 ? branches[0] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Store className="w-5 h-5" />
            <span>
              {isBusy 
                ? t("ravintola on kiireinen", "Restaurant is Busy")
                : t("ravintola suljettu", "Restaurant Closed")
              }
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-6 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isBusy
                ? t("Olemme tällä hetkellä todella kiireisiä", "We're very busy right now")
                : t("Verkkokauppa ei ole avoinna", "Online ordering is not available")
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isBusy
                ? t(
                    "Pahoittelemme, mutta emme voi ottaa vastaan tilauksia juuri nyt. Ole hyvä ja yritä uudelleen hetken kuluttua.",
                    "Sorry, but we cannot accept orders right now. Please try again in a few moments."
                  )
                : t(
                    "Pahoittelemme, mutta verkkokauppa on tällä hetkellä suljettu. Voit tarkistaa aukioloajat alla.",
                    "Sorry, but online ordering is currently closed. You can check our opening hours below."
                  )
              }
            </p>
          </div>

          {nextOpening && !isBusy && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                {t("Seuraava tilausaika", "Next ordering time")}
              </h4>
              <p className="text-blue-800 dark:text-blue-200">
                {language === 'fi' ? nextOpening.day : nextOpening.dayEn} {t("klo", "at")} {nextOpening.time}
              </p>
            </div>
          )}

          {!isBusy && firstBranch && firstBranch.opening_hours && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {t("Aukioloajat", "Opening Hours")}
                {branches && branches.length > 1 && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({language === 'fi' ? firstBranch.name : firstBranch.name_en})
                  </span>
                )}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formatBranchHours(firstBranch, language as 'fi' | 'en').map((dayHours, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {dayHours.day}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {dayHours.hours}
                    </span>
                  </div>
                ))}
              </div>

              {branches && branches.length > 1 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t(
                    "Näet kaikkien ravintoloidemme aukioloajat Ravintolat-sivulta",
                    "See all branch hours on the Branches page"
                  )}
                </p>
              )}
            </div>
          )}

          {firstBranch && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                {t("Voit myös", "You can also")}
              </h4>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.open(`tel:${firstBranch.phone}`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t("Soita meille", "Call us")}: {firstBranch.phone}
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${firstBranch.address}, ${firstBranch.postal_code} ${firstBranch.city}`)}`,
                    '_blank'
                  )}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {t("Käy paikan päällä", "Visit us")}
                </Button>

                {branches && branches.length > 1 && (
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      onClose();
                      window.location.href = '/branches';
                    }}
                  >
                    <Store className="w-4 h-4 mr-2" />
                    {t("Katso kaikki ravintolat", "View all branches")}
                  </Button>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={onClose}
            className="w-full"
          >
            {t("Sulje", "Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
