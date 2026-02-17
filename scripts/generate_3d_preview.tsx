import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { EmberCharacter } from '../src/components/EmberCharacter';
import { GaiaCharacter } from '../src/components/GaiaCharacter';
import { KrystalCharacter } from '../src/components/KrystalCharacter';
import { LumiCharacter } from '../src/components/LumiCharacter';
import { LyraCharacter } from '../src/components/LyraCharacter';
import { MidasiaCharacter } from '../src/components/MidasiaCharacter';
import { NovaCharacter } from '../src/components/NovaCharacter';

/**
 * Bu dosya, karakterlerin 3D önizlemelerini render etmek için şablon görevi görür.
 * Her karakter kendi özel bileşeni ile render edilir.
 */

export const CharacterPreview: React.FC<{ name: string }> = ({ name }) => {
  const renderCharacter = () => {
    switch (name.toLowerCase()) {
      case 'ember': return <EmberCharacter />;
      case 'gaia': return <GaiaCharacter />;
      case 'krystal': return <KrystalCharacter />;
      case 'lumi': return <LumiCharacter />;
      case 'lyra': return <LyraCharacter />;
      case 'midasia': return <MidasiaCharacter />;
      case 'nova': return <NovaCharacter />;
      default: return <NovaCharacter />;
    }
  };

  return (
    <div style={{ width: '100%', height: '500px', background: '#000' }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <Stage intensity={0.5} environment="city" shadows={false}>
          {renderCharacter()}
        </Stage>
        <OrbitControls autoRotate />
      </Canvas>
    </div>
  );
};
