#!/usr/bin/env node

/**
 * Enhanced Jersey Creator
 * 
 * Creates high-quality SVG jersey designs based on actual team colors and patterns
 * This approach is more reliable than web scraping and provides consistent results.
 */

const fs = require('fs-extra');
const path = require('path');

const CONFIG = {
  outputDir: './assets/img/kits',
  backup: true
};

// Enhanced jersey designs with accurate team colors and details
const ENHANCED_JERSEYS = {
  'arg-home-2022': {
    team: 'Argentina',
    variant: 'Home',
    year: 2022,
    colors: {
      primary: '#75aadb',    // Sky blue
      secondary: '#ffffff',   // White
      accent: '#f6b40e'      // Gold
    },
    pattern: 'stripes',
    description: 'Classic sky blue and white stripes'
  },
  'arg-away-2022': {
    team: 'Argentina', 
    variant: 'Away',
    year: 2022,
    colors: {
      primary: '#6a4c93',    // Purple
      secondary: '#ffffff',   // White
      accent: '#f6b40e'      // Gold
    },
    pattern: 'solid',
    description: 'Bold purple away design'
  },
  'bra-home-2022': {
    team: 'Brazil',
    variant: 'Home',
    year: 2022,
    colors: {
      primary: '#ffdf00',    // Brazilian yellow
      secondary: '#009739',   // Green
      accent: '#012169'      // Blue
    },
    pattern: 'solid',
    description: 'Iconic yellow with green trim'
  },
  'bra-away-2022': {
    team: 'Brazil',
    variant: 'Away',
    year: 2022,
    colors: {
      primary: '#012169',    // Navy blue
      secondary: '#ffffff',   // White
      accent: '#ffdf00'      // Yellow
    },
    pattern: 'solid',
    description: 'Navy blue away kit'
  },
  'fra-home-2022': {
    team: 'France',
    variant: 'Home',
    year: 2022,
    colors: {
      primary: '#001e68',    // French blue
      secondary: '#ffffff',   // White
      accent: '#ed2939'      // Red
    },
    pattern: 'solid',
    description: 'Classic French blue'
  },
  'eng-home-2022': {
    team: 'England',
    variant: 'Home',
    year: 2022,
    colors: {
      primary: '#ffffff',    // White
      secondary: '#1e3a8a',   // Navy
      accent: '#dc2626'      // Red
    },
    pattern: 'solid',
    description: 'Traditional white with navy and red details'
  },
  'ger-home-2018': {
    team: 'Germany',
    variant: 'Home',
    year: 2018,
    colors: {
      primary: '#ffffff',    // White
      secondary: '#000000',   // Black
      accent: '#dd0077'      // Magenta
    },
    pattern: 'solid',
    description: 'Classic white with modern accents'
  },
  'esp-home-2022': {
    team: 'Spain',
    variant: 'Home',
    year: 2022,
    colors: {
      primary: '#c60b1e',    // Spanish red
      secondary: '#ffcc00',   // Yellow
      accent: '#ffffff'      // White
    },
    pattern: 'solid',
    description: 'Bold Spanish red'
  },
  'ned-home-2022': {
    team: 'Netherlands',
    variant: 'Home',
    year: 2022,
    colors: {
      primary: '#ff8200',    // Dutch orange
      secondary: '#ffffff',   // White
      accent: '#21468b'      // Blue
    },
    pattern: 'solid',
    description: 'Vibrant Dutch orange'
  },
  'por-home-2022': {
    team: 'Portugal',
    variant: 'Home',
    year: 2022,
    colors: {
      primary: '#ff0000',    // Portuguese red
      secondary: '#006600',   // Green
      accent: '#ffff00'      // Yellow
    },
    pattern: 'solid',
    description: 'Rich Portuguese red'
  },
  'bel-home-2018': {
    team: 'Belgium',
    variant: 'Home',
    year: 2018,
    colors: {
      primary: '#000000',    // Black
      secondary: '#ffff00',   // Yellow
      accent: '#ff0000'      // Red
    },
    pattern: 'solid',
    description: 'Belgian black with flag accents'
  },
  'cro-home-2018': {
    team: 'Croatia',
    variant: 'Home',
    year: 2018,
    colors: {
      primary: '#ff0000',    // Red
      secondary: '#ffffff',   // White
      accent: '#012169'      // Blue
    },
    pattern: 'checkered',
    description: 'Iconic red and white checkerboard'
  }
};

class EnhancedJerseyCreator {
  constructor() {
    this.createdJerseys = [];
  }

  async init() {
    console.log('🎨 Initializing Enhanced Jersey Creator...');
    await fs.ensureDir(CONFIG.outputDir);
    
    if (CONFIG.backup) {
      const backupDir = path.join(CONFIG.outputDir, 'backup');
      await fs.ensureDir(backupDir);
      
      // Backup existing SVGs
      const existingFiles = await fs.readdir(CONFIG.outputDir);
      for (const file of existingFiles) {
        if (file.endsWith('.svg')) {
          await fs.copy(
            path.join(CONFIG.outputDir, file),
            path.join(backupDir, file)
          );
        }
      }
      console.log('📦 Existing SVGs backed up');
    }
    
    console.log('✅ Ready to create enhanced jerseys');
  }

