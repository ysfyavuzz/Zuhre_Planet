import React, { useState } from 'react';
import { PLANETS, PlanetData } from '../data/planets';
import { motion, AnimatePresence } from 'framer-motion';

export const CharacterGallery: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(PLANETS[0]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-8 bg-black text-white">
      <h1 className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        KOZMİK KARAKTER GALERİSİ
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl">
        {/* Sol Taraf: Karakter Listesi */}
        <div className="flex flex-col space-y-4 overflow-y-auto max-h-[600px] pr-4 scrollbar-hide">
          {PLANETS.map((planet) => (
            <motion.button
              key={planet.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlanet(planet)}
              className={`p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                selectedPlanet.id === planet.id
                  ? 'bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                  {planet.name}
                </span>
                <span className="text-xl font-semibold tracking-wide">
                  {planet.character?.name}
                </span>
              </div>
              <div 
                className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]"
                style={{ color: planet.theme.glow }}
              />
            </motion.button>
          ))}
        </div>

        {/* Sağ Taraf: Karakter Detay ve Pozlar */}
        <div className="relative bg-white/5 rounded-3xl border border-white/10 p-8 overflow-hidden min-h-[600px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPlanet.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col h-full"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 tracking-tight">
                  {selectedPlanet.character?.name}
                </h2>
                <p className="text-gray-400 italic">
                  {selectedPlanet.character?.race} — {selectedPlanet.name} Gezegeni
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-xs text-gray-500 block mb-1 uppercase tracking-tighter">Ten / Irk</span>
                  <span className="text-sm font-medium">{selectedPlanet.character?.skinColor}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-xs text-gray-500 block mb-1 uppercase tracking-tighter">Saç / Göz</span>
                  <span className="text-sm font-medium">{selectedPlanet.character?.hairColor} / {selectedPlanet.character?.eyeColor}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-2">
                  <span className="text-xs text-gray-500 block mb-1 uppercase tracking-tighter">Kıyafet Tarzı</span>
                  <span className="text-sm font-medium">{selectedPlanet.character?.clothingStyle}</span>
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-widest">
                  AKTİF POZ VE ETKİLEŞİM
                </h3>
                <div className="bg-gradient-to-br from-white/10 to-transparent p-6 rounded-2xl border border-white/10 relative group">
                  <p className="text-lg font-medium leading-relaxed italic">
                    "{selectedPlanet.character?.pose}"
                  </p>
                  <div 
                    className="absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-20 transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: selectedPlanet.theme.glow }}
                  />
                </div>
              </div>

              {/* 3D Görsel Placeholder (Gelecekteki Renderlar İçin) */}
              <div className="absolute top-0 right-0 w-full h-full -z-10 opacity-10 pointer-events-none">
                <div 
                  className="w-full h-full"
                  style={{ 
                    background: `radial-gradient(circle at center, ${selectedPlanet.theme.glow}44 0%, transparent 70%)` 
                  }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
