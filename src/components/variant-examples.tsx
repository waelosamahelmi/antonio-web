/**
 * Example: How to implement layout variants in a page
 * This file demonstrates different approaches to using the variant system
 */

import { usePageVariant } from "@/hooks/use-page-variant";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// EXAMPLE 1: Separate Component per Variant (Best for completely different layouts)
// ==================================================================================

function HomeVariant1() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      <section className="py-20">
        <h1 className="text-6xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Modern Gradient Design
        </h1>
        <div className="grid grid-cols-3 gap-6 mt-12">
          {/* Cards with animations and gradients */}
        </div>
      </section>
    </div>
  );
}

function HomeVariant2() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16">
        <h1 className="text-5xl font-light text-gray-900">
          Minimalist Clean Design
        </h1>
        <div className="space-y-6 mt-8">
          {/* Simple, clean cards */}
        </div>
      </section>
    </div>
  );
}

function HomeVariant3() {
  return (
    <div className="min-h-screen bg-amber-50">
      <section className="py-24">
        <h1 className="text-7xl font-serif text-amber-900">
          Classic Restaurant Design
        </h1>
        <div className="grid grid-cols-2 gap-8 mt-16">
          {/* Traditional styled cards */}
        </div>
      </section>
    </div>
  );
}

export function HomeWithSeparateVariants() {
  const variant = usePageVariant('home');
  
  if (variant === 'variant2') return <HomeVariant2 />;
  if (variant === 'variant3') return <HomeVariant3 />;
  return <HomeVariant1 />;
}

// EXAMPLE 2: Configuration-based Variants (Best for similar layouts)
// ===================================================================

export function HomeWithConfigVariants() {
  const variant = usePageVariant('home');
  
  const configs = {
    variant1: {
      containerBg: "bg-gradient-to-br from-red-50 via-orange-50 to-amber-50",
      titleSize: "text-6xl",
      titleWeight: "font-black",
      titleColor: "bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent",
      cardShadow: "shadow-2xl hover:shadow-3xl",
      cardBorder: "border-0",
      spacing: "space-y-12",
      buttonStyle: "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
    },
    variant2: {
      containerBg: "bg-white",
      titleSize: "text-5xl",
      titleWeight: "font-light",
      titleColor: "text-gray-900",
      cardShadow: "shadow-md hover:shadow-lg",
      cardBorder: "border border-gray-200",
      spacing: "space-y-6",
      buttonStyle: "bg-gray-900 hover:bg-gray-800"
    },
    variant3: {
      containerBg: "bg-amber-50",
      titleSize: "text-7xl",
      titleWeight: "font-serif",
      titleColor: "text-amber-900",
      cardShadow: "shadow-xl",
      cardBorder: "border-2 border-amber-200",
      spacing: "space-y-16",
      buttonStyle: "bg-amber-700 hover:bg-amber-800"
    }
  };
  
  const config = configs[variant];
  
  return (
    <div className={cn("min-h-screen", config.containerBg)}>
      <section className={cn("py-20", config.spacing)}>
        <h1 className={cn(config.titleSize, config.titleWeight, config.titleColor)}>
          Welcome to Our Restaurant
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className={cn(config.cardShadow, config.cardBorder)}>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">We use only the freshest local ingredients</p>
              <Button className={cn("mt-4", config.buttonStyle)}>
                Learn More
              </Button>
            </CardContent>
          </Card>
          {/* More cards... */}
        </div>
      </section>
    </div>
  );
}

// EXAMPLE 3: Inline Conditional Styling (Best for minor differences)
// ===================================================================

export function HomeWithInlineVariants() {
  const variant = usePageVariant('home');
  
  return (
    <div className={cn(
      "min-h-screen",
      variant === 'variant1' && "bg-gradient-to-br from-red-50 via-orange-50 to-amber-50",
      variant === 'variant2' && "bg-white",
      variant === 'variant3' && "bg-amber-50"
    )}>
      <section className={cn(
        "py-20",
        variant === 'variant1' && "space-y-12",
        variant === 'variant2' && "space-y-6",
        variant === 'variant3' && "space-y-16"
      )}>
        <h1 className={cn(
          variant === 'variant1' && "text-6xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent",
          variant === 'variant2' && "text-5xl font-light text-gray-900",
          variant === 'variant3' && "text-7xl font-serif text-amber-900"
        )}>
          Welcome to Our Restaurant
        </h1>
        
        <div className={cn(
          "grid gap-6 mt-12",
          variant === 'variant1' && "grid-cols-3",
          variant === 'variant2' && "grid-cols-1",
          variant === 'variant3' && "grid-cols-2"
        )}>
          <Card className={cn(
            variant === 'variant1' && "shadow-2xl hover:shadow-3xl border-0",
            variant === 'variant2' && "shadow-md hover:shadow-lg border border-gray-200",
            variant === 'variant3' && "shadow-xl border-2 border-amber-200"
          )}>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">We use only the freshest local ingredients</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

// EXAMPLE 4: Component-level Variants (For reusable components like Header/Footer)
// ===============================================================================

export function HeaderWithVariants() {
  const variant = usePageVariant('header');
  
  const headerStyles = {
    variant1: {
      position: "sticky top-0 z-50",
      background: "bg-white/80 backdrop-blur-lg border-b border-gray-200",
      height: "h-20",
      padding: "px-8"
    },
    variant2: {
      position: "relative",
      background: "bg-gray-900 border-b-2 border-red-600",
      height: "h-16",
      padding: "px-6"
    },
    variant3: {
      position: "sticky top-0 z-50",
      background: "bg-gradient-to-r from-amber-700 to-red-700",
      height: "h-24",
      padding: "px-10"
    }
  };
  
  const style = headerStyles[variant];
  
  return (
    <header className={cn(style.position, style.background, style.height, style.padding, "flex items-center justify-between")}>
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <span className={cn(
          "font-bold",
          variant === 'variant1' && "text-gray-900",
          variant === 'variant2' && "text-white",
          variant === 'variant3' && "text-white text-xl"
        )}>
          Restaurant Name
        </span>
      </div>
      <nav className="flex gap-6">
        {/* Navigation items */}
      </nav>
    </header>
  );
}

// EXAMPLE 5: Modal/Dialog Variants (For Cart, Checkout)
// =====================================================

export function CartModalWithVariants() {
  const variant = usePageVariant('cart');
  
  // Variant 1: Side Panel
  if (variant === 'variant1') {
    return (
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {/* Cart items */}
        </div>
      </div>
    );
  }
  
  // Variant 2: Centered Modal
  if (variant === 'variant2') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h2>
          {/* Cart items */}
        </div>
      </div>
    );
  }
  
  // Variant 3: Full Page
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Your Order</h1>
        {/* Cart items */}
      </div>
    </div>
  );
}

// USAGE IN ACTUAL PAGES
// =====================

// In your actual page file (e.g., home.tsx):
/*
import { usePageVariant } from "@/hooks/use-page-variant";

export default function Home() {
  const variant = usePageVariant('home');
  
  // Use any of the methods above based on your needs
  // Method 1: Separate components
  // Method 2: Configuration object
  // Method 3: Inline conditionals
  
  return (
    // Your implementation
  );
}
*/
