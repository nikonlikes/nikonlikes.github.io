// World Cup Kits Data
export const KITS = [
  {
    id: 'arg-home-2022',
    team: 'Argentina',
    year: 2022,
    variant: 'Home',
    price: 99.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'assets/img/kits/arg-home-2022.jpg',
    description: 'Official Argentina home kit from the 2022 World Cup, featuring the iconic blue and white stripes.'
  },
  {
    id: 'bra-away-2022',
    team: 'Brazil',
    year: 2022,
    variant: 'Away',
    price: 94.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'assets/img/kits/bra-away-2022.jpg',
    description: 'Brazil\'s away kit from the 2022 World Cup, showcasing the traditional yellow with blue trim.'
  },
  {
    id: 'fra-home-2022',
    team: 'France',
    year: 2022,
    variant: 'Home',
    price: 89.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'assets/img/kits/fra-home-2022.jpg',
    description: 'France\'s home kit from the 2022 World Cup, featuring the classic navy blue design.'
  },
  {
    id: 'eng-home-2022',
    team: 'England',
    year: 2022,
    variant: 'Home',
    price: 89.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'assets/img/kits/eng-home-2022.jpg',
    description: 'England\'s home kit from the 2022 World Cup, with the iconic white and navy trim.'
  },
  {
    id: 'ger-home-2022',
    team: 'Germany',
    year: 2022,
    variant: 'Home',
    price: 89.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'assets/img/kits/ger-home-2022.jpg',
    description: 'Germany\'s home kit from the 2022 World Cup, featuring the traditional white with black trim.'
  },
  {
    id: 'esp-home-2022',
    team: 'Spain',
    year: 2022,
    variant: 'Home',
    price: 89.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'assets/img/kits/esp-home-2022.jpg',
    description: 'Spain\'s home kit from the 2022 World Cup, with the classic red and yellow design.'
  },
  {
    id: 'arg-home-2018',
    team: 'Argentina',
    year: 2018,
    variant: 'Home',
    price: 79.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'assets/img/kits/arg-home-2018.jpg',
    description: 'Argentina\'s home kit from the 2018 World Cup, featuring the traditional blue and white stripes.'
  },
  {
    id: 'fra-home-2018',
    team: 'France',
    year: 2018,
    variant: 'Home',
    price: 79.99,
    sizes: ['S', 'M', 'L', 'XL'],
    img: 'assets/img/kits/fra-home-2018.jpg',
    description: 'France\'s home kit from the 2018 World Cup, featuring the championship-winning design.'
  }
];

// Helper function to get unique teams
export const getTeams = () => {
  return [...new Set(KITS.map(kit => kit.team))].sort();
};

// Helper function to get unique years
export const getYears = () => {
  return [...new Set(KITS.map(kit => kit.year))].sort((a, b) => b - a);
}; 