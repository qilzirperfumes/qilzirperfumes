import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Shop.css';

const CONCENTRATIONS = ['Attar', 'Pure Oil', 'Parfum', 'Collection'];

const BRAND_NAME = 'Qilzir Atelier';

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="shop-filter-section">
      <button className="shop-filter-heading" onClick={() => setOpen(o => !o)}>
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="shop-filter-body">{children}</div>}
    </div>
  );
}

const Shop = () => {
  const { products, addToCart, formatPrice } = useStore();
  const [activeCategory, setActiveCategory]   = useState('all');
  const [searchQuery, setSearchQuery]         = useState('');
  const [concentrations, setConcentrations]   = useState([]);
  const [maxPrice, setMaxPrice]               = useState(100000);
  const [wishlist, setWishlist]               = useState([]);
  const [addedId, setAddedId]                 = useState(null);
  const [sidebarOpen, setSidebarOpen]         = useState(false);

  const categories = useMemo(() => {
    const list = [...new Set(products.map(p => p.category))].filter(Boolean);
    return [
      { label: 'All Collections', value: 'all' },
      { label: 'New Arrivals',    value: 'new' },
      ...list.map(c => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c }))
    ];
  }, [products]);

  const computedMaxPrice = useMemo(
    () => Math.max(...products.map(p => p.price), 100000),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter(p => {
      const catMatch =
        activeCategory === 'all'  ? true :
        activeCategory === 'new'  ? p.isNewArrival :
        p.category?.toLowerCase() === activeCategory.toLowerCase();

      const searchMatch = searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());

      const concMatch = concentrations.length === 0 ||
        concentrations.some(c => (p.concentration || '').toLowerCase() === c.toLowerCase() ||
          (p.category || '').toLowerCase() === c.toLowerCase());

      const priceMatch = p.price <= maxPrice;

      return catMatch && searchMatch && concMatch && priceMatch;
    });
  }, [products, activeCategory, searchQuery, concentrations, maxPrice]);

  const toggleConcentration = (c) => {
    setConcentrations(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const clearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setConcentrations([]);
    setMaxPrice(computedMaxPrice);
  };

  const hasActiveFilters = activeCategory !== 'all' ||
    searchQuery || concentrations.length > 0 || maxPrice < computedMaxPrice;

  return (
    <div className="shop-root">

      {/* ── BREADCRUMB + SEARCH BAR ── */}
      <div className="shop-topbar">
        <div className="shop-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>{categories.find(c => c.value === activeCategory)?.label || 'Shop'}</span>
        </div>
        <div className="shop-search-bar">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search for perfumes, brands and scents…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="shop-search-clear">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── FILTER TOGGLE + RESULTS (compact bar) ── */}
      <div className="shop-pills-row">
        <span className="shop-page-title">
          {categories.find(c => c.value === activeCategory)?.label || 'All Collections'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          {hasActiveFilters && (
            <button className="shop-clear-btn-inline" onClick={clearFilters}>
              <X size={11} /> Clear
            </button>
          )}
          <button
            className="shop-filter-toggle-btn"
            onClick={() => setSidebarOpen(o => !o)}
          >
            <SlidersHorizontal size={14} />
            Filters {hasActiveFilters && <span className="filter-dot" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE SIDEBAR BACKDROP ── */}
      {sidebarOpen && (
        <div
          className="shop-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="shop-layout">

        {/* ── LEFT SIDEBAR ── */}
        <aside className={`shop-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="shop-sidebar-header">
            <span>Filters</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {hasActiveFilters && (
                <button className="shop-clear-btn" onClick={clearFilters}>
                  Clear All
                </button>
              )}
              <button
                className="shop-sidebar-close"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Category */}
          <FilterSection title="Category">
            {categories.map(cat => (
              <label key={cat.value} className="shop-filter-row">
                <input
                  type="radio"
                  name="category"
                  checked={activeCategory === cat.value}
                  onChange={() => {
                    setActiveCategory(cat.value);
                    // Close sidebar on mobile after selecting
                    if (window.innerWidth < 900) setSidebarOpen(false);
                  }}
                />
                <span className="shop-filter-label">{cat.label}</span>
                <span className="filter-count">
                  {cat.value === 'all' ? products.length :
                   cat.value === 'new' ? products.filter(p => p.isNewArrival).length :
                   products.filter(p => p.category?.toLowerCase() === cat.value).length}
                </span>
              </label>
            ))}
          </FilterSection>

          {/* Concentration */}
          <FilterSection title="Concentration">
            {CONCENTRATIONS.map(c => (
              <label key={c} className="shop-filter-row">
                <input
                  type="checkbox"
                  checked={concentrations.includes(c)}
                  onChange={() => toggleConcentration(c)}
                />
                <span>{c}</span>
              </label>
            ))}
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price">
            <div className="shop-price-range">
              <input
                type="range"
                min={0}
                max={computedMaxPrice}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="shop-price-slider"
              />
              <div className="shop-price-labels">
                <span>₹0</span>
                <span className="price-val">{formatPrice(maxPrice)}</span>
              </div>
            </div>
          </FilterSection>

        </aside>

        {/* ── PRODUCT GRID ── */}
        <div className="shop-main">

          <div className="shop-results-bar">
            <span className="shop-results-count">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </span>
            {hasActiveFilters && (
              <button className="shop-clear-btn-inline" onClick={clearFilters}>
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="shop-empty">
              <ShoppingBag size={48} strokeWidth={1} />
              <p>No products match your filters.</p>
              <button onClick={clearFilters}>Clear All Filters</button>
            </div>
          ) : (
            <div className="shop-grid">
              {filtered.map((product, i) => {
                const originalPrice = product.originalPrice || Math.round(product.price * 1.2);
                const inWishlist    = wishlist.includes(product.id);
                const added         = addedId === product.id;
                const soldOut       = product.stock === 0;
                const hasOffer      = !!product.originalPrice;

                return (
                  <div
                    key={product.id}
                    className={`shop-card animate-fade-up delay-${Math.min(i + 1, 4)}00`}
                    style={{ animationFillMode: 'both' }}
                  >
                    {/* Image + badges */}
                    <Link to={`/product/${product.id}`} className="shop-card-img-wrap">
                      <img src={product.image} alt={product.name} className="shop-card-img" />

                      {/* Wishlist heart */}
                      <button
                        className={`shop-wishlist-btn ${inWishlist ? 'active' : ''}`}
                        onClick={e => toggleWishlist(product.id, e)}
                        aria-label="Add to wishlist"
                      >
                        <Heart size={16} fill={inWishlist ? '#C8A96A' : 'none'} />
                      </button>

                      {/* Badges */}
                      <div className="shop-card-badges">
                        {product.isNewArrival && (
                          <span className="badge badge-new">New Arrival</span>
                        )}
                        {product.tag && product.tag !== 'New Arrival' && (
                          <span className="badge badge-tag">{product.tag}</span>
                        )}
                        {soldOut && <span className="badge badge-soldout">Sold Out</span>}
                        {!soldOut && originalPrice > product.price && (
                          <span className="badge badge-sale">Sale</span>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="shop-card-info">
                      <div className="shop-card-brand">{BRAND_NAME}</div>
                      <h3 className="shop-card-name">{product.name}</h3>
                      <div className="shop-card-meta">{product.size || 100}{product.unit || 'ml'} • Extrait de Parfum</div>
                      <div className="shop-card-pricing">
                        <span className="price-current">From {formatPrice(product.price)}</span>
                        {hasOffer && <span className="price-original">{formatPrice(originalPrice)}</span>}
                        {hasOffer && !soldOut && <span className="price-sale-tag">Sale</span>}
                      </div>
                      <button
                        className={`shop-atc-btn ${added ? 'added' : ''} ${soldOut ? 'disabled' : ''}`}
                        onClick={e => !soldOut && handleAddToCart(product, e)}
                        disabled={soldOut}
                      >
                        <ShoppingBag size={14} />
                        {soldOut ? 'Out of Stock' : added ? 'Added ✓' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
