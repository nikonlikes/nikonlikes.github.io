// Hard-coded World Cup kit data
export const KITS = [
  {
    id: 'arg-home-2022',
    team: 'Argentina',
    year: 2022,
    variant: 'Home',
    price: 99.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'The iconic sky blue and white stripes that brought home the 2022 World Cup trophy.'
  },
  {
    id: 'arg-away-2022',
    team: 'Argentina',
    year: 2022,
    variant: 'Away',
    price: 94.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'The elegant purple away kit worn during Argentina\'s victorious 2022 World Cup campaign.'
  },
  {
    id: 'bra-home-2022',
    team: 'Brazil',
    year: 2022,
    variant: 'Home',
    price: 94.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'The legendary yellow Seleção jersey, a symbol of Brazilian football excellence.'
  },
  {
    id: 'bra-away-2022',
    team: 'Brazil',
    year: 2022,
    variant: 'Away',
    price: 94.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Brazil\'s stunning blue away kit from the 2022 World Cup in Qatar.'
  },
  {
    id: 'fra-home-2022',
    team: 'France',
    year: 2022,
    variant: 'Home',
    price: 99.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Les Bleus home jersey from their journey to the 2022 World Cup final.'
  },
  {
    id: 'eng-home-2022',
    team: 'England',
    year: 2022,
    variant: 'Home',
    price: 89.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'The classic white home jersey worn by the Three Lions in Qatar 2022.'
  },
  {
    id: 'ger-home-2018',
    team: 'Germany',
    year: 2018,
    variant: 'Home',
    price: 79.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Die Mannschaft\'s traditional white kit from the 2018 World Cup in Russia.'
  },
  {
    id: 'esp-home-2022',
    team: 'Spain',
    year: 2022,
    variant: 'Home',
    price: 94.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'La Roja\'s iconic red home jersey from the 2022 World Cup campaign.'
  },
  {
    id: 'ned-home-2022',
    team: 'Netherlands',
    year: 2022,
    variant: 'Home',
    price: 92.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'The vibrant orange Oranje jersey worn during their impressive 2022 World Cup run.'
  },
  {
    id: 'por-home-2022',
    team: 'Portugal',
    year: 2022,
    variant: 'Home',
    price: 97.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Portugal\'s burgundy home kit from Cristiano Ronaldo\'s final World Cup.'
  },
  {
    id: 'bel-home-2018',
    team: 'Belgium',
    year: 2018,
    variant: 'Home',
    price: 84.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'The Red Devils\' home jersey from their impressive third-place finish in Russia 2018.'
  },
  {
    id: 'cro-home-2018',
    team: 'Croatia',
    year: 2018,
    variant: 'Home',
    price: 89.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600',
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