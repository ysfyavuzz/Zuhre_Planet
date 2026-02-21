import React, { useRef, useState, Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Html, Float, OrbitControls, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocation } from 'wouter';
import { PLANETS, PlanetData } from '@/data/planets';

// --- RESPONSIVE HELPER ---
const useResponsive = () => {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const isTablet = size.width >= 768 && size.width < 1024;

  return {
    isMobile,
    isTablet,
    planetSize: isMobile ? 3 : isTablet ? 3.5 : 4.5,
    carouselRadius: isMobile ? 35 : isTablet ? 45 : 55,
    cameraPos: isMobile ? [0, 15, 90] : [0, 20, 110] as [number, number, number],
    htmlScale: isMobile ? 0.7 : 1
  };
};

// --- COSMIC VORTEX (GİRDAP) COMPONENT ---
const CosmicVortex = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 100 + 20;
      const angle = Math.random() * Math.PI * 2;
      const spiral = radius * 0.2;

      pos[i * 3] = Math.cos(angle + spiral) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = Math.sin(angle + spiral) * radius;

      color.setHSL(0.7 + Math.random() * 0.1, 0.8, 0.5);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.5} vertexColors transparent opacity={0.4} blending={THREE.AdditiveBlending} />
    </points>
  );
};

// --- DYNAMIC COMET COMPONENT ---
const Comet = () => {
  const ref = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  const [pos] = useState(new THREE.Vector3());
  const [target] = useState(new THREE.Vector3());

  const resetComet = () => {
    const startX = (Math.random() - 0.5) * 600;
    const startY = (Math.random() - 0.5) * 600;
    const startZ = -300;
    pos.set(startX, startY, startZ);
    target.set(startX + (Math.random() - 0.5) * 400, startY - 400, 400);
    setActive(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!active && Math.random() > 0.85) resetComet();
    }, 2000);
    return () => clearInterval(interval);
  }, [active]);

  useFrame((state, delta) => {
    if (active && ref.current) {
      ref.current.position.lerp(target, delta * 0.4);
      if (ref.current.position.distanceTo(target) < 5) setActive(false);
    }
  });

  if (!active) return null;

  return (
    <Trail width={2} length={15} color={new THREE.Color("#ffffff")} attenuation={(t) => t * t}>
      <mesh ref={ref} position={pos}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </Trail>
  );
};

