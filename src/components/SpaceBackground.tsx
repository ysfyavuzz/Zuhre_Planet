import React, { useRef, useState, Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Html, Float, OrbitControls, Trail, Sparkles, Text3D, Center, Environment, DragControls } from '@react-three/drei';
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
    carouselRadius: isMobile ? 55 : isTablet ? 70 : 85, // Gezegenlerin daha geniş bir yörüngede dönmesi sağlandı
    cameraPos: isMobile ? [0, 25, 110] : [0, 30, 140] as [number, number, number], // Kamera yazıyı tam alacak şekilde uzaklaştırıldı
    htmlScale: isMobile ? 0.7 : 1
  };
};

// --- DEEP CLOUD VORTEX (UZAYIN DERİNLİKLERİNE UZANAN BULUT TÜNELİ) ---
// Referans Görsele Uygun Olarak: Z Ekseninde (Derinlemesine) çok yoğun, Mor/Pembe/Mavi karışık devasa spiral kuyu
const DeepCloudVortex = () => {
  const vortexRef = useRef<THREE.Points>(null);
  const materialsRef = useRef<THREE.PointsMaterial>(null);

  // Bulut etkisini çok kütleli ve yoğun göstermek için devasa partikül sayısı
  const particleCount = 15000;

  // TÜNEL BULUTLARI (ARCHIMEDEAN SPIRAL VORTEX)
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const s = new Float32Array(particleCount);

    const color = new THREE.Color();
    const branches = 3; // Spiral kollarının sayısı

    for (let i = 0; i < particleCount; i++) {
      // 1. Derinlik Hesabı (-100'den -2500'e kadar) 
      // Kamera [0,30,140] gibi değerlerde. Bulutların bizi yutmaması için başlangıcı -100 gibi bir yerden başlatıyoruz.
      const zRatio = Math.pow(Math.random(), 1.2);
      const zPos = -100 - (zRatio * 2500);

      // 2. Tünel Formu (Spiral Açısı = Derinliğe Bağlı Döngü)
      // Derine indikçe spirallerin dönüşü artsın (Kuyu dibi burgusu)
      const spiralTwist = zRatio * Math.PI * 6;

      // Hangi kola ait olduğunu seç (3 koldan biri)
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      // Partikülün kol üzerindeki rastgele dağılımı (kalınlık)
      const randomScatter = Math.random() * Math.PI * 2;

      // 3. Tünel Çapı (Kum Saati / Trompet formu)
      // Kameranın içine girmemesi için orta deliği biraz daha genişletiyoruz
      const minRadius = 150;
      const maxRadius = 1000;

      // İleriye yakın kısımlar daha hızlı genişlesin
      const radiusExpansion = Math.pow(1 - zRatio, 1.5) * maxRadius;
      const baseRadius = minRadius + radiusExpansion;

      // Kola kalınlık/hacim vermek için radius etrafında yayılım
      const scatterSpread = 100 + radiusExpansion * 0.4;
      const radiusWithScatter = baseRadius + (Math.random() - 0.5) * scatterSpread;

      // Nihai Pozisyonlar (X, Y)
      const finalAngle = branchAngle + spiralTwist + (Math.random() * 0.5 - 0.25);

      pos[i * 3] = Math.cos(finalAngle) * radiusWithScatter;
      pos[i * 3 + 1] = Math.sin(finalAngle) * radiusWithScatter;
      pos[i * 3 + 2] = zPos;

      // 4. Parçacık Boyutu (Derine indikçe küçülüp yoğunlaşan, yakında ise hacimli olan)
      s[i] = 60 + Math.random() * 40 * (1 - zRatio * 0.5);

      // --- RENK DAĞILIMI (Referans formülü: Mor, Pembe, Koyu Lacivert Geçişleri) ---
      // Merkez (Delik) Çok Parlak Işıklı Pembe/Beyaz, Dış Çeperler Lacivert/Mor

      // Merkeze olan mesafeye göre degrade
      const distanceFromCenter = Math.sqrt(pos[i * 3] * pos[i * 3] + pos[i * 3 + 1] * pos[i * 3 + 1]);
      const mixRatio = Math.min((distanceFromCenter - minRadius) / (baseRadius + 100), 1.0);

      const coreLightColor = new THREE.Color("#fdf4ff"); // Işığın sızdığı bembeyaz/açık pembe merkez
      const innerCloudColor = new THREE.Color("#d946ef"); // Parlak Fuchsia / Pembe Girdap kolları
      const outerSpaceColor = new THREE.Color("#1e1b4b"); // Dış kuyu duvarları Koyu Gece Mavisi / Çivit

      // Z eksenine göre tünelin dibi (ışık kaynağı) daha sıcak/parlak
      const zMix = Math.abs(zPos) / 2500;

      // Renk Karışımını Hesapla
      if (mixRatio < 0.2) {
        // Kuyu deliğinin içi (çok parlak)
        color.lerpColors(coreLightColor, innerCloudColor, mixRatio * 5);
      } else {
        // Kuyunun bulutlu çeperleri (pem beden laciverde geçiş)
        color.lerpColors(innerCloudColor, outerSpaceColor, (mixRatio - 0.2) / 0.8);
      }

      // Diplere indikçe karanlık basmasın, ışığın kaynağı oradan geldiği için aydınlık vursun
      const depthLightBoost = zRatio * 0.5; // Dibe yaklaştıkça %50 parlaklık artışı

      // Aydınlanma (Merkezdeki deliğe yakın olan iç çeperler patlama gibi parlar)
      const holeProximity = Math.max(0, 1.0 - mixRatio);
      const brightness = (0.15 + holeProximity * 0.8) + (Math.random() * 0.3) + depthLightBoost;

      cols[i * 3] = color.r * brightness;
      cols[i * 3 + 1] = color.g * brightness;
      cols[i * 3 + 2] = color.b * brightness;
    }
    return [pos, cols, s];
  }, []);

  useFrame((state, delta) => {
    if (vortexRef.current) {
      // Bulut Tüneli izleyiciye doğru yavaşça dönerek "içine çekilme" ve "girdap" hissini veriyor
      // Spiralin dönüş yönü (Z ekseni) içeri veya dışarı akış hissiyatını belirler
      vortexRef.current.rotation.z -= delta * 0.08;

      // Vortex hafif nefes alıyormuş gibi yumuşak helezon hareketleri yapar
      vortexRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.04;
      vortexRef.current.rotation.y = Math.cos(state.clock.getElapsedTime() * 0.1) * 0.03;
    }
  });

  return (
    <group>
      {/* BULUT TÜNELİ MESH */}
      <points ref={vortexRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={particleCount} array={sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialsRef}
          vertexColors
          transparent
          opacity={0.12}         // Hacim hissini artırmak için opaklık artırıldı
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* TÜNELİN UCUNDAKİ ANA IŞIK KAYNAKLARI VE GEZEGENLER */}
      {/* Gezegenler tünelin dip ucunda (Z = -1800), tam izleyiciye dik açıyla */}

      {/* 1. GÜNEŞ/ATEŞ (Hafif sağda diplerde) - Geçici Olarak Gizlendi */}
      <group position={[180, 50, -1800]} visible={false}>
        {/* Tüm tüneli boydan boya aydınlatan devasa dik ışık */}
        <pointLight intensity={300} color="#fb923c" distance={3000} decay={1.0} />
        {/* Güneşin Kendisi */}
        <mesh>
          <sphereGeometry args={[120, 64, 64]} />
          <meshStandardMaterial color="#ea580c" emissive="#fb923c" emissiveIntensity={3} roughness={1} />
        </mesh>
        {/* Güneş Halesi */}
        <mesh>
          <sphereGeometry args={[140, 32, 32]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* 2. AY/BUZ (Hafif solda diplerde) - Geçici Olarak Gizlendi */}
      <group position={[-180, -50, -1600]} visible={false}>
        {/* Tüneli boydan boya aydınlatan mavi dik ışık */}
        <pointLight intensity={250} color="#38bdf8" distance={2500} decay={1.0} />
        {/* Buzlu Gezegen */}
        <mesh>
          <sphereGeometry args={[90, 64, 64]} />
          <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={1.5} roughness={0.6} metalness={0.8} />
        </mesh>
        {/* Ay Halesi */}
        <mesh>
          <sphereGeometry args={[110, 32, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

    </group>
  );
};

// --- DYNAMIC COMET COMPONENT (KAYAN YILDIZLAR) ---
const Comet = ({ speedMultiplier = 1 }: { speedMultiplier?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  const [pos] = useState(new THREE.Vector3());
  const [target] = useState(new THREE.Vector3());

  const resetComet = () => {
    // Ekranın daha geniş bir alanından uçuşsun
    const startX = (Math.random() - 0.5) * 800;
    const startY = (Math.random() - 0.5) * 800;

    // %50 İhtimalle ekrandan bize doğru (yakına), %50 ihtimalle bizden uzağa (derinliğe) kayar
    const isMovingForward = Math.random() > 0.5;

    // startZ: Geliş noktası, targetZ: Gidiş yönü
    const startZ = isMovingForward ? -400 : 300;
    const targetZ = isMovingForward ? 300 : -500;

    pos.set(startX, startY, startZ);
    // x ve y ekseninde de çapraz kaysın
    target.set(startX + (Math.random() - 0.5) * 600, startY + (Math.random() - 0.5) * 600, targetZ);
    setActive(true);
  };

  useEffect(() => {
    // Kayan yıldızların çok daha sık (hızlı döngülerle) çıkmasını sağlar
    const interval = setInterval(() => {
      // Çıkma ihtimalini epey artırıyoruz (Eski %15'ti, şimdi %40)
      if (!active && Math.random() > 0.60) resetComet();
    }, 500 + Math.random() * 1500); // Yarım saniye ile 2 saniye arasında zarlara bakar
    return () => clearInterval(interval);
  }, [active]);

  useFrame((state, delta) => {
    if (active && ref.current) {
      // Hızı lerp ile artırıyoruz
      ref.current.position.lerp(target, delta * 0.8 * speedMultiplier);
      if (ref.current.position.distanceTo(target) < 10) setActive(false);
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
      // Tıklama ile olan hedeflenen açıyı yumuşak bir şekilde uygula
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        rotationRef.current,
        delta * 3
      );
    }
  });

  return (
    <group
      ref={groupRef}
      // Yazıyı tam ortaya (merkeze) almak için yukarı doğru hiza kaydırıldı
      position={[0, 6, 0]}
      // Çapraz/eğik duruş azaltıldı, hafif bir disk/tabak gibi tamamen karşımızdan bakılıyor
      rotation={[0.15, 0, 0]}
    >
      {/* 
        AÇIKLAMA: Kullanıcı talebi üzerine ana gezegenler tamamen gizlendi (Kod silinmedi).
        Gelecekte tekrar ekranda görünmeleri istendiğinde aşağıdaki kod satırının yorumları kaldırılabilir.
      */}
      {/* 
      {PLANETS.map((planet, index) => {
        const angle = index * anglePerPlanet;

        // Yeniden yuvarlak/dairesel form. Derinlik hissi için arka tarafa çok hafif uzatıldı.
        const x = Math.sin(angle) * (carouselRadius * 1.0);
        const z = Math.cos(angle) * (carouselRadius * 1.15);

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
      */}
    </group>
  );
};

// --- BİREYSEL, SÜRÜKLENEBİLİR VE YÜKSEK KALİTELİ METAL HARF BİLEŞENİ ---
const InteractiveLetter = ({ char, initialPos, colorGlow, size = 12 }: { char: string, initialPos: [number, number, number], colorGlow: string, size?: number }) => {
  const fontUrl = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/gentilis_regular.typeface.json";
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Boyut (Scale) ve Tıklanma (Sürüklenme) Durumları
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  // Fare sol tık basılıyken Shift / Ctrl tuşlarıyla boyutlandırma kontrolü
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDragging) return; // Sadece harfi tutup sürüklerken tuşa asılırsa çalışsın

      if (e.key === 'Shift') {
        // Shift ile büyüt (Maksimum 3.0 kata kadar)
        setScale(prev => Math.min(prev + 0.1, 3.0));
      } else if (e.key === 'Control') {
        // Ctrl ile küçült (Minimum 0.3 kata kadar)
        setScale(prev => Math.max(prev - 0.1, 0.3));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDragging]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Hafif ayna gibi nefes alan ve açısı değişen yansımalar
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.5 + 0.3 * Math.sin(time * 2 + initialPos[0]);
    }
  });

  return (
    // DragControls ile harfi tutup istediğiniz yere sürükleyebilirsiniz
    // onClick / onPointerUp/Down benzeri fonksiyonlar DragEventlerle gelir,
    // drei'in DragControls modülünde doğrudan farenin sürükleme durumunu izliyoruz.
    <DragControls
      axisLock="z"
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {/* Harf bu scale oranına göre anında büyüyüp küçülür */}
      <Float speed={2} floatIntensity={1} rotationIntensity={0.5} floatingRange={[-0.5, 0.5]}>
        <Center position={initialPos}>
          {/* Gruba scale veriyoruz, böylece Text3D tümüyle büyüyüp küçülür */}
          <group scale={[scale, scale, scale]}>
            <Text3D
              font={fontUrl}
              size={size}           // Harfin büyüklüğü (DraggableLetters kısmından değiştirilebilir)
              height={size / 3}     // Harfin kalınlığı boyutuyla orantılı değişir
              curveSegments={64}    // Yüksek 3D kalitesi
              bevelEnabled
              bevelThickness={0.5}
              bevelSize={0.2}
              bevelSegments={32}
              castShadow
              receiveShadow
            >
              {char}
              {/* Orijinal Krom/Metal Materyali (Keskin hatlı krom ve yansıma) */}
              <meshStandardMaterial
                ref={materialRef}
                color="#ffffff"
                emissive={colorGlow}
                emissiveIntensity={0.5}
                metalness={1.0}
                roughness={0.05}     // Çok parlak ayna yüzeyi
                envMapIntensity={6}  // HDRI çevreyi güçlü şekilde yansıtacak
              />
            </Text3D>
          </group>
        </Center>
      </Float>
    </DragControls>
  );
};

