import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { ShoppingCart, Moon, Sun, Menu, Globe, X } from "lucide-react";
import { Link, useLocation } from "wouter";

interface UniversalHeaderProps {
  onCartClick?: () => void;
}

export function UniversalHeader({ onCartClick }: UniversalHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const { config } = useRestaurant();
  const [location] = useLocation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      if (isLanguageMenuOpen) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen, isLanguageMenuOpen]);

  const navigationItems = [
    { href: "/", label: t("Etusivu", "Home", "الصفحة الرئيسية", "Главная", "Hem") },
    { href: "/menu", label: t("Menu", "Menu", "القائمة", "Меню", "Meny") },
    // { href: "/lounas", label: t("Lounas", "Lunch", "غداء", "Обед", "Lunch") },
    { href: "/about", label: t("Meistä", "About", "معلومات عنا", "О нас", "Om oss") },
    { href: "/contact", label: t("Yhteystiedot", "Contact", "اتصل بنا", "Контакты", "Kontakt") },
    // { href: "/branches", label: t("Pizzeriat", "Branches", "الفروع", "Филиалы", "Filialer") },
    // { href: "/locations", label: t("Ruokapisteet", "Locations", "المواقع", "Местоположения", "Platser") },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/">
              <div className="transform transition-all hover:scale-105 hover:opacity-80">
                <Logo />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`relative px-4 py-2 font-medium transition-all rounded-full ${
                      location === item.href 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full w-10 h-10 hover:bg-muted transition-all"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </Button>
              
              {/* Desktop Language Selection */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLanguageMenuOpen(!isLanguageMenuOpen);
                  }}
                  className="rounded-full px-3 h-10 hover:bg-muted flex items-center gap-2 transition-all"
                  title={t("Vaihda kieli", "Change language", "تغيير اللغة", "Изменить язык", "Byt språk")}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {language === "fi" ? "FI" : language === "en" ? "EN" : language === "ar" ? "AR" : language === "ru" ? "RU" : "SV"}
                  </span>
                </Button>
                
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-fade-in-up">
                    {[
                      { code: "fi", label: "🇫🇮 Suomi" },
                      { code: "en", label: "🇺🇸 English" },
                      { code: "ar", label: "🇸🇦 العربية" },
                      { code: "ru", label: "🇷🇺 Русский" },
                      { code: "sv", label: "🇸🇪 Svenska" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLanguage(lang.code as any);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-muted transition-all text-sm font-medium ${
                          language === lang.code ? "bg-primary text-primary-foreground" : "text-foreground"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {onCartClick && (
                <Button
                  onClick={onCartClick}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 h-10 flex items-center gap-2 rounded-full shadow-md hover:shadow-lg transition-all shine-effect"
                  title={t("Kori", "Cart", "عربة التسوق", "Корзина", "Varukorg")}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {totalItems > 0 && (
                    <Badge className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-bold">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Cart Button */}
              {onCartClick && (
                <Button
                  onClick={onCartClick}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground p-2.5 relative rounded-full shadow-md"
                  size="icon"
                  title={t("Kori", "Cart", "عربة التسوق", "Корзина", "Varukorg")}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="p-2.5 rounded-full hover:bg-muted"
                title={t("Valikko", "Menu", "القائمة", "Меню", "Meny")}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-16 right-0 w-full max-w-sm h-[calc(100vh-4rem)] bg-card shadow-2xl overflow-y-auto border-l border-border">
            <div className="p-6 space-y-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                  {t("Navigaatio", "Navigation", "التنقل", "Навигация", "Navigation")}
                </p>
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left py-3 px-3 rounded-xl font-medium transition-all ${
                        location === item.href 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted text-foreground'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                {/* Mobile Theme Toggle */}
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="w-full justify-start py-3 px-3 rounded-xl hover:bg-muted font-medium"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-5 h-5 mr-3 text-yellow-500" />
                      {t("Vaalea teema", "Light theme", "مظهر فاتح", "Светлая тема", "Ljust tema")}
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 mr-3 text-slate-700" />
                      {t("Tumma teema", "Dark theme", "مظهر داكن", "Тёмная тема", "Mörkt tema")}
                    </>
                  )}
                </Button>

                {/* Mobile Language Selection */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                    {t("Kieli", "Language", "اللغة", "Язык", "Språk")}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { code: "fi", label: "🇫🇮 Suomi" },
                      { code: "en", label: "🇺🇸 English" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          language === lang.code 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}