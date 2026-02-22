import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * StarryBackground - İç sayfalar için premium kozmik arka plan.
 * Hem açık hem de koyu temaları destekler.
 */
export const StarryBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`fixed inset-0 z-[-1] transition-colors duration-1000 overflow-hidden ${isDark ? 'bg-[#020617]' : 'bg-white'
      }`}>
      {/* Nebula / Glow Effects */}
      <div className={`absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-violet-900/10 opacity-60' : 'bg-gray-100 opacity-40'
        }`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-indigo-900/10 opacity-60' : 'bg-gray-50 opacity-40'
        }`} style={{ animationDelay: '2s' }} />

      {/* Stars Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-twinkle ${isDark ? 'bg-white' : 'bg-gray-300'
              }`}
            style={{
              width: Math.random() * 2.5 + 'px',
              height: Math.random() * 2.5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              opacity: isDark ? Math.random() * 0.8 : Math.random() * 0.4
            }}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .animate-twinkle {
          animation: twinkle 4s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};
