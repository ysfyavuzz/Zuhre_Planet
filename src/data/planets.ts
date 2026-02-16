export interface CharacterData {
  name: string;
  race: string;
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  clothingStyle: string;
  pose: string;
  isNsfw: boolean;
}

export interface PlanetTheme {
  color: string;
  emissive: string;
  glow: string;
  rings?: boolean;
  ringColor?: string;
  textureUrl?: string;
  materialType?: 'crystal' | 'gas' | 'lava' | 'ice' | 'metallic' | 'plasma' | 'bio';
  rotationSpeed?: number;
}

export interface PlanetData {
  id: number;
  name: string;
  path: string;
  description: string;
  theme: PlanetTheme;
  character?: CharacterData;
}

export const PLANETS: PlanetData[] = [
  {
    id: 0,
    name: "ZÜHRE PRIME",
    path: "/",
    description: "Kozmik Merkeze Hoş Geldiniz",
    theme: {
      color: "#4c1d95",
      emissive: "#2e1065",
      glow: "#7c3aed",
      materialType: 'plasma',
      rotationSpeed: 0.005
    },
    character: {
      name: "Nova",
      race: "Plasma Entity",
      skinColor: "Glowing Purple",
      hairStyle: "Fluid/Liquid",
      hairColor: "Silver",
      eyeColor: "Neon Purple",
      clothingStyle: "Transparent Energy Strips",
      pose: "Dancing in Core Currents",
      isNsfw: true
    }
  },
  {
    id: 1,
    name: "AETHERIA",
    path: "/escorts",
    description: "Galaksideki Tüm Yıldızlar",
    theme: {
      color: "#0f172a",
      emissive: "#1e293b",
      glow: "#3b82f6",
      rings: true,
      ringColor: "#60a5fa",
      materialType: 'gas',
      rotationSpeed: 0.008
    },
    character: {
      name: "Lyra",
      race: "Gas Cloud Nymph",
      skinColor: "Pale Blue Translucent",
      hairStyle: "Cloud-like Long",
      hairColor: "White",
      eyeColor: "Sky Blue",
      clothingStyle: "Sheer Gas Tulle",
      pose: "Lying on Rings",
      isNsfw: true
    }
  },
  {
    id: 2,
    name: "AURUM",
    path: "/vip",
    description: "En Parlak Yıldızlar",
    theme: {
      color: "#451a03",
      emissive: "#78350f",
      glow: "#f59e0b",
      materialType: 'metallic',
      rotationSpeed: 0.003
    },
    character: {
      name: "Midasia",
      race: "Metallic Goddess",
      skinColor: "Gold Metallic",
      hairStyle: "Short Pixie",
      hairColor: "Black",
      eyeColor: "Amber",
      clothingStyle: "Gold Chains & Armor Plates",
      pose: "Sitting on Surface",
      isNsfw: true
    }
  },
  {
    id: 3,
    name: "NEBULA-X",
    path: "/messages",
    description: "Kozmik İletişim",
    theme: {
      color: "#064e3b",
      emissive: "#065f46",
      glow: "#10b981",
      materialType: 'bio',
      rotationSpeed: 0.006
    },
    character: {
      name: "Gaia",
      race: "Bio-Organic Spirit",
      skinColor: "Olive Green",
      hairStyle: "Vine-like",
      hairColor: "Vibrant Green",
      eyeColor: "Forest Glow",
      clothingStyle: "Bioluminescent Leaves",
      pose: "Embracing Organic Texture",
      isNsfw: true
    }
  },
  {
    id: 4,
    name: "CRYSTALLIS",
    path: "/favorites",
    description: "Kaydedilen Takımyıldızlar",
    theme: {
      color: "#831843",
      emissive: "#9d174d",
      glow: "#ec4899",
      materialType: 'crystal',
      rotationSpeed: 0.004
    },
    character: {
      name: "Krystal",
      race: "Crystalline Being",
      skinColor: "Diamond Translucent",
      hairStyle: "Crystallized Sharp",
      hairColor: "Pink",
      eyeColor: "Diamond",
      clothingStyle: "Sharp Crystal Shards",
      pose: "Standing in Light",
      isNsfw: true
    }
  },
  {
    id: 5,
    name: "GLACIES",
    path: "/escort/dashboard",
    description: "Kişisel Yörüngeniz",
    theme: {
      color: "#1e1b4b",
      emissive: "#312e81",
      glow: "#6366f1",
      materialType: 'ice',
      rotationSpeed: 0.002
    },
    character: {
      name: "Lumi",
      race: "Ice Queen",
      skinColor: "Snow White",
      hairStyle: "Long Frozen",
      hairColor: "Ice Blue",
      eyeColor: "Silver",
      clothingStyle: "Ice Crystal Wrap",
      pose: "Sitting on Ice Throne",
      isNsfw: true
    }
  },
  {
    id: 6,
    name: "PYROS",
    path: "/register-escort",
    description: "Galaksiye Katılın",
    theme: {
      color: "#422006",
      emissive: "#713f12",
      glow: "#eab308",
      rings: true,
      ringColor: "#facc15",
      materialType: 'lava',
      rotationSpeed: 0.01
    },
    character: {
      name: "Ember",
      race: "Volcanic Siren",
      skinColor: "Dark Bronze/Ash",
      hairStyle: "Flaming Long",
      hairColor: "Fiery Red",
      eyeColor: "Burning Ember",
      clothingStyle: "Leather & Lava Strips",
      pose: "Provocative in Lava",
      isNsfw: true
    }
  }
];