// --- TÜM HARFLERİ İÇEREN GRUP ---
const DraggableLetters = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* 
        ======================================================================
        HARFLERİ BÜYÜTÜP-KÜÇÜLTMEK İÇİN BURADAKİ 'size' DEĞERİNİ DEĞİŞTİRİN
        Örnek: Çok daha büyük yapmak için size={20}, küçültmek için size={8}
        ======================================================================
      */}
      {/* 
        AÇIKLAMA: Kullanıcı talebi üzerine aşağıdaki harfler ve tozlar geçici olarak gizlendi.
      */}
      {/* 
      <InteractiveLetter char="Z" initialPos={[-30, 15, 0]} colorGlow="#8b5cf6" size={12} />
      <InteractiveLetter char="Ü" initialPos={[-15, 5, 0]} colorGlow="#3b82f6" size={12} />
      <InteractiveLetter char="H" initialPos={[0, 20, 0]} colorGlow="#ec4899" size={12} />
      <InteractiveLetter char="R" initialPos={[15, -5, 0]} colorGlow="#10b981" size={12} />
      <InteractiveLetter char="E" initialPos={[30, 10, 0]} colorGlow="#f59e0b" size={12} />

      <Sparkles count={200} scale={100} size={6} speed={0.4} opacity={0.5} color="#ffffff" position={[0, 0, 0]} />
      */}
    </group>
  );
};

