import { useEffect, useRef, useCallback } from 'react';

/**
 * Accessibility utilities and hooks for ARIA labels, keyboard navigation,
 * focus management, and screen reader support.
 */

// ============================================
// ARIA Label Helpers
// ============================================

/**
 * Generate ARIA attributes for a button
 */
export function getButtonAriaProps(options: {
  label: string;
  expanded?: boolean;
  controls?: string;
  pressed?: boolean;
  disabled?: boolean;
  describedBy?: string;
}) {
  return {
    'aria-label': options.label,
    ...(options.expanded !== undefined && { 'aria-expanded': options.expanded }),
    ...(options.controls && { 'aria-controls': options.controls }),
    ...(options.pressed !== undefined && { 'aria-pressed': options.pressed }),
    ...(options.disabled && { 'aria-disabled': 'true' }),
    ...(options.describedBy && { 'aria-describedby': options.describedBy }),
  };
}

/**
 * Generate ARIA attributes for an input field
 */
export function getInputAriaProps(options: {
  label: string;
  required?: boolean;
  invalid?: boolean;
  errorId?: string;
  describedBy?: string;
  autocomplete?: string;
}) {
  return {
    'aria-label': options.label,
    ...(options.required && { 'aria-required': 'true' }),
    ...(options.invalid && { 'aria-invalid': 'true' }),
    ...(options.errorId && options.invalid && { 'aria-errormessage': options.errorId }),
    ...(options.describedBy && { 'aria-describedby': options.describedBy }),
    ...(options.autocomplete && { autoComplete: options.autocomplete }),
  };
}

/**
 * Generate ARIA attributes for a dialog/modal
 */
export function getDialogAriaProps(options: {
  title: string;
  titleId: string;
  descriptionId?: string;
}) {
  return {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': options.titleId,
    ...(options.descriptionId && { 'aria-describedby': options.descriptionId }),
  };
}

// ============================================
// Keyboard Navigation Hooks
// ============================================

/**
 * Hook for handling keyboard navigation in a list
 */
export function useKeyboardNavigation<T extends HTMLElement>(
  options: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onTab?: (e: KeyboardEvent) => void;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          options.onEnter?.();
          break;
        case 'Escape':
          options.onEscape?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          options.onArrowUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          options.onArrowDown?.();
          break;
        case 'ArrowLeft':
          options.onArrowLeft?.();
          break;
        case 'ArrowRight':
          options.onArrowRight?.();
          break;
        case 'Tab':
          options.onTab?.(e);
          break;
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [options]);

  return ref;
}

/**
 * Hook for roving tabindex navigation (e.g., in toolbars, radio groups)
 */
export function useRovingTabindex(
  itemCount: number,
  options: {
    orientation?: 'horizontal' | 'vertical';
    loop?: boolean;
  } = {}
) {
  const { orientation = 'vertical', loop = true } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isNext =
        (orientation === 'vertical' && e.key === 'ArrowDown') ||
        (orientation === 'horizontal' && e.key === 'ArrowRight');
      const isPrev =
        (orientation === 'vertical' && e.key === 'ArrowUp') ||
        (orientation === 'horizontal' && e.key === 'ArrowLeft');

      if (isNext || isPrev) {
        e.preventDefault();

        let nextIndex: number;
        if (isNext) {
          nextIndex = activeIndex + 1;
          if (nextIndex >= itemCount) {
            nextIndex = loop ? 0 : itemCount - 1;
          }
        } else {
          nextIndex = activeIndex - 1;
          if (nextIndex < 0) {
            nextIndex = loop ? itemCount - 1 : 0;
          }
        }

        setActiveIndex(nextIndex);
        itemRefs.current[nextIndex]?.focus();
      }

      if (e.key === 'Home') {
        e.preventDefault();
        setActiveIndex(0);
        itemRefs.current[0]?.focus();
      }

      if (e.key === 'End') {
        e.preventDefault();
        const lastIndex = itemCount - 1;
        setActiveIndex(lastIndex);
        itemRefs.current[lastIndex]?.focus();
      }
    },
    [activeIndex, itemCount, orientation, loop]
  );

  const getItemProps = (index: number) => ({
    tabIndex: index === activeIndex ? 0 : -1,
    ref: (el: HTMLElement | null) => {
      itemRefs.current[index] = el;
    },
    onKeyDown: handleKeyDown,
    onFocus: () => setActiveIndex(index),
  });

  return { activeIndex, getItemProps };
}

// ============================================
// Focus Management
// ============================================

/**
 * Hook to trap focus within a container (for modals)
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on open
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift+Tab: if on first element, go to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: if on last element, go to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
}

/**
 * Hook to restore focus when a modal closes
 */
export function useRestoreFocus(isOpen: boolean) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);
}

// ============================================
// Screen Reader Announcements
// ============================================

/**
 * Hook to announce messages to screen readers
 */
export function useAnnounce() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    
    document.body.appendChild(announcement);
    
    // Small delay to ensure screen reader picks up the change
    requestAnimationFrame(() => {
      announcement.textContent = message;
    });
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return announce;
}

// ============================================
// Skip Link Component
// ============================================

interface SkipLinkProps {
  targetId: string;
  children?: React.ReactNode;
}

export function SkipLink({ targetId, children = 'Siirry sisältöön' }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
    >
      {children}
    </a>
  );
}

// ============================================
// Visually Hidden Component
// ============================================

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export function VisuallyHidden({ children, as: Component = 'span' }: VisuallyHiddenProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}

// ============================================
// Focus Indicator Styles
// ============================================

export const focusRingStyles = `
  focus:outline-none 
  focus-visible:ring-2 
  focus-visible:ring-primary 
  focus-visible:ring-offset-2
`;

export const focusWithinStyles = `
  focus-within:ring-2 
  focus-within:ring-primary 
  focus-within:ring-offset-2
`;

// Utility to generate unique IDs
let idCounter = 0;
export function generateId(prefix = 'id'): string {
  return `${prefix}-${++idCounter}`;
}

// Import React hooks that were used above
import { useState } from 'react';
