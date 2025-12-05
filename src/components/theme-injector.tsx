import { useEffect } from 'react';
import { useRestaurant } from '@/lib/restaurant-context';

/**
 * Enhanced Theme Injector Component
 * Injects theme colors as CSS custom properties from the admin panel
 * Supports both light and dark modes with smooth transitions
 * Auto-generates complementary colors for consistent theming
 * Place this at the root of your app alongside FontLoader
 */

// Helper function to convert hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Helper function to convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function ThemeInjector() {
  const { config } = useRestaurant();
  
  useEffect(() => {
    const theme = config.theme;
    if (!theme) return;
    
    const root = document.documentElement;
    
    // Base theme colors
    const primaryColor = theme.primary || '#dc2626';
    const secondaryColor = theme.secondary || '#f97316';
    const accentColor = theme.accent || '#fef3c7';
    const successColor = theme.success || '#22c55e';
    const warningColor = theme.warning || '#f59e0b';
    const errorColor = theme.error || '#ef4444';
    
    // Get HSL values for color manipulation
    const primaryHsl = hexToHsl(primaryColor);
    const secondaryHsl = hexToHsl(secondaryColor);
    
    // Set base color variables
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-secondary', secondaryColor);
    root.style.setProperty('--color-accent', accentColor);
    root.style.setProperty('--color-success', successColor);
    root.style.setProperty('--color-warning', warningColor);
    root.style.setProperty('--color-error', errorColor);
    
    // Generate auto light mode colors based on primary
    const autoLightColors = {
      background: '#ffffff',
      foreground: '#0f172a',
      card: '#ffffff',
      cardForeground: '#0f172a',
      popover: '#ffffff',
      popoverForeground: '#0f172a',
      primary: primaryColor,
      primaryForeground: '#ffffff',
      secondary: hslToHex(secondaryHsl.h, 15, 95),
      secondaryForeground: hslToHex(secondaryHsl.h, secondaryHsl.s, 25),
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      accent: hslToHex(primaryHsl.h, 30, 96),
      accentForeground: hslToHex(primaryHsl.h, primaryHsl.s, 30),
      destructive: errorColor,
      destructiveForeground: '#ffffff',
      border: '#e2e8f0',
      input: '#e2e8f0',
      ring: primaryColor,
    };
    
    // Generate auto dark mode colors based on primary
    const autoDarkColors = {
      background: '#020617',
      foreground: '#f8fafc',
      card: '#0f172a',
      cardForeground: '#f8fafc',
      popover: '#0f172a',
      popoverForeground: '#f8fafc',
      primary: hslToHex(primaryHsl.h, primaryHsl.s, Math.min(primaryHsl.l + 15, 65)),
      primaryForeground: '#ffffff',
      secondary: hslToHex(secondaryHsl.h, Math.max(secondaryHsl.s - 30, 20), 18),
      secondaryForeground: hslToHex(secondaryHsl.h, secondaryHsl.s, 85),
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      accent: hslToHex(primaryHsl.h, Math.max(primaryHsl.s - 40, 20), 18),
      accentForeground: hslToHex(primaryHsl.h, primaryHsl.s, 85),
      destructive: hslToHex(0, 72, 50),
      destructiveForeground: '#ffffff',
      border: '#1e293b',
      input: '#1e293b',
      ring: hslToHex(primaryHsl.h, primaryHsl.s, Math.min(primaryHsl.l + 15, 65)),
    };
    
    // Use theme.light if provided, otherwise use auto-generated
    const lightColors = theme.light ? {
      background: theme.light.background || autoLightColors.background,
      foreground: theme.light.foreground || autoLightColors.foreground,
      card: theme.light.card || autoLightColors.card,
      cardForeground: theme.light.cardForeground || autoLightColors.cardForeground,
      popover: theme.light.popover || autoLightColors.popover,
      popoverForeground: theme.light.popoverForeground || autoLightColors.popoverForeground,
      primary: theme.light.primary || autoLightColors.primary,
      primaryForeground: theme.light.primaryForeground || autoLightColors.primaryForeground,
      secondary: theme.light.secondary || autoLightColors.secondary,
      secondaryForeground: theme.light.secondaryForeground || autoLightColors.secondaryForeground,
      muted: theme.light.muted || autoLightColors.muted,
      mutedForeground: theme.light.mutedForeground || autoLightColors.mutedForeground,
      accent: theme.light.accent || autoLightColors.accent,
      accentForeground: theme.light.accentForeground || autoLightColors.accentForeground,
      destructive: theme.light.destructive || autoLightColors.destructive,
      destructiveForeground: theme.light.destructiveForeground || autoLightColors.destructiveForeground,
      border: theme.light.border || autoLightColors.border,
      input: theme.light.input || autoLightColors.input,
      ring: theme.light.ring || autoLightColors.ring,
    } : autoLightColors;
    
    // Use theme.dark if provided, otherwise use auto-generated
    const darkColors = theme.dark ? {
      background: theme.dark.background || autoDarkColors.background,
      foreground: theme.dark.foreground || autoDarkColors.foreground,
      card: theme.dark.card || autoDarkColors.card,
      cardForeground: theme.dark.cardForeground || autoDarkColors.cardForeground,
      popover: theme.dark.popover || autoDarkColors.popover,
      popoverForeground: theme.dark.popoverForeground || autoDarkColors.popoverForeground,
      primary: theme.dark.primary || autoDarkColors.primary,
      primaryForeground: theme.dark.primaryForeground || autoDarkColors.primaryForeground,
      secondary: theme.dark.secondary || autoDarkColors.secondary,
      secondaryForeground: theme.dark.secondaryForeground || autoDarkColors.secondaryForeground,
      muted: theme.dark.muted || autoDarkColors.muted,
      mutedForeground: theme.dark.mutedForeground || autoDarkColors.mutedForeground,
      accent: theme.dark.accent || autoDarkColors.accent,
      accentForeground: theme.dark.accentForeground || autoDarkColors.accentForeground,
      destructive: theme.dark.destructive || autoDarkColors.destructive,
      destructiveForeground: theme.dark.destructiveForeground || autoDarkColors.destructiveForeground,
      border: theme.dark.border || autoDarkColors.border,
      input: theme.dark.input || autoDarkColors.input,
      ring: theme.dark.ring || autoDarkColors.ring,
    } : autoDarkColors;
    
    // Apply light mode colors as root
    Object.entries(lightColors).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssKey}`, value);
    });
    
    // Enhanced gradient variables
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`);
    root.style.setProperty('--gradient-primary-reverse', `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 100%)`);
    root.style.setProperty('--gradient-radial', `radial-gradient(circle at center, ${primaryColor} 0%, ${secondaryColor} 100%)`);
    root.style.setProperty('--gradient-hero', `linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)`);
    root.style.setProperty('--gradient-mesh', `linear-gradient(135deg, ${primaryColor}15 0%, transparent 50%), linear-gradient(225deg, ${secondaryColor}15 0%, transparent 50%)`);
    root.style.setProperty('--gradient-glow', `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${primaryColor}20, transparent 40%)`);
    root.style.setProperty('--gradient-subtle', `linear-gradient(135deg, ${primaryColor}08 0%, ${secondaryColor}08 100%)`);
    
    // Surface elevation levels
    root.style.setProperty('--surface-1', 'rgba(0, 0, 0, 0.02)');
    root.style.setProperty('--surface-2', 'rgba(0, 0, 0, 0.04)');
    root.style.setProperty('--surface-3', 'rgba(0, 0, 0, 0.06)');
    
    // Create CSS for dark mode with all dark colors
    const darkModeStyles = `
      .dark {
        --background: ${darkColors.background};
        --foreground: ${darkColors.foreground};
        --card: ${darkColors.card};
        --card-foreground: ${darkColors.cardForeground};
        --popover: ${darkColors.popover};
        --popover-foreground: ${darkColors.popoverForeground};
        --primary: ${darkColors.primary};
        --primary-foreground: ${darkColors.primaryForeground};
        --secondary: ${darkColors.secondary};
        --secondary-foreground: ${darkColors.secondaryForeground};
        --muted: ${darkColors.muted};
        --muted-foreground: ${darkColors.mutedForeground};
        --accent: ${darkColors.accent};
        --accent-foreground: ${darkColors.accentForeground};
        --destructive: ${darkColors.destructive};
        --destructive-foreground: ${darkColors.destructiveForeground};
        --border: ${darkColors.border};
        --input: ${darkColors.input};
        --ring: ${darkColors.ring};
        --surface-1: rgba(255, 255, 255, 0.02);
        --surface-2: rgba(255, 255, 255, 0.04);
        --surface-3: rgba(255, 255, 255, 0.06);
      }
    `;
    
    // Enhanced custom design system styles
    const customStyles = `
      /* Base transitions */
      *, *::before, *::after {
        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }
      
      /* Glass morphism effects */
      .glass {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      
      .dark .glass {
        background: rgba(23, 23, 23, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .glass-strong {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
      }
      
      .dark .glass-strong {
        background: rgba(23, 23, 23, 0.9);
      }
      
      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: var(--muted);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: var(--gradient-primary);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        opacity: 0.8;
      }
      
      /* Text gradients */
      .gradient-text {
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .gradient-text-reverse {
        background: var(--gradient-primary-reverse);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .gradient-text-animated {
        background: linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor});
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 3s ease infinite;
      }
      
      @keyframes gradient-shift {
        0%, 100% { background-position: 0% center; }
        50% { background-position: 100% center; }
      }
      
      /* Gradient backgrounds */
      .bg-gradient-primary {
        background: var(--gradient-primary);
      }
      
      .bg-gradient-mesh {
        background: var(--gradient-mesh);
      }
      
      .bg-gradient-radial {
        background: var(--gradient-radial);
      }
      
      /* Hover effects */
      .hover-lift {
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
      }
      
      .hover-lift:hover {
        transform: translateY(-8px);
        box-shadow: 
          0 20px 40px -10px rgba(0, 0, 0, 0.15),
          0 8px 16px -8px rgba(0, 0, 0, 0.1);
      }
      
      .dark .hover-lift:hover {
        box-shadow: 
          0 20px 40px -10px rgba(0, 0, 0, 0.5),
          0 8px 16px -8px rgba(0, 0, 0, 0.3);
      }
      
      .hover-glow:hover {
        box-shadow: 0 0 40px ${primaryColor}40;
      }
      
      .hover-scale {
        transition: transform 0.3s ease;
      }
      
      .hover-scale:hover {
        transform: scale(1.05);
      }
      
      /* Animated underline */
      .animated-underline {
        position: relative;
      }
      
      .animated-underline::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 3px;
        background: var(--gradient-primary);
        border-radius: 2px;
        transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .animated-underline:hover::after {
        width: 100%;
      }
      
      /* Animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-40px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(40px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      @keyframes pulse-ring {
        0% {
          transform: scale(0.8);
          opacity: 1;
        }
        100% {
          transform: scale(2.5);
          opacity: 0;
        }
      }
      
      @keyframes blob {
        0%, 100% {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        50% {
          border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
        }
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .animate-fade-in-down {
        animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .animate-fade-in-left {
        animation: fadeInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .animate-fade-in-right {
        animation: fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .animate-scale-in {
        animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-blob {
        animation: blob 8s ease-in-out infinite;
      }
      
      .animate-pulse-ring::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: var(--gradient-primary);
        animation: pulse-ring 2s ease-out infinite;
        z-index: -1;
      }
      
      /* Stagger children animation */
      .stagger-children > * {
        opacity: 0;
        animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
      .stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
      .stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
      .stagger-children > *:nth-child(4) { animation-delay: 0.4s; }
      .stagger-children > *:nth-child(5) { animation-delay: 0.5s; }
      .stagger-children > *:nth-child(6) { animation-delay: 0.6s; }
      .stagger-children > *:nth-child(7) { animation-delay: 0.7s; }
      .stagger-children > *:nth-child(8) { animation-delay: 0.8s; }
      
      /* Shine effect for buttons */
      .shine-effect {
        position: relative;
        overflow: hidden;
      }
      
      .shine-effect::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        transition: left 0.6s ease;
      }
      
      .shine-effect:hover::before {
        left: 100%;
      }
      
      /* Glow effects */
      .glow {
        box-shadow: 0 0 30px ${primaryColor}30;
      }
      
      .glow-strong {
        box-shadow: 0 0 60px ${primaryColor}50;
      }
      
      .glow-hover:hover {
        box-shadow: 0 0 40px ${primaryColor}60;
      }
      
      /* Gradient border */
      .gradient-border {
        position: relative;
        background: var(--card);
        border-radius: inherit;
      }
      
      .gradient-border::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 2px;
        background: var(--gradient-primary);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }
      
      /* Pattern backgrounds */
      .pattern-dots {
        background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0);
        background-size: 24px 24px;
      }
      
      .pattern-grid {
        background-image: 
          linear-gradient(currentColor 1px, transparent 1px),
          linear-gradient(to right, currentColor 1px, transparent 1px);
        background-size: 40px 40px;
      }
      
      /* Blur decorations */
      .blur-decoration {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.3;
        pointer-events: none;
      }
      
      .blur-decoration-primary {
        background: ${primaryColor};
      }
      
      .blur-decoration-secondary {
        background: ${secondaryColor};
      }
      
      /* Card variants */
      .card-gradient {
        background: linear-gradient(135deg, var(--card) 0%, var(--muted) 100%);
      }
      
      .card-elevated {
        box-shadow: 
          0 1px 2px rgba(0,0,0,0.05),
          0 4px 6px rgba(0,0,0,0.05),
          0 12px 24px rgba(0,0,0,0.05);
      }
      
      .dark .card-elevated {
        box-shadow: 
          0 1px 2px rgba(0,0,0,0.2),
          0 4px 6px rgba(0,0,0,0.2),
          0 12px 24px rgba(0,0,0,0.2);
      }
      
      /* Text shadow for hero text */
      .text-shadow {
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      
      .text-shadow-strong {
        text-shadow: 0 4px 20px rgba(0,0,0,0.5);
      }
      
      /* Marquee animation */
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      
      .animate-marquee {
        animation: marquee 30s linear infinite;
      }
      
      /* Selection colors */
      ::selection {
        background: ${primaryColor};
        color: white;
      }
      
      /* Focus visible */
      :focus-visible {
        outline: 2px solid var(--ring);
        outline-offset: 2px;
      }
      
      /* Glass effect for light backgrounds */
      .glass-effect {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .dark .glass-effect {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      /* Section backgrounds */
      .section-primary {
        background: linear-gradient(135deg, ${primaryColor}08 0%, ${secondaryColor}08 100%);
      }
      
      .dark .section-primary {
        background: linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 100%);
      }
      
      .section-muted {
        background: var(--muted);
      }
      
      .section-alt {
        background: var(--surface-1);
      }
      
      .dark .section-alt {
        background: var(--surface-2);
      }
      
      /* Button styles */
      .btn-primary {
        background: var(--gradient-primary);
        color: white;
        border: none;
        transition: all 0.3s ease;
      }
      
      .btn-primary:hover {
        opacity: 0.9;
        transform: translateY(-2px);
        box-shadow: 0 10px 30px ${primaryColor}40;
      }
      
      .btn-secondary {
        background: transparent;
        border: 2px solid var(--primary);
        color: var(--primary);
        transition: all 0.3s ease;
      }
      
      .btn-secondary:hover {
        background: var(--primary);
        color: white;
      }
      
      .btn-ghost {
        background: transparent;
        border: none;
        color: var(--foreground);
        transition: all 0.2s ease;
      }
      
      .btn-ghost:hover {
        background: var(--muted);
      }
      
      /* Badge styles */
      .badge-primary {
        background: var(--primary);
        color: var(--primary-foreground);
      }
      
      .badge-secondary {
        background: var(--secondary);
        color: var(--secondary-foreground);
      }
      
      .badge-outline {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--foreground);
      }
      
      .badge-gradient {
        background: var(--gradient-primary);
        color: white;
      }
      
      /* Input styles */
      input, textarea, select {
        background: var(--card);
        border: 1px solid var(--border);
        color: var(--foreground);
        transition: all 0.2s ease;
      }
      
      input:focus, textarea:focus, select:focus {
        border-color: var(--ring);
        box-shadow: 0 0 0 3px ${primaryColor}20;
      }
      
      /* Loading skeleton */
      @keyframes shimmer {
        0% { background-position: -200px 0; }
        100% { background-position: 200px 0; }
      }
      
      .skeleton {
        background: linear-gradient(90deg, var(--muted) 25%, var(--surface-2) 50%, var(--muted) 75%);
        background-size: 400px 100%;
        animation: shimmer 1.5s ease-in-out infinite;
      }
      
      /* Spin animation */
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      
      /* Ping animation */
      @keyframes ping {
        75%, 100% {
          transform: scale(2);
          opacity: 0;
        }
      }
      
      .animate-ping {
        animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      
      /* Bounce animation */
      @keyframes bounce {
        0%, 100% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: translateY(0);
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
      
      .animate-bounce {
        animation: bounce 1s infinite;
      }
      
      /* Responsive utilities */
      @media (max-width: 640px) {
        .hide-mobile { display: none !important; }
      }
      
      @media (min-width: 641px) {
        .hide-desktop { display: none !important; }
      }
    `;
    
    // Inject or update stylesheet
    let styleElement = document.getElementById('theme-custom-styles') as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'theme-custom-styles';
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = darkModeStyles + customStyles;
    
    return () => {
      // Keep styles on unmount
    };
  }, [config.theme]);
  
  return null;
}
