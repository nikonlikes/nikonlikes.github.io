// Local Storage Keys
const CART_KEY = 'footballCart';
const WISHLIST_KEY = 'footballWishlist';

// Cart Management
export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (itemObj) => {
  const cart = getCart();
  const existingItem = cart.find(
    item => item.id === itemObj.id && item.size === itemObj.size
  );

  if (existingItem) {
    existingItem.qty += itemObj.qty;
  } else {
    cart.push(itemObj);
  }

  saveCart(cart);
  return cart;
};

export const updateQty = (id, size, delta) => {
  const cart = getCart();
  const item = cart.find(item => item.id === id && item.size === size);
  
  if (item) {
    item.qty = Math.max(0, item.qty + delta);
    if (item.qty === 0) {
      return removeItem(id, size);
    }
  }
  
  saveCart(cart);
  return cart;
};

export const removeItem = (id, size) => {
  const cart = getCart().filter(
    item => !(item.id === id && item.size === size)
  );
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  return [];
};

// Wishlist Management
export const getWishlist = () => {
  const wishlist = localStorage.getItem(WISHLIST_KEY);
  return wishlist ? JSON.parse(wishlist) : [];
};

export const saveWishlist = (wishlist) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
};

export const toggleWishlist = (id) => {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(id);
  
  if (index === -1) {
    wishlist.push(id);
  } else {
    wishlist.splice(index, 1);
  }
  
  saveWishlist(wishlist);
  return wishlist;
};

// Price Formatting
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Calculate Cart Total
export const calculateTotal = (cart, kits) => {
  return cart.reduce((total, item) => {
    const kit = kits.find(k => k.id === item.id);
    return total + (kit ? kit.price * item.qty : 0);
  }, 0);
};

// URL Parameter Helpers
export const getUrlParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// Image Loading
export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}; 