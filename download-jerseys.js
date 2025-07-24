#!/usr/bin/env node

/**
 * Alternative Jersey Image Downloader
 * 
 * This script downloads high-quality jersey images from reliable sources
 * when browser automation is not available.
 */

const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const CONFIG = {
  outputDir: './assets/img/kits',
  imageSize: 400,
  quality: 85,
  delay: 1000,
  timeout: 30000,
  userAgent: 'Jersey Downloader Bot 1.0'
};

// High-quality jersey image sources (using publicly available images)
const JERSEY_SOURCES = {
  'arg-home-2022': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61734ab7-dad8-4f14-9b4a-9a4316a5d1a9/argentina-2022-stadium-home-mens-soccer-jersey-hKdJgJ.png',
    team: 'Argentina',
    variant: 'Home',
    year: 2022
  },
  'arg-away-2022': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/0e97cb59-3c58-4b9f-a2f1-f77f8db78000/argentina-2022-stadium-away-mens-soccer-jersey-MLGXGl.png',
    team: 'Argentina', 
    variant: 'Away',
    year: 2022
  },
  'bra-home-2022': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/u_126ab356-44d8-4a06-89b4-fcdeb8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/13f3fd6e-2bb4-4e25-aa4e-20327b42e1b0/brazil-2022-stadium-home-mens-soccer-jersey-SztgJl.png',
    team: 'Brazil',
    variant: 'Home', 
    year: 2022
  },
  'bra-away-2022': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/u_126ab356-44d8-4a06-89b4-fcdeb8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/a8ff4dd4-c3f0-4c97-999b-c34f8e62faa7/brazil-2022-stadium-away-mens-soccer-jersey-R9DgV4.png',
    team: 'Brazil',
    variant: 'Away',
    year: 2022
  },
  'fra-home-2022': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/u_126ab356-44d8-4a06-89b4-fcdeb8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/ad5d43fd-c1b7-4b04-b9ca-8c3c8e0a5c0f/france-2022-stadium-home-mens-soccer-jersey-zKn6Bt.png',
    team: 'France',
    variant: 'Home',
    year: 2022
  },
  'eng-home-2022': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/u_126ab356-44d8-4a06-89b4-fcdeb8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/b48f185c-b34b-4de4-8c50-b1575dc1b69f/england-2022-stadium-home-mens-soccer-jersey-89DWpG.png',
    team: 'England',
    variant: 'Home',
    year: 2022
  },
  'ger-home-2018': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9ae01dd5-8c36-4c0e-b5f1-2c5f2d1ff7b4/germany-2018-stadium-home-mens-soccer-jersey-KqK7z5.png',
    team: 'Germany',
    variant: 'Home',
    year: 2018
  },
  'esp-home-2022': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/u_126ab356-44d8-4a06-89b4-fcdeb8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/0c3e2dcf-6e98-4e81-b5b8-2f16d6b4c8b5/spain-2022-stadium-home-mens-soccer-jersey-nLSNrh.png',
    team: 'Spain',
    variant: 'Home',
    year: 2022
  },
  'ned-home-2022': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/u_126ab356-44d8-4a06-89b4-fcdeb8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/7d4e6c83-4d7a-4f8f-9e4f-3e85b5dc2a87/netherlands-2022-stadium-home-mens-soccer-jersey-qDqTrq.png',
    team: 'Netherlands',
    variant: 'Home',
    year: 2022
  },
  'por-home-2022': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/u_126ab356-44d8-4a06-89b4-fcdeb8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5cb3e06c-6e6f-4e36-b5e7-2b09b77f8f12/portugal-2022-stadium-home-mens-soccer-jersey-KpP9Xj.png',
    team: 'Portugal',
    variant: 'Home',
    year: 2022
  },
  'bel-home-2018': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/4a7d5c8e-9f5a-4f6e-8e3c-1c7d2e1f5a6b/belgium-2018-stadium-home-mens-soccer-jersey-Df8Shj.png',
    team: 'Belgium',
    variant: 'Home',
    year: 2018
  },
  'cro-home-2018': {
    url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3f8a6d9e-2b5c-4a8f-9e7d-8c9e3f2a1b5c/croatia-2018-stadium-home-mens-soccer-jersey-QfG8Zh.png',
    team: 'Croatia',
    variant: 'Home',
    year: 2018
  }
};

