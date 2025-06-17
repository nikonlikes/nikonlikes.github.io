// Utility functions for cart management and general helpers

// Local storage key for cart data
const CART_KEY = 'footballCart';

// Get cart data from localStorage
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

// Save cart data to localStorage
export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Add item to cart or update quantity if it already exists
export const addToCart = (kitId, size, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === kitId && item.size === size);
  
  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({ id: kitId, size, qty: quantity });
  }
  
  saveCart(cart);
};

// Update quantity of specific item in cart
export const updateQty = (kitId, size, newQty) => {
  const cart = getCart();
  const item = cart.find(item => item.id === kitId && item.size === size);
  
  if (item) {
    if (newQty <= 0) {
      removeItem(kitId, size);
    } else {
      item.qty = newQty;
      saveCart(cart);
    }
  }
};

// Remove specific item from cart
export const removeItem = (kitId, size) => {
  const cart = getCart();
  const filteredCart = cart.filter(item => !(item.id === kitId && item.size === size));
  saveCart(filteredCart);
};

// Clear entire cart
export const clearCart = () => {
  saveCart([]);
};

// Get total number of items in cart
export const getCartItemCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.qty, 0);
};

// Update cart count in navigation
export const updateCartCount = () => {
  const cartCountElements = document.querySelectorAll('#cart-count');
  const count = getCartItemCount();
  
  cartCountElements.forEach(element => {
    if (element) {
      element.textContent = count;
    }
  });
};

// Format price with currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Get URL parameter by name
export const getUrlParameter = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};

// Show notification message (simple alert for demo)
export const showNotification = (message, type = 'info') => {
  // In a production app, this would be a proper toast notification
  alert(message);
};

// Debounce function for search/filter inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});