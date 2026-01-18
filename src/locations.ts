// Location data for Turkey cities

export interface Location {
  id: string;
  name: string;
  districts: District[];
}

export interface District {
  id: string;
  name: string;
}

export const locations: Location[] = [
  {
    id: 'istanbul',
    name: 'İstanbul',
    districts: [
      { id: 'kadikoy', name: 'Kadıköy' },
      { id: 'besiktas', name: 'Beşiktaş' },
      { id: 'sariyer', name: 'Sarıyer' },
      { id: 'sisli', name: 'Şişli' },
      { id: 'bakirkoy', name: 'Bakırköy' },
      { id: 'fatih', name: 'Fatih' },
      { id: 'uskudar', name: 'Üsküdar' },
      { id: 'beyoglu', name: 'Beyoğlu' },
      { id: 'maltepe', name: 'Maltepe' },
      { id: 'kartal', name: 'Kartal' }
    ]
  },
  {
    id: 'bursa',
    name: 'Bursa',
    districts: [
      { id: 'nilufer', name: 'Nilüfer' },
      { id: 'osmangazi', name: 'Osmangazi' },
      { id: 'yildirim', name: 'Yıldırım' },
      { id: 'iznik', name: 'İznik' },
      { id: 'mudanya', name: 'Mudanya' }
    ]
  },
  {
    id: 'kocaeli',
    name: 'Kocaeli',
    districts: [
      { id: 'izmit', name: 'İzmit' },
      { id: 'gebze', name: 'Gebze' },
      { id: 'golcuk', name: 'Gölcük' },
      { id: 'derince', name: 'Derince' },
      { id: 'kandira', name: 'Kandıra' }
    ]
  },
  {
    id: 'ankara',
    name: 'Ankara',
    districts: [
      { id: 'cankaya', name: 'Çankaya' },
      { id: 'kecioren', name: 'Keçiören' },
      { id: 'yenimahalle', name: 'Yenimahalle' },
      { id: 'mamak', name: 'Mamak' },
      { id: 'etimesgut', name: 'Etimesgut' }
    ]
  },
  {
    id: 'izmir',
    name: 'İzmir',
    districts: [
      { id: 'konak', name: 'Konak' },
      { id: 'alsancak', name: 'Alsancak' },
      { id: 'bornova', name: 'Bornova' },
      { id: 'buca', name: 'Buca' },
      { id: 'karabaglar', name: 'Karabağlar' }
    ]
  },
  {
    id: 'antalya',
    name: 'Antalya',
    districts: [
      { id: 'muratpasa', name: 'Muratpaşa' },
      { id: 'kepez', name: 'Kepez' },
      { id: 'konyaalti', name: 'Konyaaltı' },
      { id: 'aksu', name: 'Aksu' },
      { id: 'serik', name: 'Serik' }
    ]
  }
];

export const getAllCities = () => locations.map(loc => loc.name);

export const getDistrictsByCity = (cityName: string) => {
  const city = locations.find(loc => loc.name === cityName);
  return city?.districts.map(d => d.name) || [];
};

export const getCityByName = (name: string) => {
  return locations.find(loc => loc.name === name);
};

// Marmara region locations for compatibility
export const marmaraLocations = {
  'İstanbul': ['Kadıköy', 'Beşiktaş', 'Sarıyer', 'Şişli', 'Bakırköy', 'Fatih', 'Üsküdar', 'Beyoğlu', 'Maltepe', 'Kartal'],
  'Bursa': ['Nilüfer', 'Osmangazi', 'Yıldırım', 'İznik', 'Mudanya'],
  'Kocaeli': ['İzmit', 'Gebze', 'Gölcük', 'Derince', 'Kandıra'],
  'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut'],
  'İzmir': ['Konak', 'Alsancak', 'Bornova', 'Buca', 'Karabağlar'],
  'Antalya': ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Aksu', 'Serik']
};
