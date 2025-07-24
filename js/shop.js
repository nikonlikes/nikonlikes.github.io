// Shop page functionality - kit grid display and filtering
import { KITS, getUniqueTeams, filterKits } from './data.js';
import { addToCart, updateCartCount, showNotification } from './utils.js';

class ShopManager {
  constructor() {
    this.kitsGrid = document.getElementById('kits-grid');
    this.teamFilter = document.getElementById('team-filter');
    this.yearFilters = document.querySelectorAll('input[name="year"]');
    this.searchInput = document.getElementById('search-input');
    this.clearSearchBtn = document.getElementById('clear-search');
    this.noResults = document.getElementById('no-results');
    
    this.currentTeamFilter = 'all';
    this.currentYearFilter = 'all';
    this.currentSearchQuery = '';
    
    this.init();
  }

  init() {
    this.populateTeamFilter();
    this.renderKits(KITS);
    this.bindEventListeners();
    updateCartCount();
  }

  // Populate team filter dropdown with unique teams
  populateTeamFilter() {
    const teams = getUniqueTeams();
    
    teams.forEach(team => {
      const option = document.createElement('option');
      option.value = team;
      option.textContent = team;
      this.teamFilter.appendChild(option);
    });
  }

  // Render kits in the grid
  renderKits(kits) {
    if (!this.kitsGrid) return;

    // Clear existing content
    this.kitsGrid.innerHTML = '';
    
    if (kits.length === 0) {
      this.showNoResults();
      return;
    }

    this.hideNoResults();

    // Create kit cards
    kits.forEach(kit => {
      const kitCard = this.createKitCard(kit);
      this.kitsGrid.appendChild(kitCard);
    });
  }

  // Enhanced image loading with format fallback
  handleImageError(img, kit) {
    const fallbackLevel = parseInt(img.dataset.fallbackLevel || '0');
    
    if (kit && kit.images) {
      // Try fallback formats in order: webp -> jpg -> svg -> placeholder
      const fallbackOrder = ['webp', 'jpg', 'svg', 'fallback'];
      const nextFallback = fallbackOrder[fallbackLevel + 1];
      
      if (nextFallback && kit.images[nextFallback]) {
        img.dataset.fallbackLevel = (fallbackLevel + 1).toString();
        img.src = kit.images[nextFallback];
        return;
      }
    }
    
    // Final fallback
    if (!img.dataset.finalFallback) {
      img.dataset.finalFallback = 'true';
      img.src = 'assets/img/kits/placeholder.svg';
    }
  }

  // Load optimal image format
  loadOptimalImage(kit) {
    // Check for WebP support and return best format
    if (kit.images) {
      // Try to use auto-detected format first
      return kit.images.auto || kit.img;
    }
    return kit.img;
  }