  createJerseySVG(kitId, jerseyData) {
    const { colors, pattern, team } = jerseyData;
    
    // Base jersey template
    let svg = `<svg width="400" height="480" viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="jerseyGradient_${kitId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${this.darkenColor(colors.primary)};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow_${kitId}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="480" fill="#f8fafc"/>
  
  <!-- Jersey main body -->
  <path d="M80 100 L100 80 L140 80 L140 100 L160 100 L160 140 L140 140 L140 160 L260 160 L260 140 L240 140 L240 100 L260 100 L260 80 L300 80 L320 100 L320 420 L80 420 Z" 
        fill="url(#jerseyGradient_${kitId})" 
        stroke="${colors.secondary}" 
        stroke-width="3"
        filter="url(#shadow_${kitId})"/>`;

    // Add pattern-specific elements
    if (pattern === 'stripes' && kitId.includes('arg-home')) {
      svg += this.addArgentinaStripes();
    } else if (pattern === 'checkered' && kitId.includes('cro-home')) {
      svg += this.addCroatianCheckers();
    }

    // Add jersey details
    svg += this.addJerseyDetails(kitId, jerseyData);
    
    // Close SVG
    svg += `</svg>`;
    
    return svg;
  }

  addArgentinaStripes() {
    return `
  <!-- Argentina stripes -->
  <rect x="80" y="160" width="240" height="20" fill="#ffffff" opacity="0.9"/>
  <rect x="80" y="200" width="240" height="20" fill="#ffffff" opacity="0.9"/>
  <rect x="80" y="240" width="240" height="20" fill="#ffffff" opacity="0.9"/>
  <rect x="80" y="280" width="240" height="20" fill="#ffffff" opacity="0.9"/>
  <rect x="80" y="320" width="240" height="20" fill="#ffffff" opacity="0.9"/>
  <rect x="80" y="360" width="240" height="20" fill="#ffffff" opacity="0.9"/>`;
  }

  addCroatianCheckers() {
    let checkers = '';
    const size = 16;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 15; col++) {
        const x = 80 + col * size;
        const y = 160 + row * size;
        const isRed = (row + col) % 2 === 0;
        if (isRed) {
          checkers += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#ff0000"/>`;
        }
      }
    }
    return checkers;
  }

  addJerseyDetails(kitId, jerseyData) {
    const { colors, team } = jerseyData;
    
    return `
  <!-- Team crest area -->
  <circle cx="200" cy="120" r="18" fill="${colors.secondary}" stroke="${colors.accent}" stroke-width="2"/>
  <text x="200" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="${colors.primary}" font-weight="bold">${team.slice(0,3).toUpperCase()}</text>
  
  <!-- Collar -->
  <rect x="140" y="80" width="120" height="8" fill="${colors.accent}" rx="4"/>
  
  <!-- Sleeve details -->
  <rect x="80" y="100" width="8" height="60" fill="${colors.accent}"/>
  <rect x="312" y="100" width="8" height="60" fill="${colors.accent}"/>
  
  <!-- Sponsor area (placeholder) -->
  <rect x="160" y="200" width="80" height="20" fill="${colors.secondary}" opacity="0.1" rx="4"/>
  
  <!-- Number placeholder -->
  <text x="200" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="${colors.secondary}" font-weight="bold">10</text>
  
  <!-- Size tag -->
  <rect x="320" y="400" width="60" height="15" fill="${colors.accent}" opacity="0.8"/>
  <text x="350" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="white">LARGE</text>`;
  }

  darkenColor(color) {
    // Simple color darkening
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 30);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 30);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 30);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  async createAllJerseys() {
    console.log('🏗️ Creating enhanced jersey designs...');
    
    for (const [kitId, jerseyData] of Object.entries(ENHANCED_JERSEYS)) {
      try {
        console.log(`🎨 Creating ${kitId}...`);
        
        const svgContent = this.createJerseySVG(kitId, jerseyData);
        const filePath = path.join(CONFIG.outputDir, `${kitId}.svg`);
        
        await fs.writeFile(filePath, svgContent, 'utf8');
        
        this.createdJerseys.push({
          kitId,
          filePath,
          ...jerseyData
        });
        
        console.log(`✅ Created ${kitId}.svg`);
        
      } catch (error) {
        console.error(`❌ Failed to create ${kitId}:`, error.message);
      }
    }
    
    console.log(`🎉 Created ${this.createdJerseys.length} enhanced jersey designs`);
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalJerseys: this.createdJerseys.length,
      jerseys: this.createdJerseys,
      improvements: [
        'Enhanced color accuracy based on official team colors',
        'Added realistic jersey details (collars, sleeves, crests)',
        'Improved Argentina striped pattern',
        'Added Croatia checkered pattern',
        'Better proportions and shadows',
        'Team-specific design elements'
      ]
    };
    
    const reportPath = path.join(CONFIG.outputDir, 'enhanced-jerseys-report.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(`📊 Report saved to ${reportPath}`);
    return report;
  }

  async run() {
    try {
      await this.init();
      await this.createAllJerseys();
      const report = await this.generateReport();
      
      console.log('🏆 Enhanced jersey creation completed!');
      console.log(`✨ Created ${report.totalJerseys} high-quality jersey designs`);
      
      return this.createdJerseys;
      
    } catch (error) {
      console.error('💥 Jersey creation failed:', error);
      throw error;
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const creator = new EnhancedJerseyCreator();
  
  creator.run()
    .then((results) => {
      console.log(`✨ Jersey creation complete! ${results.length} jerseys ready.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Jersey creation failed:', error);
      process.exit(1);
    });
}

module.exports = EnhancedJerseyCreator;