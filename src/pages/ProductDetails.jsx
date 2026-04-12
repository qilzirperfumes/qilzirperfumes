import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  ChevronLeft, ChevronRight, ShoppingBag, 
  Droplets, Wind, RefreshCw, Star, ArrowLeft
} from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, formatPrice, completeOrder } = useStore();
  const [product, setProduct] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    // Robust Matching Logic
    const p = products.find(item => {
      const dbId = String(item._id || '');
      const slugId = String(item.id || '');
      return dbId === id || slugId === id;
    });

    if (p) {
      setProduct(p);
      window.scrollTo(0, 0);
    }
  }, [id, products]);


  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-20">
      <h2 className="font-heading text-4xl mb-6">Fragrance Not Found</h2>
      <Link to="/shop" className="btn btn-primary">Return to Collection</Link>
    </div>
  );

  const allImages = [product.image, ...(product.extraImages || [])];
  const nextImage = () => setActiveImageIdx((activeImageIdx + 1) % allImages.length);
  const prevImage = () => setActiveImageIdx((activeImageIdx - 1 + allImages.length) % allImages.length);

  return (
    <div className="product-details-page">
      <div className="container py-20">
        
        {/* Breadcrumb */}
        <div className="mb-12">
          <Link to="/shop" className="flex items-center gap-2 text-mutted hover:text-gold transition-colors text-xs tracking-[0.2em] uppercase">
            <ArrowLeft size={14} /> Back to Collection
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-20">
          
          {/* ── LEFT: GALLERY ── */}
          <div className="product-gallery">
            <div className="bg-surface p-6 md:p-10 relative overflow-hidden group border border-[#EBE9E4] aspect-[4/5] flex items-center justify-center">
              <img 
                src={allImages[activeImageIdx]} 
                alt={product.name} 
                className="max-h-full object-contain"
              />
              
              {allImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="gallery-nav-btn left-6">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextImage} className="gallery-nav-btn right-6">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-6">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-square border-2 transition-all p-2 bg-surface ${activeImageIdx === idx ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: DETAILS ── */}
          <div className="product-details-content">
            <div className="product-meta-header mb-10">
              {product.collection && <span className="text-gold tracking-[0.3em] uppercase text-xs mb-2 block">{product.collection} COLLECTION</span>}
              <h1 className="font-heading text-5xl md:text-6xl mb-6">{product.name}</h1>
              <div className="flex items-baseline gap-6 mb-8">
                <span className="text-3xl font-light">{formatPrice(product.price)}</span>
                {product.originalPrice && <span className="text-mutted line-through text-lg">{formatPrice(product.originalPrice)}</span>}
              </div>
            </div>

            <div className="product-info-grid mb-12 border-y border-[#E0DCD3] py-8">
              <div className="info-row">
                <span className="info-label">TYPE</span>
                <span className="info-value uppercase">{product.type || 'PURE ATTAR'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">COLLECTION</span>
                <span className="info-value uppercase">{product.collection || 'SIGNATURE'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">PROFILE</span>
                <span className="info-value uppercase">{product.category || 'ORIENTAL'}</span>
              </div>
            </div>

            <p className="product-description text-lg leading-relaxed text-mutted mb-10">
              {product.description}
            </p>

            {/* Olfactory Journey */}
            <div className="mb-12">
               <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-8">Olfactory Journey</h3>
               <div className="space-y-6">
                  <div className="note-card">
                    <span className="note-type">TOP</span>
                    <span className="note-content">{product.notes?.top || 'Bergamot, Saffron'}</span>
                  </div>
                  <div className="note-card">
                    <span className="note-type">HEART</span>
                    <span className="note-content">{product.notes?.heart || 'Oud, Rose'}</span>
                  </div>
                  <div className="note-card">
                    <span className="note-type">BASE</span>
                    <span className="note-content">{product.notes?.base || 'Vanilla, Musk'}</span>
                  </div>
               </div>
            </div>

            {/* Add to Cart Section */}
            <div className="add-to-cart-container bg-surface p-8 border border-[#EBE9E4] mb-12">
               <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                 <div className="qty-picker">
                   <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-btn">-</button>
                   <span className="qty-value">{qty}</span>
                   <button onClick={() => setQty(qty + 1)} className="qty-btn">+</button>
                 </div>
                 <button onClick={() => addToCart(product, qty)} className="btn btn-gold flex-1 py-5 text-lg w-full">
                   ADD TO CART
                 </button>
               </div>
               <div className="text-center py-4 bg-[#4A1D33] text-white tracking-widest text-[10px] uppercase">
                  Free Shipping from ₹15,000 · Estimated Delivery 2-5 Working Days
               </div>
            </div>
          </div>

        </div>

        {/* ── CONNOISSEUR EXPERIENCE ── */}
        <div className="mt-40 pt-20 border-t border-[#E0DCD3]">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl mb-4">The Connoisseur Experience</h2>
            <p className="text-mutted tracking-widest uppercase text-xs">Included with every Qilzir flacon</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             {(product.extras && product.extras.length > 0 ? product.extras : ['Pure Extract', 'Scent Card', 'Gifting Case']).map((extra, idx) => (
               <div key={idx} className="text-center p-12 bg-surface">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    {idx === 0 ? <Droplets size={20} className="text-gold" /> : 
                     idx === 1 ? <Wind size={20} className="text-gold" /> : 
                     <RefreshCw size={20} className="text-gold" />}
                  </div>
                  <h3 className="font-heading text-xl mb-3">{extra}</h3>
                  <p className="text-mutted text-sm leading-relaxed">Hallmark of craft.</p>
               </div>
             ))}
          </div>
        </div>

        {/* ── VIDEO SECTION ── */}
        {product.videoUrl && (
          <div className="product-video-section mt-40">
            <div className="text-center mb-16 max-w-2xl mx-auto">
               <h2 className="font-heading text-5xl mb-6">A True Innovation</h2>
               <p className="text-mutted italic text-lg leading-relaxed">"Pushing the boundaries of traditional perfumery with every droplet of artisan essence."</p>
            </div>
            <div className="relative aspect-video w-full overflow-hidden bg-black shadow-2xl">
              <iframe 
                src={product.videoUrl} 
                title={product.name} 
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
