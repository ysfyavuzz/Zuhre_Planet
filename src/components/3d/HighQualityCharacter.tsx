import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterProps {
  color: string;
  emissive: string;
  glow: string;
  type: 'ember' | 'gaia' | 'krystal' | 'lumi' | 'lyra' | 'midasia' | 'nova';
}

export const HighQualityCharacter: React.FC<CharacterProps> = ({ color, emissive, glow, type }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
    }
  });

  // Karakter spesifik geometriler ve materyaller
  const renderDetails = () => {
    switch (type) {
      case 'ember':
        return (
          <>
            <Sparkles count={40} scale={2} size={6} speed={0.4} color="#ff4500" />
            <mesh position={[0, 0, 0]}>
              <capsuleGeometry args={[0.4, 1.2, 8, 32]} />
              <MeshDistortMaterial 
                color={color} 
                emissive={emissive} 
                emissiveIntensity={2} 
                distort={0.3} 
                speed={2} 
                roughness={0.2}
              />
            </mesh>
          </>
        );
      case 'krystal':
        return (
          <mesh position={[0, 0, 0]}>
            <octahedronGeometry args={[0.8, 0]} />
            <MeshWobbleMaterial 
              color={color} 
              emissive={emissive} 
              emissiveIntensity={1.5} 
              factor={0.4} 
              speed={1} 
              roughness={0} 
              metalness={1}
            />
          </mesh>
        );
      default:
        return (
          <mesh position={[0, 0, 0]}>
            <capsuleGeometry args={[0.4, 1.2, 8, 32]} />
            <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={1} />
          </mesh>
        );
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {renderDetails()}
        <pointLight position={[0, 1, 2]} intensity={2} color={glow} />
      </group>
    </Float>
  );
};
