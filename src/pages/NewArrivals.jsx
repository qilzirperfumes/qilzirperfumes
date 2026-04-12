import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, SlidersHorizontal, ShoppingBag, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './NewArrivals.css';

const BRAND_NAME = 'Qilzir Atelier';

const NewArrivals = () => {
  const { products, settings, addToCart, formatPrice } = useStore();
  const bannerImg = settings.new_arrivals_banner || '/hero_luxury_fragrance.png';

  const newArrivals = useMemo(() => {
    return products.filter(p => p.isNewArrival);
  }, [products]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="new-arrivals-root">
      
      {/* ── BREADCRUMB ── */}
      <div className="arrivals-breadcrumb container pt-10">
        <Link to="/">Home</Link>
        <ChevronRight size={10} />
        <span>New Arrivals</span>
      </div>

      {/* ── HERO HEADER ── */}
      <header className="arrivals-hero-header container">
        <h2 className="arrivals-top-label animate-fade-up">New Arrivals</h2>
        
        <div className="arrivals-banner-section animate-fade-up delay-100">
          <div className="arrivals-banner-container">
            <img src={bannerImg} alt="New Arrival Collection" className="arrivals-banner-img" />
            <div className="arrivals-banner-overlay" />
          </div>
        </div>

        <div className="arrivals-intro-row animate-fade-up delay-200">
           <h1 className="arrivals-main-heading">Explore the latest releases from Qilzir.</h1>
           <p className="arrivals-main-text">
             The most recent Qilzir perfume creations. With beauty and inspiration to be found all around us, there is always more to create — and more for you to discover.
           </p>
        </div>
      </header>

      {/* ── COLLECTION BAR ── */}
      <div className="arrivals-collection-bar container">
        <div className="collection-count">
          Showing <strong>{newArrivals.length}</strong> Limited Editions
        </div>
        <div className="arrivals-filter-ref">
          Filter <SlidersHorizontal size={12} />
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="container arrivals-results-container">
        {newArrivals.length === 0 ? (
          <div className="shop-empty py-20 text-center">
            <h3 className="font-heading text-2xl mb-4">No New Arrivals</h3>
            <p className="text-mutted mb-8">All current releases have been moved to the primary collection.</p>
            <Link to="/shop" className="btn btn-gold px-10">Visit Shop</Link>
          </div>
        ) : (
          <div className="shop-grid">
            {newArrivals.map((product, i) => {
              const originalPrice = product.originalPrice || Math.round(product.price * 1.2);
              const soldOut = product.stock === 0;
              const hasOffer = !!product.originalPrice;

              return (
                <div key={product.id} className={`shop-card animate-fade-up delay-${Math.min((i % 4) + 1, 4)}00`} style={{ animationFillMode: 'both' }}>
                  <Link to={`/product/${product.id}`} className="shop-card-img-wrap">
                    <img src={product.image} alt={product.name} className="shop-card-img" />
                    
                    <div className="arrivals-badge">NEW IN</div>

                    <button className="shop-wishlist-btn" aria-label="Add to wishlist">
                      <Heart size={15} />
                    </button>
                    
                    <div className="shop-card-badges">
                       {soldOut && <span className="badge badge-soldout">Sold Out</span>}
                    </div>
                  </Link>

                  <div className="shop-card-info">
                    <div className="shop-card-brand">{BRAND_NAME}</div>
                    <h3 className="shop-card-name">{product.name}</h3>
                    <div className="shop-card-pricing">
                      <span className="price-current">{formatPrice(product.price)}</span>
                      {hasOffer && <span className="price-original">{formatPrice(originalPrice)}</span>}
                      {hasOffer && !soldOut && <span className="price-sale-tag">Offer</span>}
                    </div>
                    <button
                        className={`shop-atc-btn ${soldOut ? 'disabled' : ''}`}
                        onClick={e => !soldOut && handleAddToCart(product, e)}
                        disabled={soldOut}
                      >
                        <ShoppingBag size={14} />
                        {soldOut ? 'Out of Stock' : 'Add to Bag'}
                      </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default NewArrivals;
