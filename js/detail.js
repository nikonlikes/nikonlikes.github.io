// Kit detail page functionality
import { findKitById, KITS } from './data.js';
import { getUrlParameter, addToCart, updateCartCount, formatPrice, showNotification } from './utils.js';

class KitDetailManager {
  constructor() {
    this.kitId = getUrlParameter('id');
    this.kit = null;
    
    // DOM elements
    this.pageTitle = document.getElementById('page-title');
    this.breadcrumbCurrent = document.getElementById('breadcrumb-current');
    this.kitMainImage = document.getElementById('kit-main-image');
    this.kitTitle = document.getElementById('kit-title');
    this.kitTeamInfo = document.getElementById('kit-team-info');
    this.kitPrice = document.getElementById('kit-price');
    this.kitSpecsList = document.getElementById('kit-specs-list');
    this.kitDescriptionText = document.getElementById('kit-description-text');
    this.sizeSelect = document.getElementById('size-select');
    this.quantityInput = document.getElementById('quantity');
    this.purchaseForm = document.getElementById('purchase-form');
    this.relatedKitsGrid = document.getElementById('related-kits-grid');
    
    this.init();
  }

  init() {
    if (!this.kitId) {
      this.handleMissingKit();
      return;
    }

    this.kit = findKitById(this.kitId);
    
    if (!this.kit) {
      this.handleMissingKit();
      return;
    }

    this.renderKitDetails();
    this.renderRelatedKits();
    this.bindEventListeners();
    updateCartCount();
  }

  // Handle case when kit is not found
  handleMissingKit() {
    if (this.pageTitle) {
      this.pageTitle.textContent = 'Kit Not Found - World Cup Kits';
    }
    
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.innerHTML = `
        <section class="error-section">
          <div class="container">
            <div class="error-content">
              <h1>Kit Not Found</h1>
              <p>Sorry, the kit you're looking for could not be found.</p>
              <div class="error-actions">
                <a href="index.html" class="btn btn-primary">Go Home</a>
                <a href="kits.html" class="btn btn-outline">Browse All Kits</a>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  }

  // Render all kit details on the page
  renderKitDetails() {
    // Update page title and breadcrumb
    const kitName = `${this.kit.team} ${this.kit.variant} ${this.kit.year}`;
    if (this.pageTitle) {
      this.pageTitle.textContent = `${kitName} - World Cup Kits`;
    }
    if (this.breadcrumbCurrent) {
      this.breadcrumbCurrent.textContent = kitName;
    }

    // Main image
    if (this.kitMainImage) {
      this.kitMainImage.src = this.kit.img;
      this.kitMainImage.alt = `${this.kit.team} ${this.kit.variant} ${this.kit.year} kit`;
    }

    // Kit title with flag
    if (this.kitTitle) {
      this.kitTitle.innerHTML = `
        <img src="assets/icons/${this.kit.team.toLowerCase()}.png" alt="${this.kit.team} flag" class="team-flag">
        ${this.kit.team} ${this.kit.variant} ${this.kit.year}
      `;
    }

    // Team info
    if (this.kitTeamInfo) {
      this.kitTeamInfo.innerHTML = `
        <p><strong>Team:</strong> ${this.kit.team}</p>
        <p><strong>Year:</strong> ${this.kit.year}</p>
        <p><strong>Type:</strong> ${this.kit.variant} Kit</p>
      `;
    }

    // Price
    if (this.kitPrice) {
      this.kitPrice.textContent = formatPrice(this.kit.price);
    }

    // Specifications
    if (this.kitSpecsList) {
      this.kitSpecsList.innerHTML = `
        <li><strong>Material:</strong> 100% Polyester</li>
        <li><strong>Fit:</strong> Athletic Cut</li>
        <li><strong>Features:</strong> Moisture-wicking technology</li>
        <li><strong>Available Sizes:</strong> ${this.kit.sizes.join(', ')}</li>
        <li><strong>Care:</strong> Machine wash cold</li>
      `;
    }

    // Description
    if (this.kitDescriptionText && this.kit.description) {
      this.kitDescriptionText.textContent = this.kit.description;
    }

    // Size options
    if (this.sizeSelect) {
      this.sizeSelect.innerHTML = '<option value="">Choose Size</option>';
      this.kit.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        this.sizeSelect.appendChild(option);
      });
    }
  }

  // Render related kits (from same team or year)
  renderRelatedKits() {
    if (!this.relatedKitsGrid) return;

    // Find related kits (same team or same year, but not the current kit)
    const relatedKits = KITS
      .filter(kit => 
        kit.id !== this.kit.id && 
        (kit.team === this.kit.team || kit.year === this.kit.year)
      )
      .slice(0, 3); // Limit to 3 related kits

    if (relatedKits.length === 0) {
      // If no related kits, show some random kits
      const randomKits = KITS
        .filter(kit => kit.id !== this.kit.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      relatedKits.push(...randomKits);
    }

    // Clear existing content
    this.relatedKitsGrid.innerHTML = '';

    // Create kit cards
    relatedKits.forEach(kit => {
      const kitCard = document.createElement('div');
      kitCard.className = 'kit-card';
      
      kitCard.innerHTML = `
        <div class="kit-image">
          <img src="${kit.img}" alt="${kit.team} ${kit.variant} ${kit.year}" loading="lazy">
        </div>
        <div class="kit-info">
          <h3 class="kit-title">
            <img src="assets/icons/${kit.team.toLowerCase()}.png" alt="${kit.team} flag" class="team-flag">
            ${kit.team} ${kit.variant}
          </h3>
          <p class="kit-year">${kit.year}</p>
          <p class="kit-price">${formatPrice(kit.price)}</p>
          <a href="kit-detail.html?id=${kit.id}" class="btn btn-small">View Details</a>
        </div>
      `;
      
      this.relatedKitsGrid.appendChild(kitCard);
    });
  }

  // Handle form submission
  handleFormSubmit(event) {
    event.preventDefault();
    
    const size = this.sizeSelect.value;
    const quantity = parseInt(this.quantityInput.value, 10) || 1;
    
    if (!size) {
      showNotification('Please select a size!', 'warning');
      this.sizeSelect.focus();
      return;
    }

    if (quantity < 1 || quantity > 10) {
      showNotification('Please enter a valid quantity (1-10)!', 'warning');
      this.quantityInput.focus();
      return;
    }

    try {
      addToCart(this.kitId, size, quantity);
      
      const itemText = quantity === 1 ? 'item' : 'items';
      showNotification(
        `Added ${quantity} ${itemText} to cart! (Size: ${size})`, 
        'success'
      );
      
      // Reset form
      this.sizeSelect.value = '';
      this.quantityInput.value = 1;
      
      // Brief visual feedback
      const submitBtn = this.purchaseForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Added to Cart!';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Error adding item to cart. Please try again.', 'error');
    }
  }

  // Bind event listeners
  bindEventListeners() {
    if (this.purchaseForm) {
      this.purchaseForm.addEventListener('submit', (event) => {
        this.handleFormSubmit(event);
      });
    }
  }
}

// Initialize kit detail manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new KitDetailManager();
});