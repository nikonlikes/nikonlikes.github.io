#!/usr/bin/env node

/**
 * Jersey Image Scraper for Football Kit Archive
 * 
 * This script uses Puppeteer to scrape jersey images from footballkitarchive.com
 * and downloads them for use in our World Cup kits website.
 */

const puppeteer = require('puppeteer');
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const CONFIG = {
  targetUrl: 'https://www.footballkitarchive.com/world-cup-2022-kits/',
  outputDir: './assets/img/kits',
  imageSize: 400,
  quality: 85,
  delay: 2000, // Delay between requests to be respectful
  timeout: 30000,
  userAgent: 'Jersey Scraper Bot 1.0 (Educational Purpose)'
};

// Team mapping to match our existing data structure
const TEAM_MAPPING = {
  'Argentina': 'arg',
  'Brazil': 'bra', 
  'France': 'fra',
  'England': 'eng',
  'Germany': 'ger',
  'Spain': 'esp',
  'Netherlands': 'ned',
  'Portugal': 'por',
  'Belgium': 'bel',
  'Croatia': 'cro'
};

// Kit variant mapping
const VARIANT_MAPPING = {
  'home': 'home',
  'away': 'away',
  'third': 'third',
  'goalkeeper': 'gk'
};

class JerseyScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.scrapedImages = [];
  }

  async init() {
    console.log('🚀 Initializing Jersey Scraper...');
    
    // Ensure output directory exists
    await fs.ensureDir(CONFIG.outputDir);
    
    // Launch browser
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for production
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Set user agent and viewport
    await this.page.setUserAgent(CONFIG.userAgent);
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Enable request interception to block unnecessary resources
    await this.page.setRequestInterception(true);
    this.page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (resourceType === 'stylesheet' || resourceType === 'font') {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log('✅ Browser initialized');
  }

  async scrapeJerseyImages() {
    console.log('🔍 Navigating to Football Kit Archive...');
    
    try {
      // Navigate to the target page
      await this.page.goto(CONFIG.targetUrl, {
        waitUntil: 'networkidle2',
        timeout: CONFIG.timeout
      });

      console.log('📄 Page loaded, waiting for content...');
      
      // Wait for content to load
      await this.page.waitForTimeout(3000);
      
      // Scroll to trigger lazy loading
      await this.autoScroll();
      
      // Wait for images to load
      await this.page.waitForTimeout(5000);
      
      // Extract jersey images
      const jerseyData = await this.page.evaluate(() => {
        const jerseys = [];
        
        // Look for jersey images - this selector might need adjustment based on actual site structure
        const jerseyElements = document.querySelectorAll('img[src*="jersey"], img[src*="kit"], img[alt*="jersey"], img[alt*="kit"]');
        
        jerseyElements.forEach((img) => {
          const src = img.src;
          const alt = img.alt || '';
          const title = img.title || '';
          
          // Skip placeholder or small images
          if (src.includes('data:image') || src.includes('placeholder') || img.width < 100) {
            return;
          }
          
          // Try to extract team and variant info from alt text, title, or surrounding context
          const parentText = img.closest('div')?.textContent?.toLowerCase() || '';
          const combinedText = (alt + ' ' + title + ' ' + parentText).toLowerCase();
          
          jerseys.push({
            src: src,
            alt: alt,
            title: title,
            combinedText: combinedText,
            width: img.width,
            height: img.height
          });
        });
        
        return jerseys;
      });

      console.log(`📸 Found ${jerseyData.length} potential jersey images`);
      
      // Filter and categorize images
      this.scrapedImages = this.categorizeImages(jerseyData);
      
      console.log(`✨ Categorized ${this.scrapedImages.length} jersey images`);
      return this.scrapedImages;
      
    } catch (error) {
      console.error('❌ Error during scraping:', error.message);
      throw error;
    }
  }

  categorizeImages(rawImages) {
    const categorized = [];
    
    rawImages.forEach((img) => {
      const text = img.combinedText;
      
      // Try to identify team
      let teamCode = null;
      for (const [teamName, code] of Object.entries(TEAM_MAPPING)) {
        if (text.includes(teamName.toLowerCase())) {
          teamCode = code;
          break;
        }
      }
      
      // Try to identify variant
      let variant = 'home'; // default
      if (text.includes('away')) variant = 'away';
      else if (text.includes('third')) variant = 'third';
      else if (text.includes('goalkeeper') || text.includes('gk')) variant = 'gk';
      
      // Only include if we can identify the team
      if (teamCode) {
        categorized.push({
          ...img,
          teamCode,
          variant,
          filename: `${teamCode}-${variant}-2022`
        });
      }
    });
    
    return categorized;
  }

  async downloadAndProcessImages() {
    console.log('⬇️ Starting image download and processing...');
    
    const downloadedImages = [];
    
    for (let i = 0; i < this.scrapedImages.length; i++) {
      const jersey = this.scrapedImages[i];
      
      try {
        console.log(`📥 Processing ${jersey.filename} (${i + 1}/${this.scrapedImages.length})`);
        
        // Download image
        const response = await axios.get(jersey.src, {
          responseType: 'arraybuffer',
          timeout: CONFIG.timeout,
          headers: {
            'User-Agent': CONFIG.userAgent,
            'Referer': CONFIG.targetUrl
          }
        });
        
        const imageBuffer = Buffer.from(response.data);
        
        // Process image with Sharp
        const webpPath = path.join(CONFIG.outputDir, `${jersey.filename}.webp`);
        const jpegPath = path.join(CONFIG.outputDir, `${jersey.filename}.jpg`);
        
        // Create WebP version
        await sharp(imageBuffer)
          .resize(CONFIG.imageSize, CONFIG.imageSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .webp({ quality: CONFIG.quality })
          .toFile(webpPath);
        
        // Create JPEG fallback
        await sharp(imageBuffer)
          .resize(CONFIG.imageSize, CONFIG.imageSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255 }
          })
          .jpeg({ quality: CONFIG.quality })
          .toFile(jpegPath);
        
        downloadedImages.push({
          ...jersey,
          webpPath,
          jpegPath
        });
        
        console.log(`✅ Processed ${jersey.filename}`);
        
        // Be respectful with delays
        await new Promise(resolve => setTimeout(resolve, CONFIG.delay));
        
      } catch (error) {
        console.error(`❌ Failed to process ${jersey.filename}:`, error.message);
      }
    }
    
    console.log(`🎉 Successfully processed ${downloadedImages.length} images`);
    return downloadedImages;
  }

  async autoScroll() {
    console.log('📜 Auto-scrolling to trigger lazy loading...');
    
    await this.page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    
    // Scroll back to top
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async generateReport(processedImages) {
    const report = {
      timestamp: new Date().toISOString(),
      sourceUrl: CONFIG.targetUrl,
      totalImages: processedImages.length,
      images: processedImages.map(img => ({
        teamCode: img.teamCode,
        variant: img.variant,
        filename: img.filename,
        originalUrl: img.src,
        webpPath: img.webpPath,
        jpegPath: img.jpegPath
      }))
    };
    
    const reportPath = path.join(CONFIG.outputDir, 'scrape-report.json');
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(`📊 Report saved to ${reportPath}`);
    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser closed');
    }
  }

  async run() {
    try {
      await this.init();
      await this.scrapeJerseyImages();
      const processedImages = await this.downloadAndProcessImages();
      await this.generateReport(processedImages);
      
      console.log('🏆 Jersey scraping completed successfully!');
      return processedImages;
      
    } catch (error) {
      console.error('💥 Scraping failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run the scraper if this file is executed directly
if (require.main === module) {
  const scraper = new JerseyScraper();
  
  scraper.run()
    .then((results) => {
      console.log(`✨ Scraping complete! Downloaded ${results.length} jersey images.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Scraping failed:', error);
      process.exit(1);
    });
}

module.exports = JerseyScraper;