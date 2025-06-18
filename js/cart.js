// Shopping cart page functionality
import { findKitById } from './data.js';
import { 
  getCart, 
  saveCart, 
  updateQty, 
  removeItem, 
  clearCart,
  updateCartCount,
  formatPrice,
  showNotification,
  getFlagIconPath
} from './utils.js';

class CartManager {
  constructor() {
    this.cartContent = document.getElementById('cart-content');
    this.cartEmpty = document.getElementById('cart-empty');
    this.cartItemsTbody = document.getElementById('cart-items-tbody');
    this.cartSubtotal = document.getElementById('cart-subtotal');
    this.cartShipping = document.getElementById('cart-shipping');
    this.cartTotal = document.getElementById('cart-total');
    this.checkoutBtn = document.getElementById('checkout-btn');
    this.clearCartBtn = document.getElementById('clear-cart-btn');
    
    this.cart = [];
    
    this.init();
  }

  init() {
    this.loadCart();
    this.renderCart();
    this.bindEventListeners();
    updateCartCount();
  }

  // Load cart data from localStorage
  loadCart() {
    this.cart = getCart();
  }

  // Render the entire cart interface
  renderCart() {
    if (this.cart.length === 0) {
      this.showEmptyCart();
      return;
    }

    this.showCartContent();
    this.renderCartItems();
    this.updateSummary();
  }

  // Show empty cart message
  showEmptyCart() {
    if (this.cartEmpty) {
      this.cartEmpty.style.display = 'block';
    }
    if (this.cartContent) {
      this.cartContent.style.display = 'none';
    }
  }

  // Show cart content
  showCartContent() {
    if (this.cartEmpty) {
      this.cartEmpty.style.display = 'none';
    }
    if (this.cartContent) {
      this.cartContent.style.display = 'block';
    }
  }

  // Render all cart items
  renderCartItems() {
    if (!this.cartItemsTbody) return;

    this.cartItemsTbody.innerHTML = '';

    this.cart.forEach((cartItem, index) => {
      const kit = findKitById(cartItem.id);
      if (!kit) {
        // Remove invalid items from cart
        this.cart.splice(index, 1);
        saveCart(this.cart);
        return;
      }

      const row = this.createCartItemRow(cartItem, kit);
      this.cartItemsTbody.appendChild(row);
    });

    // If cart became empty after removing invalid items
    if (this.cart.length === 0) {
      this.renderCart();
    }
  }

  // Create individual cart item row
  createCartItemRow(cartItem, kit) {
    const row = document.createElement('tr');
    const itemTotal = kit.price * cartItem.qty;
    
    row.innerHTML = `
      <td>
        <div class="cart-item-info">
          <img src="${kit.img}" alt="${kit.team} ${kit.variant}" class="cart-item-image">
          <div class="cart-item-details">
            <h4>
              <img src="${getFlagIconPath(kit.team)}" alt="${kit.team} flag" class="team-flag">
              ${kit.team} ${kit.variant}
            </h4>
            <p>${kit.year} World Cup</p>
          </div>
        </div>
      </td>
      <td><strong>${cartItem.size}</strong></td>
      <td>${formatPrice(kit.price)}</td>
      <td>
        <div class="quantity-controls">
          <button 
            class="quantity-btn decrease-btn" 
            data-kit-id="${cartItem.id}" 
            data-size="${cartItem.size}"
            aria-label="Decrease quantity"
          >-</button>
          <span class="quantity-display">${cartItem.qty}</span>
          <button 
            class="quantity-btn increase-btn" 
            data-kit-id="${cartItem.id}" 
            data-size="${cartItem.size}"
            aria-label="Increase quantity"
          >+</button>
        </div>
      </td>
      <td><strong>${formatPrice(itemTotal)}</strong></td>
      <td>
        <button 
          class="remove-btn" 
          data-kit-id="${cartItem.id}" 
          data-size="${cartItem.size}"
          aria-label="Remove ${kit.team} ${kit.variant} size ${cartItem.size} from cart"
        >Remove</button>
      </td>
    `;

    return row;
  }

  // Update cart summary (totals)
  updateSummary() {
    const subtotal = this.calculateSubtotal();
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    if (this.cartSubtotal) {
      this.cartSubtotal.textContent = formatPrice(subtotal);
    }
    
    if (this.cartShipping) {
      this.cartShipping.textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
    }
    
    if (this.cartTotal) {
      this.cartTotal.textContent = formatPrice(total);
    }

    // Enable/disable checkout button
    if (this.checkoutBtn) {
      this.checkoutBtn.disabled = this.cart.length === 0;
    }
  }

  // Calculate cart subtotal
  calculateSubtotal() {
    return this.cart.reduce((total, cartItem) => {
      const kit = findKitById(cartItem.id);
      return kit ? total + (kit.price * cartItem.qty) : total;
    }, 0);
  }

  // Handle quantity increase
  handleQuantityIncrease(kitId, size) {
    const cartItem = this.cart.find(item => item.id === kitId && item.size === size);
    if (cartItem && cartItem.qty < 10) { // Max quantity limit
      updateQty(kitId, size, cartItem.qty + 1);
      this.loadCart();
      this.renderCart();
    } else if (cartItem && cartItem.qty >= 10) {
      showNotification('Maximum quantity (10) reached for this item.', 'warning');
    }
  }

  // Handle quantity decrease
  handleQuantityDecrease(kitId, size) {
    const cartItem = this.cart.find(item => item.id === kitId && item.size === size);
    if (cartItem) {
      if (cartItem.qty > 1) {
        updateQty(kitId, size, cartItem.qty - 1);
        this.loadCart();
        this.renderCart();
      } else {
        // If quantity is 1, remove the item
        this.handleRemoveItem(kitId, size);
      }
    }
  }

  // Handle item removal
  handleRemoveItem(kitId, size) {
    const kit = findKitById(kitId);
    const kitName = kit ? `${kit.team} ${kit.variant} (${size})` : 'Item';
    
    if (confirm(`Remove ${kitName} from your cart?`)) {
      removeItem(kitId, size);
      this.loadCart();
      this.renderCart();
      showNotification(`${kitName} removed from cart.`, 'info');
    }
  }

  // Handle clear entire cart
  handleClearCart() {
    if (this.cart.length === 0) return;
    
    if (confirm('Are you sure you want to empty your entire cart?')) {
      clearCart();
      this.loadCart();
      this.renderCart();
      showNotification('Cart emptied successfully.', 'info');
    }
  }

  // Handle checkout (demo only)
  handleCheckout() {
    if (this.cart.length === 0) return;
    
    const total = formatPrice(this.calculateSubtotal());
    showNotification(
      `This is a demo site. In a real store, you would proceed to checkout with a total of ${total}.`,
      'info'
    );
  }

  // Bind event listeners
  bindEventListeners() {
    // Clear cart button
    if (this.clearCartBtn) {
      this.clearCartBtn.addEventListener('click', () => this.handleClearCart());
    }

    // Checkout button
    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => this.handleCheckout());
    }

    // Cart item actions (event delegation)
    if (this.cartItemsTbody) {
      this.cartItemsTbody.addEventListener('click', (event) => {
        const target = event.target;
        const kitId = target.dataset.kitId;
        const size = target.dataset.size;

        if (!kitId || !size) return;

        if (target.classList.contains('increase-btn')) {
          this.handleQuantityIncrease(kitId, size);
        } else if (target.classList.contains('decrease-btn')) {
          this.handleQuantityDecrease(kitId, size);
        } else if (target.classList.contains('remove-btn')) {
          this.handleRemoveItem(kitId, size);
        }
      });
    }
  }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CartManager();
});