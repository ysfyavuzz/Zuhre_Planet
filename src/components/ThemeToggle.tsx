import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { setTheme, actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative w-11 h-11 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-500 border
        ${isDark ? 'bg-[#0f1115] border-white/5' : 'bg-[#150f0f] border-orange-500/20'}`}
      style={{
        // Barda açılmış derin bir delik hissi
        boxShadow: "inset 0px 6px 12px rgba(0,0,0,0.9), inset 0px -2px 6px rgba(255,255,255,0.1), 0px 1px 2px rgba(0,0,0,0.5)"
      }}
      aria-label="Tema değiştir"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.img
            key="moon"
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src="/icons/theme-moon.png"
            alt="Gece Modu"
            className="absolute w-[130%] h-[130%] object-cover contrast-[1.15] brightness-90 pointer-events-none mix-blend-lighten"
          />
        ) : (
          <motion.img
            key="sun"
            initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src="/icons/theme-sun.png"
            alt="Gündüz Modu"
            className="absolute w-[140%] h-[140%] object-cover contrast-125 pointer-events-none mix-blend-lighten"
          />
        )}
      </AnimatePresence>

      {/* Çukurun derinliğini artırmak için bombeli üst cam katmanı */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] bg-gradient-to-b from-black/60 via-transparent to-white/5 pointer-events-none" />
    </motion.button>
  );
}

export default ThemeToggle;
