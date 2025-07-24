// Team code mapping
const TEAM_CODES = {
  'Argentina': 'ar',
  'Brazil': 'br',
  'France': 'fr',
  'England': 'gb-eng',
  'Germany': 'de',
  'Spain': 'es',
  'Netherlands': 'nl',
  'Portugal': 'pt',
  'Belgium': 'be',
  'Croatia': 'hr'
};

// Helper function to get kit image with format support and fallback
const getKitImage = (kitId, format = 'svg') => {
  // Supported formats in order of preference: webp, jpg, svg
  const supportedFormats = ['webp', 'jpg', 'svg'];
  
  if (format === 'auto') {
    // Auto-detect best format based on browser support
    if (supportsWebP()) {
      return `assets/img/kits/${kitId}.webp`;
    } else {
      return `assets/img/kits/${kitId}.jpg`;
    }
  }
  
  return `assets/img/kits/${kitId}.${format}`;
};

// Check WebP support
const supportsWebP = () => {
  try {
    return document.createElement('canvas').toDataURL('image/webp').indexOf('webp') > -1;
  } catch (e) {
    return false;
  }
};

// Enhanced image loading with multiple format support
export const getEnhancedKitImage = (kitId) => {
  return {
    webp: getKitImage(kitId, 'webp'),
    jpg: getKitImage(kitId, 'jpg'), 
    svg: getKitImage(kitId, 'svg'),
    auto: getKitImage(kitId, 'auto'),
    fallback: 'assets/img/kits/placeholder.svg'
  };
};

// Hard-coded World Cup kit data
export const KITS = [
  {
    id: 'arg-home-2022',
    team: 'Argentina',
    teamCode: 'ar',
    year: 2022,
    variant: 'Home',
    price: 99.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('arg-home-2022'),
    images: getEnhancedKitImage('arg-home-2022'),
    description: 'The iconic sky blue and white stripes that brought home the 2022 World Cup trophy.'
  },
  {
    id: 'arg-away-2022',
    team: 'Argentina',
    teamCode: 'ar',
    year: 2022,
    variant: 'Away',
    price: 94.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('arg-away-2022'),
    images: getEnhancedKitImage('arg-away-2022'),
    description: 'The elegant purple away kit worn during Argentina\'s victorious 2022 World Cup campaign.'
  },
  {
    id: 'bra-home-2022',
    team: 'Brazil',
    teamCode: 'br',
    year: 2022,
    variant: 'Home',
    price: 94.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('bra-home-2022'),
    images: getEnhancedKitImage('bra-home-2022'),
    description: 'The legendary yellow Seleção jersey, a symbol of Brazilian football excellence.'
  },
  {
    id: 'bra-away-2022',
    team: 'Brazil',
    teamCode: 'br',
    year: 2022,
    variant: 'Away',
    price: 94.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('bra-away-2022'),
    images: getEnhancedKitImage('bra-away-2022'),
    description: 'Brazil\'s stunning blue away kit from the 2022 World Cup in Qatar.'
  },
  {
    id: 'fra-home-2022',
    team: 'France',
    teamCode: 'fr',
    year: 2022,
    variant: 'Home',
    price: 99.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('fra-home-2022'),
    images: getEnhancedKitImage('fra-home-2022'),
    description: 'Les Bleus home jersey from their journey to the 2022 World Cup final.'
  },
  {
    id: 'eng-home-2022',
    team: 'England',
    teamCode: 'gb-eng',
    year: 2022,
    variant: 'Home',
    price: 89.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('eng-home-2022'),
    images: getEnhancedKitImage('eng-home-2022'),
    description: 'The classic white home jersey worn by the Three Lions in Qatar 2022.'
  },
  {
    id: 'ger-home-2018',
    team: 'Germany',
    teamCode: 'de',
    year: 2018,
    variant: 'Home',
    price: 79.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('ger-home-2018'),
    images: getEnhancedKitImage('ger-home-2018'),
    description: 'Die Mannschaft\'s traditional white kit from the 2018 World Cup in Russia.'
  },
  {
    id: 'esp-home-2022',
    team: 'Spain',
    teamCode: 'es',
    year: 2022,
    variant: 'Home',
    price: 94.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('esp-home-2022'),
    images: getEnhancedKitImage('esp-home-2022'),
    description: 'La Roja\'s iconic red home jersey from the 2022 World Cup campaign.'
  },
  {
    id: 'ned-home-2022',
    team: 'Netherlands',
    teamCode: 'nl',
    year: 2022,
    variant: 'Home',
    price: 92.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('ned-home-2022'),
    images: getEnhancedKitImage('ned-home-2022'),
    description: 'The vibrant orange Oranje jersey worn during their impressive 2022 World Cup run.'
  },
  {
    id: 'por-home-2022',
    team: 'Portugal',
    teamCode: 'pt',
    year: 2022,
    variant: 'Home',
    price: 97.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('por-home-2022'),
    images: getEnhancedKitImage('por-home-2022'),
    description: 'Portugal\'s burgundy home kit from Cristiano Ronaldo\'s final World Cup.'
  },
  {
    id: 'bel-home-2018',
    team: 'Belgium',
    teamCode: 'be',
    year: 2018,
    variant: 'Home',
    price: 84.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('bel-home-2018'),
    images: getEnhancedKitImage('bel-home-2018'),
    description: 'The Red Devils\' home jersey from their impressive third-place finish in Russia 2018.'
  },
  {
    id: 'cro-home-2018',
    team: 'Croatia',
    teamCode: 'hr',
    year: 2018,
    variant: 'Home',
    price: 89.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: getKitImage('cro-home-2018'),
    images: getEnhancedKitImage('cro-home-2018'),
    description: 'The distinctive checkered pattern that took Croatia to the 2018 World Cup final.'
  }
];

// Get unique teams for filter dropdown
export const getUniqueTeams = () => {
  return [...new Set(KITS.map(kit => kit.team))].sort();
};

// Get unique years for filter
export const getUniqueYears = () => {
  return [...new Set(KITS.map(kit => kit.year))].sort((a, b) => b - a);
};

// Find kit by ID
export const findKitById = (id) => {
  return KITS.find(kit => kit.id === id);
};

// Filter kits by team and year
export const filterKits = (team = 'all', year = 'all') => {
  return KITS.filter(kit => {
    const teamMatch = team === 'all' || kit.team === team;
    const yearMatch = year === 'all' || kit.year.toString() === year;
    return teamMatch && yearMatch;
  });
};