// --- BACKGROUND ROTATION (Yıldızların ve Girdabın Dönüşü) ---
const RotatingSpace = () => {
  const spaceRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (spaceRef.current) {
      spaceRef.current.rotation.y += delta * 0.03; // Tüm arka plan uzayı çok yavaşça dönecek
      spaceRef.current.rotation.x += delta * 0.01;
      spaceRef.current.rotation.z += delta * 0.005;
    }
  });

  return (
    <group ref={spaceRef}>
      {/* 
        AÇIKLAMA: Kullanıcı talebi üzerine tüm uzay arka planı (Sarmal Bulut ve Yıldızlar) geçici olarak gizlendi. 
        Kod silinmedi.
      */}
      {/* 
      <DeepCloudVortex />
      <Stars radius={400} depth={150} count={25000} factor={10} fade speed={2} />
      <Stars radius={200} depth={80} count={5000} factor={15} fade speed={1} />
      */}
    </group>
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
      {/* 
        AÇIKLAMA: Kullanıcı sahnenin tamamen boş olmasını istediği için KONTROLLER ve IŞIKLAR da gizlendi. 
      */}
      {/* 
      <OrbitControls enablePan={false} enableZoom={true} minDistance={50} maxDistance={180} makeDefault />
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} color="#1e1b4b" />
        <RotatingSpace />
        <Carousel />
        <Environment preset="city" />
      </Suspense>
      */}
    </>
  );
};

