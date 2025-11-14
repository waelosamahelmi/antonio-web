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
    { href: "/", label: t("Etusivu", "Home") },
    { href: "/menu", label: t("Menu", "Menu") },
    { href: "/about", label: t("Meistä", "About") },
    { href: "/contact", label: t("Yhteystiedot", "Contact") },
    { href: "/locations", label: t("Ruokapisteet", "Locations") },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-stone-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/">
              <div className="transform transition-transform hover:scale-105">
                <Logo />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`text-gray-700 dark:text-gray-300 transition-all font-semibold px-6 py-5 rounded-xl relative group ${
                      location === item.href ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' : ''
                    }`}
                  >
                    {item.label}
                    {location === item.href && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                    )}
                    {location !== item.href && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full group-hover:w-8 transition-all duration-300"></div>
                    )}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-stone-800 transition-all hover:scale-105"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
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
                  className="px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-stone-800 flex items-center space-x-2 transition-all hover:scale-105"
                  title={t("Vaihda kieli", "Change language")}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-bold hidden sm:inline">
                    {language === "fi" ? "FI" : "EN"}
                  </span>
                </Button>
                
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-stone-700 z-50 overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguage("fi");
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-950 dark:hover:to-orange-950 transition-all text-sm font-medium ${
                        language === "fi" ? "bg-gradient-to-r from-red-500 to-orange-500 text-white" : ""
                      }`}
                    >
                      🇫🇮 Suomi
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguage("en");
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-950 dark:hover:to-orange-950 transition-all text-sm font-medium ${
                        language === "en" ? "bg-gradient-to-r from-red-500 to-orange-500 text-white" : ""
                      }`}
                    >
                      🇺🇸 English
                    </button>
                  </div>
                )}
              </div>

              {onCartClick && (
                <Button
                  onClick={onCartClick}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-5 py-5 flex items-center justify-center relative rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all group"
                  title={t("Kori", "Cart")}
                >
                  <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold animate-bounce shadow-lg">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Mobile Cart Button */}
              {onCartClick && (
                <Button
                  onClick={onCartClick}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 flex items-center justify-center relative rounded-xl shadow-lg"
                  size="sm"
                  title={t("Kori", "Cart")}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-stone-800"
                title={t("Valikko", "Menu")}
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-20 right-0 w-80 h-[calc(100vh-5rem)] bg-white dark:bg-stone-900 shadow-2xl overflow-y-auto rounded-l-3xl">
            <div className="p-6 space-y-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {t("Navigaatio", "Navigation")}
                </p>
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left py-4 rounded-xl font-semibold transition-all ${
                        location === item.href 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                          : 'hover:bg-gray-100 dark:hover:bg-stone-800'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                {/* Mobile Theme Toggle */}
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="w-full justify-start py-4 rounded-xl hover:bg-gray-100 dark:hover:bg-stone-800 font-medium"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-5 h-5 mr-3 text-yellow-400" />
                      {t("Vaalea teema", "Light theme")}
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 mr-3 text-blue-600" />
                      {t("Tumma teema", "Dark theme")}
                    </>
                  )}
                </Button>

                {/* Mobile Language Selection */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t("Kieli", "Language")}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setLanguage("fi");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        language === "fi" 
                          ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg" 
                          : "hover:bg-gray-100 dark:hover:bg-stone-800"
                      }`}
                    >
                      🇫🇮 Suomi
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        language === "en" 
                          ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg" 
                          : "hover:bg-gray-100 dark:hover:bg-stone-800"
                      }`}
                    >
                      🇺🇸 English
                    </button>
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