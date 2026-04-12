import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const StoreContext = createContext(null);

// ── API URL ────────────────────────────────────────────────────────────────
// In dev, Vite proxies /api → http://localhost:4000
// In production, set VITE_API_URL in your deployment environment
const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// ── Fallback seed data (used when API is unreachable) ─────────────────────
const FALLBACK_PRODUCTS = [
  {
    id: 'silk-amber',
    sku: 'QZ-001',
    name: 'Silk Amber',
    price: 24000,
    stock: 12,
    sales: 45,
    category: 'musk',
    image: '/silk_amber_attar.png',
    tag: 'Best Seller',
    isNewArrival: false,
    description: 'A masterclass in modern perfumery. Silk Amber weaves rich Omani frankincense with creamy Madagascar vanilla and warm spices.',
  },
  {
    id: 'royal-oud',
    sku: 'QZ-002',
    name: 'Royal Oud',
    price: 35000,
    stock: 3,
    sales: 89,
    category: 'oud',
    image: '/hero_luxury_fragrance.png',
    tag: 'Limited',
    isNewArrival: true,
    description: 'A majestic blend of aged Cambodian oud, saffron, and rose absolute.',
  },
  {
    id: 'midnight-musk',
    sku: 'QZ-003',
    name: 'Midnight Musk',
    price: 18500,
    stock: 0,
    sales: 112,
    category: 'musk',
    image: '/silk_amber_attar.png',
    tag: '',
    isNewArrival: false,
    description: 'A sensual, skin-close musk that deepens throughout the day.',
  },
  {
    id: 'desert-rose',
    sku: 'QZ-004',
    name: 'Desert Rose',
    price: 22000,
    stock: 45,
    sales: 23,
    category: 'floral',
    image: '/hero_luxury_fragrance.png',
    tag: '',
    isNewArrival: true,
    description: 'A rare Taif rose sourced at dawn, blended with oud and sandalwood.',
  },
];

export const StoreProvider = ({ children }) => {
  const [products, setProductsRaw]  = useState(FALLBACK_PRODUCTS);
  const [settings, setSettings]     = useState({});
  const [orders, setOrders]         = useState([]);
  const [customers, setCustomers]   = useState([]);
  const [apiReady, setApiReady]     = useState(false);
  const [loadingApi, setLoadingApi] = useState(true);
  const [cartItems, setCartItems]   = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  // ── Load products from MongoDB on mount ─────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      const data = await apiFetch('/products');
      setProductsRaw(data);
      setApiReady(true);
    } catch (_) {
      // API not reachable — use fallback (dev without server, or offline)
      console.warn('⚠ API unavailable — using offline product data');
      setApiReady(false);
    } finally {
      setLoadingApi(false);
    }
  }, []);

  // ── Load settings from MongoDB ──────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    try {
      const data = await apiFetch('/settings');
      setSettings(data);
    } catch (_) {}
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await apiFetch('/orders');
      setOrders(data);
    } catch (_) {}
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const data = await apiFetch('/customers');
      setCustomers(data);
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
    fetchOrders();
    fetchCustomers();
    // Poll every 30 s so storefront stays in sync with admin changes
    const interval = setInterval(() => {
      fetchProducts();
      fetchSettings();
      fetchOrders();
      fetchCustomers();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchProducts, fetchSettings, fetchOrders, fetchCustomers]);

  // ── Product CRUD (synced to MongoDB when available) ─────────────────────
  const formatPrice = (num) => '₹' + Number(num).toLocaleString('en-IN');

  const createOrder = async (orderData) => {
    if (apiReady) {
      try {
        const order = await apiFetch('/orders', {
          method: 'POST',
          body: JSON.stringify({
            ...orderData,
            status: 'Pending',
          }),
        });
        setOrders(prev => [order, ...prev]);
        return order;
      } catch (err) {
        console.error('Failed to save order:', err.message);
        throw err;
      }
    } else {
      // Offline fallback
      const localOrder = { ...orderData, id: 'QZ-' + Date.now(), status: 'Offline' };
      setOrders(prev => [localOrder, ...prev]);
      return localOrder;
    }
  };


  const addProduct = async (data) => {
    const payload = {
      ...data,
      price: Number(data.price),
      stock: parseInt(data.stock) || 0,
      isNewArrival: !!data.isNewArrival,
      tag: data.isNewArrival ? 'New Arrival' : (data.tag || ''),
      sales: 0,
      size: Number(data.size) || 100,
      unit: data.unit || 'ml',
      extras: data.extras || [], // Added for card, diffuser, etc.
    };


    if (apiReady) {
      try {
        const created = await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setProductsRaw(prev => [created, ...prev]);
        return created;
      } catch (err) {
        throw new Error('Failed to save product: ' + err.message);
      }
    } else {
      // Offline fallback
      const newP = { ...payload, id: data.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), sku: `QZ-${Date.now()}` };
      setProductsRaw(prev => [newP, ...prev]);
      return newP;
    }
  };

  const updateProduct = async (id, updates) => {
    const sanitized = {
      ...updates,
      tag: updates.isNewArrival ? 'New Arrival' : (updates.tag || ''),
      size: Number(updates.size) || undefined,
      extras: updates.extras,
    };


    // Optimistic update
    setProductsRaw(prev => prev.map(p => p.id === id ? { ...p, ...sanitized } : p));

    if (apiReady) {
      try {
        await apiFetch(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(sanitized),
        });
      } catch (err) {
        // Revert on failure
        await fetchProducts();
        throw err;
      }
    }
  };

  const deleteProduct = async (id) => {
    // Optimistic
    setProductsRaw(prev => prev.filter(p => p.id !== id));

    if (apiReady) {
      try {
        await apiFetch(`/products/${id}`, { method: 'DELETE' });
      } catch (err) {
        await fetchProducts();
        throw err;
      }
    }
  };

  const deleteCustomer = async (id) => {
    // Optimistic
    setCustomers(prev => prev.filter(c => (c.id || c._id) !== id));

    if (apiReady) {
      try {
        await apiFetch(`/customers/${id}`, { method: 'DELETE' });
      } catch (err) {
        await fetchCustomers();
        throw err;
      }
    }
  };

  const updateStock = async (id, newStock) => {
    await updateProduct(id, { stock: parseInt(newStock) || 0 });
  };

  // ── Settings updater ─────────────────────────────────────────────────────
  const updateSetting = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (apiReady) {
      try {
        await apiFetch(`/settings/${key}`, {
          method: 'PUT',
          body: JSON.stringify({ value }),
        });
      } catch (err) {
        console.error('Failed to save setting:', err.message);
      }
    }
  };

  // ── Cart ─────────────────────────────────────────────────────────────────
  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCartItems([]);

  const completeOrder = () => {
    setOrderCount(prev => prev + 1);
    clearCart();
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const isCODEligible = settings.cod_enabled !== false && orderCount >= 1;

  // Expose setProducts for legacy compatibility
  const setProducts = setProductsRaw;

  return (
    <StoreContext.Provider value={{
      products, setProducts,
      addProduct, updateProduct, deleteProduct, updateStock,
      orders, refreshOrders: fetchOrders,
      customers, refreshCustomers: fetchCustomers, deleteCustomer,
      settings, updateSetting,
      apiReady, loadingApi, refreshProducts: fetchProducts,
      cartItems, addToCart, removeFromCart, updateQty, clearCart,
      cartTotal, cartCount,
      completeOrder,
      createOrder,
      formatPrice,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