export const SpaceBackground: React.FC = () => {
  /*
    AÇIKLAMA: Ana sarmalayıcı DOM elementi kullanıcının isteğiyle ("barın içi hariç her şey kalksın") 
    ve sarı arka plan renk problemlerinin giderilmesi için tamamen devre dışı bırakıldı.
    Şimdilik null dönerek, HTML domundan tamamen temizledik.
  */
  return null;

  /*
  return (
    <div className="fixed inset-0 z-10 select-none pointer-events-auto">
      <Canvas
        shadows
        dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        frameloop="always" // Etkileşim olduğu için render'ın devam etmesi gerekiyor
        className="pointer-events-auto"
      >
        <Scene />
      </Canvas>

      {/* 
        AÇIKLAMA: Derin Uzay siyah efekti katmanı (Gradient Overlay) tamamen kaldırıldı (yorum satırıyla). 
      *\/}
      {/* 
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 80%, #000000 100%)' }} />
      *\/}

      {/* 
        AÇIKLAMA: Kullanıcı talebi üzerine metin katmanı geçici olarak gizlendi. 
      *\/}
      {/* 
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none w-full px-8 text-center">
        <div className="text-[12px] uppercase font-black tracking-[1em] animate-pulse italic text-white/20">
          DERİN UZAY YÖRÜNGESİ AKTİF
        </div>
      </div>
      *\/}
    </div>
  );
  */
};
