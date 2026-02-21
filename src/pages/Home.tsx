import React, { JSX } from 'react';
import { Header } from '@/components/Header';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home(): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between overflow-x-hidden pointer-events-none">
      <div className="pointer-events-auto w-full z-50">
        <Header />
      </div>

      {/* 
        Sadece arka plandaki SpaceBackground'ın (App.tsx içinde renderlanan) 
        görünmesi ve etkileşimli olması için Home sayfası şeffaf ve içeriksiz bırakılmıştır.
      */}
      <div className="flex-grow w-full" />
    </div>
  );
}
