import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { useBranches } from "@/hooks/use-branches";
import { UtensilsCrossed, Phone, Mail, MapPin, Heart, Facebook, Instagram } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Link } from "wouter";

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export function Footer() {
  const { t, language } = useLanguage();
  const { config } = useRestaurant();
  const { data: branches } = useBranches();
  
  const IconComponent = (LucideIcons as any)[config.logo.icon] || LucideIcons.UtensilsCrossed;

  return (
    <footer className="bg-card text-foreground relative overflow-hidden border-t border-border">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2.5 rounded-xl">
                <IconComponent className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">{config.name}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
              {t(config.about.story, config.about.storyEn)}
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              {config.facebook && (
                <a
                  href={config.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted p-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all hover-lift"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {config.instagram && (
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted p-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all hover-lift"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {config.tiktok && (
                <a
                  href={config.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted p-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all hover-lift"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("Pikanavigaatio", "Quick Links")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium animated-underline inline-block">
                  {t("Etusivu", "Home")}
                </a>
              </li>
              <li>
                <a href="/menu" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium animated-underline inline-block">
                  Menu
                </a>
              </li>
              <li>
                <a href="/about" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium animated-underline inline-block">
                  {t("Meistä", "About")}
                </a>
              </li>
              <li>
                <a href="/contact" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium animated-underline inline-block">
                  {t("Yhteystiedot", "Contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("Tietoa", "Information")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms">
                  <span className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium animated-underline inline-block cursor-pointer">
                    {t("Käyttöehdot", "Terms & Conditions")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium animated-underline inline-block cursor-pointer">
                    {t("Tietosuoja", "Privacy Policy")}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - All Branches */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("Yhteystiedot", "Contact Info")}
            </h3>
            {branches && branches.length > 0 ? (
              <div className="space-y-5">
                {branches.slice(0, 2).map((branch) => (
                  <div key={branch.id} className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">
                      {language === 'en' ? branch.name_en : branch.name}
                    </h4>
                    <div className="space-y-1.5">
                      <a
                        href={`tel:${branch.phone}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-sm"
                      >
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{branch.phone}</span>
                      </a>
                      {branch.email && (
                        <a
                          href={`mailto:${branch.email}`}
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-sm"
                        >
                          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="break-all">{branch.email}</span>
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-all text-sm"
                      >
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{branch.address}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <a
                  href={`tel:${config.phone}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-sm"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{config.phone}</span>
                </a>
                <a
                  href={`mailto:${config.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-sm"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">{config.email}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${config.address.street}, ${config.address.postalCode} ${config.address.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-all text-sm"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{config.address.street}, {config.address.postalCode} {config.address.city}</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} {config.name}. {t("Kaikki oikeudet pidätetään.", "All rights reserved.")}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>{t("Tehty", "Made with")}</span>
              <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
              <span>{t("Suomessa", "in Finland")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
