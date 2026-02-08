import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const nebulaImg = '/nebula-overlay.png';

interface Star {
  id: number | string;
  left: string;
  top: string;
  size?: number;
  duration?: string;
  delay?: string;
  opacity?: number;
  isPrimary?: boolean;
  color?: string;
  glow?: string;
  scale?: number;
  angle?: number;
}

interface Nebula {
  id: string;
  left: string;
  top: string;
  scale: number;
  opacity: number;
  duration: string;
}

interface Explosion {
  id: string;
  left: string;
  top: string;
  scale: number;
  color: string;
}

export const SpaceBackground: React.FC = () => {
  const { actualTheme } = useTheme();

  // Initialize stars using lazy state initialization to render once/stable
  const [stars] = useState<Star[]>(() => {
    const starCount = 300; // Background stars
    const backgroundStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() < 0.1 ? 3 : Math.random() < 0.4 ? 2 : 1, 
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 2}s`,
      opacity: Math.random() * 0.7 + 0.3,
      isPrimary: Math.random() > 0.8,
      color: Math.random() > 0.7 ? 'bg-yellow-200' : 'bg-white', 
      glow: Math.random() > 0.9 ? 'shadow-[0_0_8px_rgba(255,255,200,0.8)]' : '' 
    }));

    // "Half Peach" Constellation (Center Screen)
    const peachStars: Star[] = [];
    const centerX = 50; // %
    const centerY = 50; // %
    const radius = 15; // % of screen width approx
    const peachStarCount = 120; // Density for the shape

    for (let i = 0; i < peachStarCount; i++) {
        const angle = Math.random() * Math.PI; // 0 to PI (Upper half)
        const r = Math.sqrt(Math.random()) * radius; // Uniform distribution in circle
        
        // Adjust x,y to center
        const x = centerX + (r * Math.cos(angle)) * 0.6; // Scale X slightly (narrower)
        const y = centerY - (r * Math.sin(angle)) * 0.6; // Upwards
        
        peachStars.push({
            id: `peach-${i}`,
            left: `${x}%`,
            top: `${y}%`,
            size: Math.random() * 1.5 + 1.5, // Slightly larger pixels
            duration: `${Math.random() * 2 + 1}s`,
            delay: `${Math.random()}s`,
            opacity: Math.random() * 0.8 + 0.2,
            isPrimary: true,
            color: 'bg-orange-300', // Peach color
            glow: 'shadow-[0_0_6px_rgba(255,160,122,0.8)]' // Peach glow
        });
    }

    return [...backgroundStars, ...peachStars];
  });

  const [shootingStars, setShootingStars] = useState<Star[]>([]);
  const [nebulas, setNebulas] = useState<Nebula[]>([]); // cosmic images
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  
  // Generate 'ZUHRE' constellation points (Right side, Diagonal) - Lazy Initialized
  const [zuhreStars] = useState<Star[]>(() => {
    const points: {x: number, y: number}[] = [];
    const startX = 65; // Right side
    const startY = 10; // Top
    const charW = 4;   // Width of char
    const charH = 5;   // Height of char
    const gap = 3;     // Spacing between chars
    
    // Helper to add point with jitter
    const addPoint = (x: number, y: number) => {
        const jitterX = (Math.random() - 0.5) * 0.5;
        const jitterY = (Math.random() - 0.5) * 0.5;
        points.push({ x: x + jitterX, y: y + jitterY });
    };
    
    // Line drawer helper
    const line = (x1: number, y1: number, x2: number, y2: number, density = 3) => {
        for (let i = 0; i <= density; i++) {
            const t = i / density;
            addPoint(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
        }
    };

    let currentBaseX = startX;
    let currentBaseY = startY;

    const drawChar = (char: string, baseX: number, baseY: number) => {
        // Z
        if (char === 'Z') {
            line(baseX, baseY, baseX + charW, baseY, 3);
            line(baseX + charW, baseY, baseX, baseY + charH, 4);
            line(baseX, baseY + charH, baseX + charW, baseY + charH, 3);
        }
        // U
        if (char === 'U') {
            line(baseX, baseY, baseX, baseY + charH, 4);
            line(baseX, baseY + charH, baseX + charW, baseY + charH, 3);
            line(baseX + charW, baseY + charH, baseX + charW, baseY, 4);
        }
        // H
        if (char === 'H') {
            line(baseX, baseY, baseX, baseY + charH, 4);
            line(baseX + charW, baseY, baseX + charW, baseY + charH, 4);
            line(baseX, baseY + charH/2, baseX + charW, baseY + charH/2, 2);
        }
        // R
        if (char === 'R') {
            line(baseX, baseY, baseX, baseY + charH, 4);
            line(baseX, baseY, baseX + charW, baseY, 3);
            line(baseX + charW, baseY, baseX + charW, baseY + charH/2, 2);
            line(baseX + charW, baseY + charH/2, baseX, baseY + charH/2, 3);
            line(baseX + 1, baseY + charH/2, baseX + charW, baseY + charH, 3);
        }
        // E
        if (char === 'E') {
            line(baseX, baseY, baseX, baseY + charH, 4);
            line(baseX, baseY, baseX + charW, baseY, 3);
            line(baseX, baseY + charH/2, baseX + charW - 1, baseY + charH/2, 2);
            line(baseX, baseY + charH, baseX + charW, baseY + charH, 3);
        }
    };

    ['Z', 'U', 'H', 'R', 'E'].forEach((char) => {
        drawChar(char, currentBaseX, currentBaseY);
        currentBaseX += charW + gap;
        currentBaseY += 2; // Slight diagonal step down
    });

    return points.map((p, i) => ({
        id: `zuhre-${i}`,
        left: `${p.x}%`,
        top: `${p.y}%`,
        delay: `${Math.random() * 0.5}s`
    }));
  });

  const [showZuhre, setShowZuhre] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // Cycle: Show every 40s for 5s
    const cycle = () => {
        // Wait 40s then show
        timer = setTimeout(() => {
            setShowZuhre(true);
            setTimeout(() => {
                setShowZuhre(false);
                cycle(); // Recursive loop
            }, 5000);
        }, 40000);
    };
    
    // Start first cycle
    cycle();
    return () => clearTimeout(timer);
  }, []);

  // Handle shooting stars with varied frequency and style
  useEffect(() => {
    const spawnShootingStar = () => {
        const id = Date.now();
        const angle = Math.random() * 360; // Random angle
        
        setShootingStars(prev => [...prev, {
            id,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 1.2, // Larger/Longer
            angle: angle,
            color: Math.random() > 0.5 ? 'via-yellow-200' : 'via-white', // 50% Yellow, 50% White
            duration: Math.random() * 1 + 2 + 's' // 2-3s duration
        }]);
        setTimeout(() => setShootingStars(prev => prev.filter(s => s.id !== id)), 4000);
        
        // Schedule next star between 60s and 80s
        const nextTime = Math.random() * 20000 + 60000; 
        setTimeout(spawnShootingStar, nextTime);
    };

    // Occasional Cosmic Nebula Images (Floating in background)
    const nebulaInterval = setInterval(() => {
        const id = Date.now() + 'nebula';
        setNebulas(prev => [...prev, {
            id,
            left: `${Math.random() * 60 + 20}%`, // Central area
            top: `${Math.random() * 60 + 20}%`,
            scale: Math.random() * 0.5 + 0.8, 
            opacity: Math.random() * 0.3 + 0.2, // Subtle opacity
            duration: Math.random() * 10 + 20 + 's', // Long duration
        }]);
        setTimeout(() => setNebulas(prev => prev.filter(n => n.id !== id)), 25000);
    }, 15000); // Every 15 seconds

    // Distant Galaxy Explosions (Supernovas)
    const explosionInterval = setInterval(() => {
        const id = Date.now() + 'boom';
        setExplosions(prev => [...prev, {
            id,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 80}%`,
            scale: Math.random() * 0.5 + 0.5,
            color: Math.random() > 0.5 ? 'cyan' : 'purple', 
        }]);
        setTimeout(() => setExplosions(prev => prev.filter(e => e.id !== id)), 2000); 
    }, 4000);

    // Initial start for Shooting Stars
    const timer = setTimeout(spawnShootingStar, 5000);

    return () => {
        clearTimeout(timer);
        clearInterval(nebulaInterval);
        clearInterval(explosionInterval);
    };
  }, []);

  // Mapping actualTheme to the celestial logic
  // Light -> Celestial (Ice/Sunset), Dark -> Cosmic (Deep Space)
  const isCelestial = actualTheme === 'light';
  
  // Sunset/Sunrise Gradient vs Deep Space Night
  const gradientClass = isCelestial 
    ? 'from-indigo-950 via-purple-900 to-orange-500' // Deep Sunset (Dark sky to bright horizon)
    : 'from-black via-slate-950 to-slate-900'; // Deep Space (Dark Mode)

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] ${gradientClass} transition-colors duration-1000`}>
      
      {/* Base overlay for texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay z-10"></div>

      {/* --- NEBULAS --- */}
      <div className={`absolute top-[40%] right-[0%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 animate-pulse-slow mix-blend-screen transition-colors duration-1000 
        ${isCelestial ? 'bg-pink-600' : 'bg-indigo-900'}
      `}></div>

      {/* Stars (Yellow & White) */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full animate-twinkle ${star.color} ${star.glow}`}
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        ></div>
      ))}

      {/* Shooting Stars (Rare, Long, Colored) */}
      {shootingStars.map((star) => (
        <div
            key={star.id}
            className="absolute origin-left"
            style={{
                left: star.left,
                top: star.top,
                transform: `rotate(${star.angle}deg)`,
                zIndex: 10
            }}
        >
            <div 
                className={`h-[2px] w-[300px] bg-gradient-to-r from-transparent ${star.color} to-transparent opacity-0 animate-shooting-star`}
                style={{
                    transformOrigin: 'left center',
                    animationDuration: star.duration
                }}
            ></div>
        </div>
      ))}

      {/* Distant Galaxy Explosions */}
      {explosions.map((exp) => (
        <div
          key={exp.id}
          className="absolute animate-explode opacity-0"
          style={{
            left: exp.left,
            top: exp.top,
            transform: `scale(${exp.scale})`
          }}
        >
            {/* Core Flash */}
            <div className={`w-2 h-2 rounded-full blur-[1px] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></div>
            {/* Expanding Ring */}
            <div className={`w-8 h-8 rounded-full border-2 ${exp.color === 'cyan' ? 'border-cyan-400' : 'border-purple-400'} blur-[2px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></div>
            {/* Cross Flare */}
             <div className={`w-12 h-[1px] ${exp.color === 'cyan' ? 'bg-cyan-200' : 'bg-purple-200'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></div>
             <div className={`w-[1px] h-12 ${exp.color === 'cyan' ? 'bg-cyan-200' : 'bg-purple-200'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></div>
        </div>
      ))}

      {/* 'ZUHRE' Constellation Text */}
      {showZuhre && zuhreStars.map((star) => (
        <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white] animate-zuhre"
            style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay
            }}
        ></div>
      ))}

      {/* Cosmic Nebula Images (Floating) */}
      {nebulas.map((nebula) => (
        <div
          key={nebula.id}
          className="absolute animate-nebula-float pointer-events-none mix-blend-screen"
          style={{
            left: nebula.left,
            top: nebula.top,
            width: '400px',
            opacity: nebula.opacity,
            transform: `translate(-50%, -50%) scale(${nebula.scale})`,
            animationDuration: nebula.duration
          }}
        >
             <img src={nebulaImg} alt="Cosmic Nebula" className="w-full h-auto opacity-80 blur-[20px]" />
        </div>
      ))}

      {/* Subtle Grid Overlay for Tech Feel */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
    </div>
  );
};
