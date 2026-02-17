import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { HighQualityCharacter } from './HighQualityCharacter';
import { PLANETS } from '../../data/planets';

interface Universal3DViewerProps {
  planetId: number;
  showCharacter?: boolean;
}

export const Universal3DViewer: React.FC<Universal3DViewerProps> = ({ planetId, showCharacter = true }) => {
  const planet = PLANETS.find(p => p.id === planetId) || PLANETS[0];

  return (
    <div className="w-full h-[600px] bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden relative group">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <Suspense fallback={null}>
          <Stage intensity={0.5} environment="city" adjustCamera={false} shadows="contact">
            {showCharacter ? (
              <HighQualityCharacter 
                color={planet.theme.color} 
                emissive={planet.theme.emissive} 
                glow={planet.theme.glow}
                type={planet.character?.name.toLowerCase() as any}
              />
            ) : (
              <mesh castShadow receiveShadow>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshStandardMaterial 
                  color={planet.theme.color}
                  emissive={planet.theme.emissive}
                  emissiveIntensity={2}
                  roughness={0.1}
                  metalness={0.8}
                />
              </mesh>
            )}
          </Stage>
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={3} 
          maxDistance={10}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Overlay Info */}
      <div className="absolute bottom-6 left-6 pointer-events-none">
        <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">
          {showCharacter ? planet.character?.name : planet.name}
        </h3>
        <p className="text-xs text-white/40 uppercase tracking-[0.3em]">
          360° ETKİLEŞİMLİ GÖRÜNÜM AKTİF
        </p>
      </div>
    </div>
  );
};
