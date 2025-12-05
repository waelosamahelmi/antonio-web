import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { AboutSection } from "@/components/about-section";
import { usePageVariant } from "@/hooks/use-page-variant";
import { cn } from "@/lib/utils";
import { UniversalHeader } from "@/components/universal-header";
import { Footer } from "@/components/footer";
import { Heart, Users, Clock, Award } from "lucide-react";

export default function About() {
  const { t } = useLanguage();
  const { config } = useRestaurant();
  const variant = usePageVariant('about');
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  // Get theme colors
  const theme = config?.theme || {};
  const primaryColor = theme.primary || '#8B4513';
  const secondaryColor = theme.secondary || '#FF8C00';
  const fonts = theme.fonts || { heading: 'Inter', body: 'Inter' };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Clock, value: "10+", label: t("Vuotta kokemusta", "Years Experience") },
    { icon: Users, value: "50K+", label: t("Tyytyväistä asiakasta", "Happy Customers") },
    { icon: Heart, value: "100%", label: t("Intohimoa", "Passion") },
    { icon: Award, value: "#1", label: t("Paikallinen suosikki", "Local Favorite") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <UniversalHeader />
      
      {/* Modern Hero with Theme Gradients */}
      <div ref={heroRef} className="relative overflow-hidden py-24 md:py-32">
        {/* Animated gradient background using theme colors */}
        <div 
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%)`,
          }}
        />
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl animate-blob opacity-30"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          />
          <div 
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl animate-blob opacity-30"
            style={{ backgroundColor: 'var(--color-accent)', animationDelay: '2s' }}
          />
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full blur-3xl animate-blob opacity-20"
            style={{ backgroundColor: 'var(--color-primary)', animationDelay: '4s' }}
          />
        </div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '0ms' }}>
            <div className="inline-flex items-center gap-2 glass-effect px-6 py-2.5 rounded-full border border-white/30 shadow-xl mb-8">
              <Heart className="w-4 h-4 text-white" />
              <span className="text-sm font-bold uppercase tracking-wider text-white">
                {t("Tarinaamme", "Our Story")}
              </span>
            </div>
          </div>
          
          <h1 className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-white drop-shadow-2xl" style={{ transitionDelay: '100ms' }}>
            {t("Meistä", "About Us")}
          </h1>
          
          <p className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto font-light leading-relaxed" style={{ transitionDelay: '200ms' }}>
            {t(`Tutustu ${config.name}n tarinaan ja intohimoomme laadukkaaseen ruokaan`, `Discover ${config.nameEn}'s story and our passion for quality food`)}
          </p>
          
          {/* Animated underline */}
          <div className="scroll-animate opacity-0 scale-x-0 transition-all duration-700 mt-10 flex justify-center" style={{ transitionDelay: '300ms' }}>
            <div className="w-32 h-1.5 rounded-full bg-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-white animate-shine-effect" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="relative -mt-16 z-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/20 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 text-center group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div 
                    className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div 
                    className="text-3xl md:text-4xl font-black mb-1"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AboutSection />
      <Footer />
      
      {/* CSS for animations */}
      <style>{`
        .scroll-animate.animate-visible {
          opacity: 1 !important;
          transform: translateY(0) scaleX(1) !important;
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        
        .animate-shine-effect {
          animation: shine 2s ease-in-out infinite;
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}