// --- REALISTIC PLANET COMPONENT ---
const Planet = ({
  data,
  isActive,
  onClick,
  position
}: {
  data: PlanetData;
  isActive: boolean;
  onClick: () => void;
  position: [number, number, number];
}) => {
  const { planetSize, htmlScale } = useResponsive();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isActive ? 0.4 : 0.1);
      const scale = isActive ? 1.5 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={position}>
      <Float speed={isActive ? 3 : 1} rotationIntensity={isActive ? 1.5 : 0.2} floatIntensity={isActive ? 1.5 : 0.5}>
        <group ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[planetSize, 64, 64]} />
            <meshStandardMaterial
              color={data.theme.color}
              emissive={data.theme.emissive}
              emissiveIntensity={isActive ? 4 : 0.6}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          <mesh scale={1.1}>
            <sphereGeometry args={[planetSize, 32, 32]} />
            <meshBasicMaterial
              color={data.theme.glow}
              transparent
              opacity={isActive ? 0.3 : 0.05}
              side={THREE.BackSide}
            />
          </mesh>

          {isActive && (
            <Sparkles count={60} scale={planetSize * 3} size={4} speed={1} color={data.theme.glow} />
          )}

          {data.theme.rings && (
            <group rotation={[Math.PI / 2.5, 0, 0]}>
              <mesh>
                <ringGeometry args={[planetSize * 1.4, planetSize * 2.4, 128]} />
                <meshStandardMaterial color={data.theme.ringColor} transparent opacity={0.5} side={THREE.DoubleSide} />
              </mesh>
            </group>
          )}
        </group>
      </Float>

      <Html position={[0, planetSize + 7, 0]} center distanceFactor={15}>
        <div
          style={{ transform: `scale(${htmlScale})` }}
          className={`transition-all duration-700 flex flex-col items-center pointer-events-none ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="font-black text-white text-4xl md:text-6xl tracking-tighter drop-shadow-[0_20px_40px_rgba(0,0,0,1)] whitespace-nowrap bg-black/40 backdrop-blur-3xl px-12 md:px-16 py-5 md:py-8 rounded-[4rem] border border-white/20 uppercase italic">
            {data.name}
          </div>
        </div>
      </Html>
    </group>
  );
};

// --- CAROUSEL LOGIC ---
const Carousel = () => {
  const { carouselRadius } = useResponsive();
  const [activeIndex, setActiveIndex] = useState(0);
  const [location, navigate] = useLocation();
  const groupRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);
  const planetCount = PLANETS.length;
  const anglePerPlanet = (Math.PI * 2) / planetCount;

  useEffect(() => {
    const index = PLANETS.findIndex(p => p.path === location);
    if (index !== -1) setActiveIndex(index);
  }, [location]);

  const handlePlanetClick = (index: number) => {
    let diff = index - activeIndex;
    if (Math.abs(diff) > planetCount / 2) {
      diff = diff > 0 ? diff - planetCount : diff + planetCount;
    }
    rotationRef.current -= diff * anglePerPlanet;
    setActiveIndex(index);
    setTimeout(() => navigate(PLANETS[index].path), 500);
  };

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        rotationRef.current,
        delta * 3
      );
    }
  });

  return (
    <group ref={groupRef}>
      {PLANETS.map((planet, index) => {
        const angle = index * anglePerPlanet;
        const x = Math.sin(angle) * carouselRadius;
        const z = Math.cos(angle) * carouselRadius;
        return (
          <Planet
            key={planet.id}
            data={planet}
            position={[x, 0, z]}
            isActive={index === activeIndex}
            onClick={() => handlePlanetClick(index)}
          />
        );
      })}
    </group>
  );
};

// --- FROSTED CARD COMPONENT ---
const FloatingCard = ({ 
  children, 
  position, 
  rotation = [0, 0, 0],
  delay = 0 
}: { 
  children: React.ReactNode; 
  position: [number, number, number]; 
  rotation?: [number, number, number];
  delay?: number;
}) => {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Html
        position={position}
        rotation={rotation}
        transform
        occlude="blending"
        distanceFactor={20}
        style={{ transition: 'all 0.5s ease-out', transitionDelay: `${delay}s` }}
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-w-[300px] text-center select-none pointer-events-none hover:bg-white/10 transition-colors duration-500">
          {children}
        </div>
      </Html>
    </Float>
  );
};

// --- SCENE SETUP ---
const Scene = () => {
  const { cameraPos } = useResponsive();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...cameraPos);
    camera.lookAt(0, 0, 0);
  }, [cameraPos, camera]);

  return (
    <>
      <OrbitControls enablePan={false} enableZoom={true} minDistance={50} maxDistance={180} makeDefault />
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <pointLight position={[100, 100, 100]} intensity={15} color="#ffffff" />
        <pointLight position={[-100, -100, -100]} intensity={5} color="#4f46e5" />

        <CosmicVortex />
        <Comet />
        <Carousel />

        {/* Floating Content Cards in 3D Space - Deep Universe Position */}
        <FloatingCard position={[0, 25, -100]} delay={0.2}>
          <div className="text-violet-400 text-[10px] font-black tracking-[0.5em] mb-6 uppercase italic opacity-70">Kozmik Deneyim Aktif</div>
          <h2 className="text-white text-8xl font-black tracking-tighter italic uppercase mb-2 drop-shadow-2xl">ZÜHRE</h2>
          <div className="h-1 w-32 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-transparent mx-auto mb-4 opacity-50" />
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-600 text-8xl font-black italic uppercase drop-shadow-2xl">PLANET</h2>
        </FloatingCard>

        <FloatingCard position={[-50, -10, -40]} rotation={[0, 0.4, 0]} delay={0.4}>
          <p className="text-white/40 text-xl font-bold tracking-[0.3em] uppercase italic">
            Sınırların Ötesinde<br />Bir Yolculuk
          </p>
        </FloatingCard>

        <FloatingCard position={[60, 15, -20]} rotation={[0, -0.3, 0]} delay={0.6}>
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center animate-bounce bg-white/5">
              <span className="text-white/50 text-2xl">↓</span>
            </div>
            <p className="text-white/30 text-xs font-black tracking-[0.6em] uppercase italic">Keşfet</p>
          </div>
        </FloatingCard>

        <Stars radius={400} depth={150} count={25000} factor={10} fade speed={2} />
        <Stars radius={200} depth={80} count={5000} factor={15} fade speed={1} />
      </Suspense>
    </>
  );
};

export const SpaceBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none select-none" style={{ pointerEvents: 'none' }}>
      <Canvas
        shadows
        dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        frameloop="demand"
        className="pointer-events-none"
        style={{ pointerEvents: 'none' }}
      >
        <Scene />
      </Canvas>

      {/* Deep Space Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 80%, #000000 100%)' }} />

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none w-full px-8 text-center">
        <div className="text-[12px] uppercase font-black tracking-[1em] animate-pulse italic text-white/20">
          DERİN UZAY YÖRÜNGESİ AKTİF
        </div>
      </div>
    </div>
  );
};