  // Create individual kit card element
  createKitCard(kit) {
    const card = document.createElement('div');
    card.className = 'kit-card clickable-card';
    card.dataset.kitId = kit.id;
    
    const optimalImageSrc = this.loadOptimalImage(kit);
    
    card.innerHTML = `
      <div class="kit-image">
        <img 
          src="${optimalImageSrc}" 
          alt="${kit.team} ${kit.variant} ${kit.year}" 
          loading="lazy"
          data-kit-id="${kit.id}"
          onerror="this.closest('.kit-card').dispatchEvent(new CustomEvent('imageError', {detail: {img: this, kit: arguments[0]}}))"
        >
      </div>
      <div class="kit-info">
        <h3 class="kit-title">
          <img src="assets/icons/${kit.teamCode}.svg" alt="${kit.team} flag" class="team-flag">
          ${kit.team} ${kit.variant}
        </h3>
        <p class="kit-year">${kit.year}</p>
        <p class="kit-price">$${kit.price}</p>
        <div class="kit-actions">
          <a href="kit-detail.html?id=${kit.id}" class="btn btn-outline btn-small">View Details</a>
          <div class="quick-add">
            <select class="size-select-${kit.id}" aria-label="Select size for ${kit.team} ${kit.variant}">
              <option value="">Size</option>
              ${kit.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
            </select>
            <button 
              class="btn btn-primary btn-small add-to-cart-btn" 
              data-kit-id="${kit.id}"
              aria-label="Add ${kit.team} ${kit.variant} to cart"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;

    // Add enhanced error handling for the card
    card.addEventListener('imageError', (event) => {
      this.handleImageError(event.detail.img, kit);
    });

    return card;
  }

  // Show no results message
  showNoResults() {
    if (this.noResults) {
      this.noResults.style.display = 'block';
    }
  }

  // Hide no results message
  hideNoResults() {
    if (this.noResults) {
      this.noResults.style.display = 'none';
    }
  }

  // Handle add to cart button clicks
  handleAddToCart(event) {
    const button = event.target;
    const kitId = button.dataset.kitId;
    const sizeSelect = document.querySelector(`.size-select-${kitId}`);
    
    if (!sizeSelect || !sizeSelect.value) {
      showNotification('Please select a size first!', 'warning');
      sizeSelect?.focus();
      return;
    }

    const size = sizeSelect.value;
    
    try {
      addToCart(kitId, size, 1);
      showNotification(`Added to cart! Size: ${size}`, 'success');
      
      // Reset size selection
      sizeSelect.value = '';
      
      // Brief visual feedback
      button.textContent = 'Added!';
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.disabled = false;
      }, 1500);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Error adding item to cart. Please try again.', 'error');
    }
  }

  // Search through kits based on query
  searchKits(query) {
    if (!query.trim()) return KITS;
    
    const searchTerm = query.toLowerCase().trim();
    return KITS.filter(kit => {
      return kit.team.toLowerCase().includes(searchTerm) ||
             kit.variant.toLowerCase().includes(searchTerm) ||
             kit.year.toString().includes(searchTerm);
    });
  }

  // Handle search input
  handleSearch() {
    this.currentSearchQuery = this.searchInput.value;
    this.applyFiltersAndSearch();
    
    // Show/hide clear button
    if (this.clearSearchBtn) {
      this.clearSearchBtn.style.display = this.currentSearchQuery ? 'flex' : 'none';
    }
  }

  // Clear search
  clearSearch() {
    this.currentSearchQuery = '';
    this.searchInput.value = '';
    this.applyFiltersAndSearch();
    
    if (this.clearSearchBtn) {
      this.clearSearchBtn.style.display = 'none';
    }
  }

  // Apply all filters and search
  applyFiltersAndSearch() {
    // Start with search results
    let filteredKits = this.searchKits(this.currentSearchQuery);
    
    // Apply team filter
    if (this.currentTeamFilter !== 'all') {
      filteredKits = filteredKits.filter(kit => kit.team === this.currentTeamFilter);
    }
    
    // Apply year filter
    if (this.currentYearFilter !== 'all') {
      filteredKits = filteredKits.filter(kit => kit.year.toString() === this.currentYearFilter);
    }
    
    this.renderKits(filteredKits);
  }

  // Handle filter changes
  handleFilterChange() {
    // Get current filter values
    this.currentTeamFilter = this.teamFilter.value;
    
    const checkedYearFilter = document.querySelector('input[name="year"]:checked');
    this.currentYearFilter = checkedYearFilter ? checkedYearFilter.value : 'all';

    // Apply filters and search
    this.applyFiltersAndSearch();
  }

  // Handle card clicks
  handleCardClick(event) {
    // Don't navigate if clicking on buttons, selects, or links
    if (event.target.tagName === 'BUTTON' || 
        event.target.tagName === 'SELECT' || 
        event.target.tagName === 'A' ||
        event.target.closest('button') ||
        event.target.closest('select') ||
        event.target.closest('a')) {
      return;
    }

    const card = event.target.closest('.clickable-card');
    if (card) {
      const kitId = card.dataset.kitId;
      window.location.href = `kit-detail.html?id=${kitId}`;
    }
  }

  // Bind event listeners
  bindEventListeners() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.handleSearch());
      this.searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.clearSearch();
        }
      });
    }

    // Clear search button
    if (this.clearSearchBtn) {
      this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
    }

    // Team filter dropdown
    if (this.teamFilter) {
      this.teamFilter.addEventListener('change', () => this.handleFilterChange());
    }

    // Year filter radio buttons
    this.yearFilters.forEach(filter => {
      filter.addEventListener('change', () => this.handleFilterChange());
    });

    // Kit grid event delegation for multiple interactions
    if (this.kitsGrid) {
      this.kitsGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
          this.handleAddToCart(event);
        } else {
          // Handle card clicks for navigation
          this.handleCardClick(event);
        }
      });
    }
  }
}

// Initialize shop manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ShopManager();
});