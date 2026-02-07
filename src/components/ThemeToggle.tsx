/**
 * ThemeToggle Component
 * 
 * Tema değiştirme bileşeni - Açık/Koyu/Sistem modları arasında geçiş sağlar.
 * Glass-morphism ve gold glow efektleri ile premium görünüm.
 * 
 * @module components/ThemeToggle
 * @category Components - UI Controls
 * 
 * Features:
 * - Açık tema (Light Mode)
 * - Koyu tema (Dark Mode)  
 * - Sistem teması (Tarayıcı tercihine göre)
 * - LocalStorage ile kalıcı tema tercihi
 * - Dropdown menü ile tema seçimi
 * - Glass-card ve glow efektleri
 * 
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';

/** Tema seçenekleri için tip tanımı */
type ThemeOption = {
  /** Tema değeri: light, dark veya system */
  value: 'light' | 'dark' | 'system';
  /** Kullanıcıya gösterilen etiket */
  label: string;
  /** Tema ikonu */
  icon: React.ElementType;
};

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    { value: 'light' as const, label: 'Açık', icon: Sun },
    { value: 'dark' as const, label: 'Koyu', icon: Moon },
    { value: 'system' as const, label: 'Sistem', icon: Monitor },
  ];

  const CurrentIcon = actualTheme === 'dark' ? Moon : Sun;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg glass-card hover:shadow-3d-gold transition-all duration-300"
        aria-label="Tema değiştir"
      >
        <CurrentIcon className="w-5 h-5 text-primary" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 glass-frost rounded-lg shadow-3d-gold overflow-hidden z-50">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                ${theme === value 
                  ? 'bg-primary/20 text-primary font-medium' 
                  : 'text-foreground hover:bg-secondary/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeToggle;
