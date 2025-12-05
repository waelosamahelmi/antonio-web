import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import ContactSection from "@/components/contact-section";
import { UniversalHeader } from "@/components/universal-header";
import { Footer } from "@/components/footer";
import { Phone, MapPin, Clock, Mail } from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();
  const { config } = useRestaurant();
  const heroRef = useRef<HTMLDivElement>(null);

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

  const quickInfo = [
    { icon: Phone, label: t("Soita meille", "Call Us") },
    { icon: MapPin, label: t("Löydä meidät", "Find Us") },
    { icon: Clock, label: t("Aukioloajat", "Opening Hours") },
    { icon: Mail, label: t("Sähköposti", "Email") },
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
            background: `linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 50%, var(--color-accent) 100%)`,
          }}
        />
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl animate-blob opacity-30"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <div 
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl animate-blob opacity-30"
            style={{ backgroundColor: 'var(--color-accent)', animationDelay: '2s' }}
          />
          <div 
            className="absolute top-1/3 left-1/4 w-1/4 h-1/4 rounded-full blur-3xl animate-blob opacity-20"
            style={{ backgroundColor: 'var(--color-secondary)', animationDelay: '4s' }}
          />
        </div>
        
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 left-10 w-4 h-4 rounded-full bg-white animate-pulse" />
          <div className="absolute top-40 right-20 w-6 h-6 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 left-1/3 w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 right-1/4 w-5 h-5 rounded-full bg-white animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '0ms' }}>
            <div className="inline-flex items-center gap-2 glass-effect px-6 py-2.5 rounded-full border border-white/30 shadow-xl mb-8">
              <Phone className="w-4 h-4 text-white" />
              <span className="text-sm font-bold uppercase tracking-wider text-white">
                {t("Ota yhteyttä", "Get in Touch")}
              </span>
            </div>
          </div>
          
          <h1 className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-white drop-shadow-2xl" style={{ transitionDelay: '100ms' }}>
            {t("Yhteystiedot", "Contact")}
          </h1>
          
          <p className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto font-light leading-relaxed" style={{ transitionDelay: '200ms' }}>
            {t("Ota yhteyttä tai tule käymään – olemme täällä sinua varten!", "Get in touch or visit us – we're here for you!")}
          </p>
          
          {/* Quick info badges */}
          <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 mt-12 flex flex-wrap justify-center gap-4" style={{ transitionDelay: '300ms' }}>
            {quickInfo.map((item, index) => (
              <div 
                key={index}
                className="glass-effect px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <item.icon className="w-5 h-5 text-white" />
                <span className="text-white font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative -mt-1">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-16 md:h-24"
          style={{ fill: 'var(--background)' }}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <ContactSection />
      <Footer />
      
      {/* CSS for animations */}
      <style>{`
        .scroll-animate.animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>
    </div>
  );
}