import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { useCategories, useMenuItems } from "@/hooks/use-menu";
import { usePageVariant } from "@/hooks/use-page-variant";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartModal } from "@/components/cart-modal";
import { CheckoutModal } from "@/components/checkout-modal";
import { UniversalHeader } from "@/components/universal-header";
import { HeroVideoWithPromotions } from "@/components/hero-video-with-promotions";
import { MultiBranchStatusHeaderV2 } from "@/components/multi-branch-status-header-v2";
import { AboutSection } from "@/components/about-section";
import { Footer } from "@/components/footer";
import { 
  UtensilsCrossed, 
  Star,
  ChevronRight,
  ArrowRight,
  Flame,
  Heart,
  Zap,
  Award,
  Truck,
  ShieldCheck,
  ChefHat,
  Users,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { t, language } = useLanguage();
  const { config } = useRestaurant();
  const { data: categories } = useCategories();
  const { data: menuItems } = useMenuItems();
  const variant = usePageVariant('home');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCartOpen = () => setIsCartOpen(true);
  const handleCartClose = () => setIsCartOpen(false);
  const handleCheckoutOpen = () => setIsCheckoutOpen(true);
  const handleCheckoutClose = () => setIsCheckoutOpen(false);
  const handleBackToCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  // Get featured items (first 6 available items)
  const featuredItems = menuItems?.filter(item => item.isAvailable).slice(0, 6) || [];

  // Stats data
  const stats = [
    { icon: Users, value: "10K+", label: t("Tyytyväisiä asiakkaita", "Happy Customers") },
    { icon: UtensilsCrossed, value: "50+", label: t("Herkullista annosta", "Delicious Dishes") },
    { icon: Award, value: "5⭐", label: t("Arvostelut", "Reviews") },
    { icon: Calendar, value: "10+", label: t("Vuotta kokemusta", "Years Experience") },
  ];

  // Features data
  const features = [
    { 
      icon: ChefHat, 
      title: t("Tuoreet raaka-aineet", "Fresh Ingredients"),
      description: t("Käytämme vain tuoreimpia raaka-aineita", "We use only the freshest ingredients"),
      color: "from-emerald-500 to-teal-600"
    },
    { 
      icon: Truck, 
      title: t("Nopea toimitus", "Fast Delivery"),
      description: t("Nouto tai kotiinkuljetus", "Pickup or home delivery"),
      color: "from-blue-500 to-indigo-600"
    },
    { 
      icon: ShieldCheck, 
      title: t("Laatutakuu", "Quality Guarantee"),
      description: t("100% tyytyväisyystakuu", "100% satisfaction guarantee"),
      color: "from-amber-500 to-orange-600"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <UniversalHeader onCartClick={handleCartOpen} />
      <MultiBranchStatusHeaderV2 />
      
      {/* Hero Video/Image Section */}
      <HeroVideoWithPromotions />

      {/* Stats Section */}
      <section className="relative py-16 -mt-20 z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="group glass border-0 hover-lift overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Section Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in-left">
              <Zap className="w-4 h-4" />
              {t("Miksi valita meidät", "Why Choose Us")}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 animate-fade-in-left" style={{ animationDelay: '0.1s' }}>
              {t("Laatua joka", "Quality in")}
              <span className="gradient-text block">{t("maistuu", "every bite")}</span>
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
              {t(
                "Olemme sitoutuneet tarjoamaan sinulle parasta laatua ja palvelua",
                "We are committed to providing you with the best quality and service"
              )}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group relative border-0 shadow-xl hover-lift overflow-hidden bg-card"
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full h-full bg-card rounded-[10px]"></div>
                </div>
                
                <CardContent className="relative p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-6">
                <Flame className="w-4 h-4" />
                {t("Suosituimmat", "Most Popular")}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4">
                {t("Asiakkaiden", "Customer")}
                <span className="gradient-text-reverse block">{t("suosikit", "favorites")}</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                {t(
                  "Tutustu suosituimpiin annoksiimme ja löydä uusi suosikkisi",
                  "Explore our most popular dishes and find your new favorite"
                )}
              </p>
            </div>
            <Link href="/menu">
              <Button 
                size="lg"
                className="group rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold px-8 shadow-xl"
              >
                {t("Katso koko menu", "View Full Menu")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Featured Items - Horizontal Scroll on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 stagger-children">
            {featuredItems.map((item, index) => (
              <Link href="/menu" key={item.id}>
                <Card className="group h-full cursor-pointer border-0 shadow-xl hover-lift overflow-hidden bg-card">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.imageUrl || "/placeholder-food.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    {/* Offer Badge */}
                    {item.offerPercentage && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-3 py-1.5 text-sm shadow-lg animate-pulse-ring">
                          -{item.offerPercentage}%
                        </Badge>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="glass text-foreground font-medium">
                        {categories?.find(c => c.id === item.categoryId)?.name || 'Menu'}
                      </Badge>
                    </div>
                    
                    {/* Item Title on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl md:text-2xl font-bold text-white text-shadow mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-white/80 text-sm line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      {item.offerPrice ? (
                        <>
                          <span className="text-2xl md:text-3xl font-black gradient-text">
                            {parseFloat(item.offerPrice).toFixed(2)}€
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {parseFloat(item.price).toFixed(2)}€
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl md:text-3xl font-black gradient-text">
                          {parseFloat(item.price).toFixed(2)}€
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">4.8</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Heart className="w-4 h-4" />
              {t("Palvelumme", "Our Services")}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              {t("Miten voimme", "How can we")}
              <span className="gradient-text block">{t("palvella sinua?", "serve you?")}</span>
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {/* Large Card - Menu */}
            <Link href="/menu" className="md:col-span-2 lg:col-span-2 lg:row-span-2">
              <Card className="group h-full cursor-pointer border-0 shadow-2xl overflow-hidden relative min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary"></div>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 pattern-dots text-white"></div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                
                <CardContent className="relative h-full p-8 md:p-12 flex flex-col justify-between z-10">
                  <div>
                    <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <UtensilsCrossed className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 text-shadow">
                      {t("Tutustu menuumme", "Explore Our Menu")}
                    </h3>
                    <p className="text-white/80 text-lg max-w-lg">
                      {t(
                        "Löydä suosikkisi laajasta valikoimastamme. Pizzoja, kebabeja, burgereita ja paljon muuta!",
                        "Find your favorite from our wide selection. Pizzas, kebabs, burgers and much more!"
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-8">
                    <span className="text-white font-bold text-xl">{t("Avaa menu", "Open Menu")}</span>
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all">
                      <ArrowRight className="w-7 h-7 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Phone Card */}
            <a href={`tel:${config.phone}`} className="block">
              <Card className="group h-full cursor-pointer border-0 shadow-xl hover-lift overflow-hidden bg-card min-h-[200px]">
                <CardContent className="h-full p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {t("Tilaa puhelimitse", "Order by Phone")}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t("Soita ja tilaa suoraan", "Call and order directly")}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {config.phone}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* Location Card */}
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${config.address.street}, ${config.address.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="group h-full cursor-pointer border-0 shadow-xl hover-lift overflow-hidden bg-card min-h-[200px]">
                <CardContent className="h-full p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {t("Löydä meidät", "Find Us")}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {config.address.street}, {config.address.postalCode} {config.address.city}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                    <span>{t("Näytä kartalla", "View on map")}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* Hours Card */}
            <Card className="group border-0 shadow-xl hover-lift overflow-hidden bg-card lg:col-span-1">
              <CardContent className="p-6 md:p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t("Aukioloajat", "Opening Hours")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("Ma-Pe", "Mon-Fri")}</span>
                    <span className="font-bold text-foreground bg-muted px-3 py-1 rounded-full text-sm">10:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("La-Su", "Sat-Sun")}</span>
                    <span className="font-bold text-foreground bg-muted px-3 py-1 rounded-full text-sm">11:00 - 21:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary"></div>
        
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '-2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '-4s' }}></div>
        </div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-dots text-white/5"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur text-white text-sm font-semibold mb-8 animate-fade-in-down">
            <Sparkles className="w-4 h-4" />
            {t("Tilaa nyt", "Order Now")}
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 text-shadow animate-fade-in-up">
            {t("Nälkä iskee?", "Feeling hungry?")}
            <span className="block mt-2 text-white/90">{t("Meillä on ratkaisu!", "We have the solution!")}</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t(
              "Tilaa verkossa ja nouda paikan päältä tai soita meille - palvelemme sinua mielellämme!",
              "Order online and pick up on site or call us - we are happy to serve you!"
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/menu">
              <Button 
                size="lg"
                className="group bg-white text-primary hover:bg-white/90 font-bold px-10 py-7 text-lg rounded-2xl shadow-2xl shine-effect"
              >
                {t("Tilaa verkossa", "Order Online")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href={`tel:${config.phone}`}>
              <Button 
                size="lg"
                variant="outline"
                className="group border-2 border-white text-white hover:bg-white/10 font-bold px-10 py-7 text-lg rounded-2xl"
              >
                <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                {t("Soita meille", "Call Us")}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
      
      {/* Modals */}
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
    </div>
  );
}