import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterData } from '../data/planets';

interface CosmicObjectProps {
  type: 'planet' | 'character' | 'object';
  color?: string;
  size?: number;
  detail?: number;
  materialType?: 'crystal' | 'gas' | 'lava' | 'ice' | 'metallic' | 'plasma' | 'bio';
  rotationSpeed?: number;
  characterData?: CharacterData;
}

export const CosmicObjectGenerator: React.FC<CosmicObjectProps> = ({ 
  type, 
  color = '#4a90e2', 
  size = 1, 
  detail = 32,
  materialType = 'plasma',
  rotationSpeed = 0.005,
  characterData
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    if (groupRef.current && type === 'character') {
      // Karakterler için hafif bir süzülme animasyonu
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  const getMaterial = (customColor?: string) => {
    const activeColor = customColor || color;
    switch (materialType) {
      case 'crystal':
        return <meshPhysicalMaterial 
          color={activeColor} 
          transmission={0.9} 
          thickness={0.5} 
          roughness={0.1} 
          metalness={0.2} 
          emissive={activeColor}
          emissiveIntensity={0.5}
        />;
      case 'gas':
        return <meshStandardMaterial 
          color={activeColor} 
          transparent 
          opacity={0.7} 
          roughness={1} 
          metalness={0}
          emissive={activeColor}
          emissiveIntensity={0.3}
        />;
      case 'lava':
        return <meshStandardMaterial 
          color={activeColor} 
          emissive="#ff4400" 
          emissiveIntensity={2} 
          roughness={0.8} 
          metalness={0.2} 
        />;
      case 'ice':
        return <meshPhysicalMaterial 
          color="#ffffff" 
          emissive={activeColor}
          emissiveIntensity={0.2}
          transmission={0.5} 
          roughness={0.05} 
          metalness={0.1} 
        />;
      case 'metallic':
        return <meshStandardMaterial 
          color={activeColor} 
          metalness={1} 
          roughness={0.1} 
          emissive={activeColor}
          emissiveIntensity={0.1}
        />;
      case 'plasma':
        return <meshStandardMaterial 
          color={activeColor} 
          emissive={activeColor} 
          emissiveIntensity={1.5} 
          roughness={0.5} 
          metalness={0.5} 
        />;
      case 'bio':
        return <meshStandardMaterial 
          color={activeColor} 
          emissive="#00ff00" 
          emissiveIntensity={0.4} 
          roughness={0.9} 
          metalness={0} 
        />;
      default:
        return <meshStandardMaterial color={activeColor} />;
    }
  };

  if (type === 'character' && characterData) {
    return (
      <group ref={groupRef}>
        {/* Karakter Gövdesi (Temsili) */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[size * 0.4, size * 1.2, 4, 16]} />
          {getMaterial(characterData.skinColor.includes('Gold') ? '#ffd700' : color)}
        </mesh>
        {/* Karakter Saçı (Temsili) */}
        <mesh position={[0, size * 0.8, 0]}>
          <sphereGeometry args={[size * 0.35, 16, 16]} />
          <meshStandardMaterial color={characterData.hairColor.toLowerCase()} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, detail, detail]} />
      {getMaterial()}
    </mesh>
  );
};
