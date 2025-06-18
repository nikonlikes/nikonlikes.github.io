// Shop page functionality - kit grid display and filtering
import { KITS, getUniqueTeams, filterKits } from './data.js';
import { addToCart, updateCartCount, showNotification } from './utils.js';

class ShopManager {
  constructor() {
    this.kitsGrid = document.getElementById('kits-grid');
    this.teamFilter = document.getElementById('team-filter');
    this.yearFilters = document.querySelectorAll('input[name="year"]');
    this.noResults = document.getElementById('no-results');
    
    this.currentTeamFilter = 'all';
    this.currentYearFilter = 'all';
    
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

  // Create individual kit card element
  createKitCard(kit) {
    const card = document.createElement('div');
    card.className = 'kit-card';
    
    card.innerHTML = `
      <div class="kit-image">
        <img src="${kit.img}" alt="${kit.team} ${kit.variant} ${kit.year}" loading="lazy">
      </div>
      <div class="kit-info">
        <h3 class="kit-title">
          <img src="assets/icons/${kit.team.toLowerCase()}.svg" alt="${kit.team} flag" class="team-flag">
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

  // Handle filter changes
  handleFilterChange() {
    // Get current filter values
    this.currentTeamFilter = this.teamFilter.value;
    
    const checkedYearFilter = document.querySelector('input[name="year"]:checked');
    this.currentYearFilter = checkedYearFilter ? checkedYearFilter.value : 'all';

    // Filter and render kits
    const filteredKits = filterKits(this.currentTeamFilter, this.currentYearFilter);
    this.renderKits(filteredKits);
  }

  // Bind event listeners
  bindEventListeners() {
    // Team filter dropdown
    if (this.teamFilter) {
      this.teamFilter.addEventListener('change', () => this.handleFilterChange());
    }

    // Year filter radio buttons
    this.yearFilters.forEach(filter => {
      filter.addEventListener('change', () => this.handleFilterChange());
    });

    // Add to cart buttons (event delegation)
    if (this.kitsGrid) {
      this.kitsGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
          this.handleAddToCart(event);
        }
      });
    }
  }
}

// Initialize shop manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ShopManager();
});