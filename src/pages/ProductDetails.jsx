import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, RefreshCw, Droplets, Wind, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, formatPrice } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Find the actual product from our store
  const product = useMemo(() => {
    return products.find(p => p.id === id);
  }, [products, id]);

  // If product not found, we can show a loader or redirect
  if (!product) {
    return (
      <div className="container py-40 text-center">
        <h2 className="font-heading text-3xl mb-4">Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const allImages = [product.image, ...(product.extraImages || [])].filter(Boolean);
  const hasOffer = !!product.originalPrice;
  const originalPrice = product.originalPrice || Math.round(product.price * 1.2);
  const soldOut = product.stock === 0;

  const handleAddToCart = () => {
    if (soldOut) return;
    addToCart(product, quantity);
    // Optional: navigate to cart or show success
  };

  const handleBuyNow = () => {
    if (soldOut) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="product-page">
      <div className="container py-20">
        
        {/* Breadcrumbs */}
        <nav className="mb-10 text-xs uppercase tracking-widest text-mutted flex gap-2">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          <span>/</span>
          <span className="text-black font-bold">{product.name}</span>
        </nav>

        <div className="grid md-grid-cols-2 gap-16 items-start">
          
          {/* ── LEFT: GALLERY ── */}
          <div className="product-gallery animate-fade-up">
            <div className="bg-surface p-6 md:p-10 relative overflow-hidden group border border-[#EBE9E4]">
              <img 
                src={allImages[activeImageIdx]} 
                alt={product.name} 
                className="w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Image Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveImageIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isNewArrival && <span className="bg-gold text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase">New Arrival</span>}
                {hasOffer && !soldOut && <span className="bg-black text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase">Special Offer</span>}
                {soldOut && <span className="bg-error text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase">Sold Out</span>}
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-20 border-2 transition-all flex-shrink-0 ${activeImageIdx === idx ? 'border-gold p-1' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: INFO ── */}
          <div className="product-info animate-fade-up delay-200">
            <div className="mb-2 text-gold text-xs font-bold tracking-[0.2em] uppercase">Qilzir Perfumes</div>
            <h1 className="font-heading text-4xl md:text-5xl mb-1">{product.name}</h1>
            <div className="text-[10px] text-mutted uppercase font-bold tracking-[0.3em] mb-6">
              Full Flacon • {product.size || 100}{product.unit || 'ml'}
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl text-black font-medium">{formatPrice(product.price)}</span>
              {hasOffer && (
                <span className="text-xl text-mutted line-through">{formatPrice(originalPrice)}</span>
              )}
            </div>
            
            <div className="flex gap-1 text-gold mb-8">
              {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={14} />)}
              <span className="text-black text-xs ml-2 font-bold tracking-widest uppercase opacity-60">(Reviews coming soon)</span>
            </div>

            <p className="text-lg leading-relaxed mb-8 text-mutted">{product.description || 'No description available for this exquisite fragrance.'}</p>

            <div className="product-details-notes mt-10 mb-10 pt-8 border-t border-[#E0DCD3]">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-black mb-8 opacity-90">Olfactory Journey</h3>
              <div className="flex flex-col gap-8">
                <div className="note-item group">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold transition-transform group-hover:scale-125"></span>
                    <h4 className="font-bold uppercase tracking-[0.2em] text-[10px] text-mutted">Top Notes</h4>
                  </div>
                  <p className="text-sm font-medium pl-5 leading-relaxed text-black/80">{product.notes?.top || 'Bergamot, Pink Pepper, Saffron'}</p>
                </div>

                <div className="note-item group">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold transition-transform group-hover:scale-125"></span>
                    <h4 className="font-bold uppercase tracking-[0.2em] text-[10px] text-mutted">Heart Notes</h4>
                  </div>
                  <p className="text-sm font-medium pl-5 leading-relaxed text-black/80">{product.notes?.heart || 'Damascus Rose, Omani Oud, Cedarwood'}</p>
                </div>

                <div className="note-item group">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold transition-transform group-hover:scale-125"></span>
                    <h4 className="font-bold uppercase tracking-[0.2em] text-[10px] text-mutted">Base Notes</h4>
                  </div>
                  <p className="text-sm font-medium pl-5 leading-relaxed text-black/80">{product.notes?.base || 'Madagascar Vanilla, Ambergris, Oakmoss'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-6">
              <div className="quantity-control flex items-center border border-[#E0DCD3]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="px-5 py-4 hover:text-gold transition-colors"
                  disabled={soldOut}
                >-</button>
                <span className="px-4 py-4 min-w-[50px] text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="px-5 py-4 hover:text-gold transition-colors"
                  disabled={soldOut}
                >+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={soldOut}
                className={`btn ${soldOut ? 'btn-disabled cursor-not-allowed opacity-50' : 'btn-primary'} flex-1 flex justify-center items-center gap-2 py-4`}
              >
                <ShoppingBag size={18} /> {soldOut ? 'Sold Out' : 'Add To Cart'}
              </button>
            </div>
            
            <button 
              onClick={handleBuyNow}
              disabled={soldOut}
              className={`btn ${soldOut ? 'hidden' : 'btn-gold'} w-full flex justify-center items-center gap-2 mb-8 py-4`}
            >
              Express Checkout
            </button>

            <div className="product-features grid grid-cols-3 gap-2 text-center mt-12 bg-surface p-6 rounded-sm border border-[#EBE9E4]">
              <div className="flex flex-col items-center">
                <Wind size={20} className="text-gold mb-2" />
                <span className="text-[9px] uppercase font-bold tracking-widest">High Projection</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw size={20} className="text-gold mb-2" />
                <span className="text-[9px] uppercase font-bold tracking-widest">24H Longevity</span>
              </div>
              <div className="flex flex-col items-center">
                <Droplets size={20} className="text-gold mb-2" />
                <span className="text-[9px] uppercase font-bold tracking-widest">Pure Extrait</span>
              </div>
            </div>

          </div>
        </div>

        {/* The Experience Bar */}
        <div className="mt-32 pt-20 border-t border-[#E0DCD3]">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl">The Connoisseur Experience</h2>
            <p className="text-mutted mt-3 tracking-widest uppercase text-xs">Included with every {product.size || 10} {product.unit || 'ml'} flacon</p>
          </div>
          <div className="grid md-grid-cols-3 gap-8">
             <div className="text-center p-10 bg-surface border border-transparent hover:border-gold/20 transition-all">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Droplets size={20} className="text-gold" />
                </div>
                <h3 className="font-heading text-xl mb-3">Pure Extract</h3>
                <p className="text-mutted text-sm leading-relaxed">Concentrated attar oil crafted with zero alcohol for a skin-intimate, long-lasting aura.</p>
             </div>
             <div className="text-center p-10 bg-surface border border-transparent hover:border-gold/20 transition-all">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Wind size={20} className="text-gold" />
                </div>
                <h3 className="font-heading text-xl mb-3">Scent Card</h3>
                <p className="text-mutted text-sm leading-relaxed">A detailed breakdown of the fragrance pyramid, origin of ingredients, and usage guide.</p>
             </div>
             <div className="text-center p-10 bg-surface border border-transparent hover:border-gold/20 transition-all">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <RefreshCw size={20} className="text-gold" />
                </div>
                <h3 className="font-heading text-xl mb-3">Gifting Case</h3>
                <p className="text-mutted text-sm leading-relaxed">Arrives in a signature velvet-lined presentation box, perfect for preservation or gifting.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