class JerseyDownloader {
  constructor() {
    this.downloadedImages = [];
  }

  async init() {
    console.log('🚀 Initializing Jersey Downloader...');
    await fs.ensureDir(CONFIG.outputDir);
    console.log('✅ Output directory ready');
  }

  async downloadJerseyImage(kitId, jerseyData) {
    try {
      console.log(`📥 Downloading ${kitId}...`);
      
      // Download image with timeout and proper headers
      const response = await axios.get(jerseyData.url, {
        responseType: 'arraybuffer',
        timeout: CONFIG.timeout,
        headers: {
          'User-Agent': CONFIG.userAgent,
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
        }
      });
      
      const imageBuffer = Buffer.from(response.data);
      
      // Process and save as WebP
      const webpPath = path.join(CONFIG.outputDir, `${kitId}.webp`);
      await sharp(imageBuffer)
        .resize(CONFIG.imageSize, CONFIG.imageSize, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .webp({ quality: CONFIG.quality })
        .toFile(webpPath);
      
      // Process and save as JPEG fallback
      const jpegPath = path.join(CONFIG.outputDir, `${kitId}.jpg`);
      await sharp(imageBuffer)
        .resize(CONFIG.imageSize, CONFIG.imageSize, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255 }
        })
        .jpeg({ quality: CONFIG.quality })
        .toFile(jpegPath);
      
      console.log(`✅ Processed ${kitId}`);
      
      return {
        kitId,
        webpPath,
        jpegPath,
        ...jerseyData
      };
      
    } catch (error) {
      console.error(`❌ Failed to download ${kitId}:`, error.message);
      
      // Return SVG fallback info
      return {
        kitId,
        error: error.message,
        fallbackSvg: `${kitId}.svg`,
        ...jerseyData
      };
    }
  }

  async downloadAllJerseys() {
    console.log('⬇️ Starting jersey downloads...');
    
    for (const [kitId, jerseyData] of Object.entries(JERSEY_SOURCES)) {
      const result = await this.downloadJerseyImage(kitId, jerseyData);
      this.downloadedImages.push(result);
      
      // Be respectful with delays
      await new Promise(resolve => setTimeout(resolve, CONFIG.delay));
    }
    
    const successful = this.downloadedImages.filter(img => !img.error);
    const failed = this.downloadedImages.filter(img => img.error);
    
    console.log(`🎉 Download complete: ${successful.length} successful, ${failed.length} failed`);
    
    return this.downloadedImages;
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalJerseys: this.downloadedImages.length,
      successful: this.downloadedImages.filter(img => !img.error).length,
      failed: this.downloadedImages.filter(img => img.error).length,
      jerseys: this.downloadedImages
    };
    
    const reportPath = path.join(CONFIG.outputDir, 'download-report.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(`📊 Report saved to ${reportPath}`);
    return report;
  }

  async run() {
    try {
      await this.init();
      await this.downloadAllJerseys();
      const report = await this.generateReport();
      
      console.log('🏆 Jersey download completed!');
      console.log(`✨ Successfully downloaded ${report.successful} out of ${report.totalJerseys} jerseys`);
      
      return this.downloadedImages;
      
    } catch (error) {
      console.error('💥 Download failed:', error);
      throw error;
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const downloader = new JerseyDownloader();
  
  downloader.run()
    .then((results) => {
      const successful = results.filter(r => !r.error).length;
      console.log(`✨ Download complete! ${successful} jerseys ready.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Download failed:', error);
      process.exit(1);
    });
}

module.exports = JerseyDownloader;