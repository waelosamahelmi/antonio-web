import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { useHeroPromotions } from "@/hooks/use-promotions";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Phone, ChevronDown, Sparkles, Tag, Percent, Star, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export function HeroVideoWithPromotions() {
  const { t, language } = useLanguage();
  const { config } = useRestaurant();
  const { data: promotions } = useHeroPromotions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPromotion, setIsPromotion] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Rotate between restaurant info and promotions every 5 seconds
  useEffect(() => {
    if (!promotions || promotions.length === 0) {
      setIsPromotion(false);
      return;
    }

    const interval = setInterval(() => {
      setIsPromotion((prev) => {
        if (prev) {
          setCurrentIndex((idx) => {
            const nextIdx = idx + 1;
            if (nextIdx >= promotions.length) {
              return 0;
            }
            return nextIdx;
          });
          return currentIndex + 1 < promotions.length;
        } else {
          setCurrentIndex(0);
          return true;
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [promotions, currentIndex]);

  const currentPromotion = promotions?.[currentIndex];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background with Ken Burns effect */}
      <div className="absolute inset-0 z-0">
        <video
          key={config.hero.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover animate-ken-burns"
          poster={config.hero.backgroundImage}
        >
          {config.hero.videoUrl && (
            <source src={config.hero.videoUrl} type="video/mp4" />
          )}
        </video>

        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30"></div>
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, ${config.theme.primary}20 100%)`
          }}
        />
      </div>
      
      {/* Animated grain texture */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none noise-bg"></div>
      
      {/* Floating orbs with mouse parallax */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full blur-[100px] animate-float"
          style={{ 
            backgroundColor: config.theme.primary,
            opacity: 0.15,
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full blur-[80px] animate-float-delayed"
          style={{ 
            backgroundColor: config.theme.secondary,
            opacity: 0.12,
            bottom: '20%',
            right: '15%',
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full blur-[60px] animate-float-slow"
          style={{ 
            backgroundColor: config.theme.accent || '#ffffff',
            opacity: 0.08,
            top: '50%',
            left: '50%',
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-left" key={isPromotion ? `promo-${currentIndex}` : 'restaurant'}>
            {!isPromotion ? (
              <>
                {/* Floating badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-slide-in-left">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-white/90 text-sm font-medium ml-2">
                    {t("Huippuarvosteltu", "Top Rated")}
                  </span>
                </div>

                {/* Main heading with split animation */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] animate-slide-in-up">
                  <span className="block">{t(config.name, config.nameEn)}</span>
                  <span 
                    className="block mt-2 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${config.theme.primary}, ${config.theme.secondary})`
                    }}
                  >
                    {t(config.tagline, config.taglineEn)}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl leading-relaxed animate-slide-in-up animation-delay-200">
                  {t(config.description, config.descriptionEn)}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 animate-slide-in-up animation-delay-300">
                  <Link href="/menu">
                    <Button
                      size="lg"
                      className="group relative overflow-hidden text-lg px-8 py-6 rounded-full font-bold shadow-2xl transition-all duration-300 hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${config.theme.primary}, ${config.theme.secondary})`,
                        color: 'white'
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {t("Tilaa nyt", "Order Now")}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </Button>
                  </Link>

                  <Button
                    size="lg"
                    className="group text-lg px-8 py-6 rounded-full font-bold bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                    asChild
                  >
                    <a href={`tel:${config.phone}`}>
                      <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      {config.phone}
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              /* Promotion Display */
              currentPromotion && (
                <>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-400/30 mb-6 animate-slide-in-left">
                    <Tag className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-bold uppercase tracking-wider">
                      {t("Erikoistarjous", "Special Offer")}
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] animate-slide-in-up">
                    {language === 'fi' ? currentPromotion.name : currentPromotion.name_en}
                  </h1>

                  <div className="inline-flex items-center gap-4 mb-6 animate-slide-in-up animation-delay-200">
                    <div 
                      className="text-6xl md:text-7xl font-black"
                      style={{ color: config.theme.secondary }}
                    >
                      {currentPromotion.discount_type === 'percentage'
                        ? `${currentPromotion.discount_value}%`
                        : `${currentPromotion.discount_value}€`
                      }
                    </div>
                    <span className="text-2xl font-bold text-white/60 uppercase">
                      {t("ALE", "OFF")}
                    </span>
                  </div>

                  <p className="text-xl text-white/70 mb-8 max-w-xl animate-slide-in-up animation-delay-300">
                    {language === 'fi' ? currentPromotion.description : currentPromotion.description_en}
                  </p>

                  <Link href="/menu">
                    <Button
                      size="lg"
                      className="group text-lg px-8 py-6 rounded-full font-bold shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-400"
                      style={{
                        background: `linear-gradient(135deg, ${config.theme.primary}, ${config.theme.secondary})`,
                        color: 'white'
                      }}
                    >
                      {t("Hyödynnä tarjous", "Claim Offer")}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>

          {/* Right side - Decorative element / Feature cards */}
          <div className="hidden lg:block relative animate-slide-in-right">
            <div className="relative">
              {/* Glowing ring */}
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse-slow"
                style={{
                  background: `conic-gradient(from 0deg, ${config.theme.primary}, ${config.theme.secondary}, ${config.theme.primary})`
                }}
              />
              
              {/* Feature cards floating */}
              <div className="relative space-y-4">
                {config.hero.features.slice(0, 3).map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-slide-in-right"
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                      marginLeft: index === 1 ? '2rem' : index === 2 ? '1rem' : '0'
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: feature.color }}
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg">
                      {t(feature.title, feature.titleEn)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-white/60 animate-scroll-down"></div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ken-burns {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(15px) translateX(-15px); }
          66% { transform: translateY(-10px) translateX(5px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes scroll-down {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(8px); }
        }
        .animate-ken-burns {
          animation: ken-burns 25s ease-in-out infinite;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-scroll-down {
          animation: scroll-down 1.5s ease-in-out infinite;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
      `}} />
    </section>
  );
}
