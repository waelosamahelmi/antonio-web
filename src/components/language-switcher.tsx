import { useState, useRef, useEffect, useCallback } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
];

// Simple language state management (can be replaced with i18n library)
const getCurrentLanguage = () => {
  if (typeof window === 'undefined') return 'fi';
  return localStorage.getItem('language') || document.documentElement.lang || 'fi';
};

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'compact';
  className?: string;
  showLabel?: boolean;
  onLanguageChange?: (code: string) => void;
}

export default function LanguageSwitcher({
  variant = 'dropdown',
  className = '',
  showLabel = true,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle language change
  const changeLanguage = useCallback((code: string) => {
    setCurrentLang(code);
    localStorage.setItem('language', code);
    setIsOpen(false);
    
    // Update HTML lang attribute
    document.documentElement.lang = code;
    
    // Callback for parent component
    onLanguageChange?.(code);
  }, [onLanguageChange]);

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Change language"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-xl">{currentLanguage.flag}</span>
          {showLabel && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentLanguage.nativeName}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
            role="menu"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  language.code === currentLanguage.code
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                role="menuitem"
              >
                <span className="text-xl">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{language.nativeName}</span>
                  <span className="text-xs text-gray-500">{language.name}</span>
                </div>
                {language.code === currentLanguage.code && (
                  <svg
                    className="w-4 h-4 ml-auto text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Buttons variant (horizontal list)
  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-1 ${className}`} role="group" aria-label="Language selection">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              language.code === currentLanguage.code
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-pressed={language.code === currentLanguage.code}
          >
            <span>{language.flag}</span>
            {showLabel && <span>{language.code.toUpperCase()}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Compact variant (just flags)
  return (
    <div className={`flex items-center gap-0.5 ${className}`} role="group" aria-label="Language selection">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => changeLanguage(language.code)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-lg transition-all ${
            language.code === currentLanguage.code
              ? 'ring-2 ring-primary ring-offset-2'
              : 'opacity-60 hover:opacity-100'
          }`}
          aria-label={`Switch to ${language.name}`}
          aria-pressed={language.code === currentLanguage.code}
        >
          {language.flag}
        </button>
      ))}
    </div>
  );
}

// Standalone hook for language preference
export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage);

  const setLanguage = useCallback((code: string) => {
    setCurrentLanguage(code);
    localStorage.setItem('language', code);
    document.documentElement.lang = code;
  }, []);

  return {
    currentLanguage,
    setLanguage,
    languages,
  };
}
