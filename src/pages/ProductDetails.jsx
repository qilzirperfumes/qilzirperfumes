import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  ChevronLeft, ChevronRight, ShoppingBag, 
  Droplets, Wind, RefreshCw, Star, ArrowLeft,
  ShieldCheck, Globe, Zap, CheckCircle2
} from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, formatPrice } = useStore();
  const [product, setProduct] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const p = products.find(item => String(item._id || item.id) === id);
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

  const allImages = [product.image, ...(product.extraImages || [])].filter(Boolean);
  const nextImage = () => setActiveImageIdx((activeImageIdx + 1) % allImages.length);
  const prevImage = () => setActiveImageIdx((activeImageIdx - 1 + allImages.length) % allImages.length);

  return (
    <div className="xerjoff-masterpiece-page animate-fade-in">
      
      {/* ── STICKY AD-TO-CART BAR (Xerjoff Style) ── */}
      <div className={`sticky-atc-bar ${scrolled ? 'visible' : ''}`}>
         <div className="container flex justify-between items-center h-full">
            <div className="flex items-center gap-4">
               <img src={product.image} alt="mini" className="w-12 h-12 object-contain bg-white p-1" />
               <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest">{product.name}</div>
                  <div className="text-xs text-gold font-bold">{formatPrice(product.price)}</div>
               </div>
            </div>
            <button onClick={() => addToCart(product, qty)} className="sticky-atc-btn">
               ADD TO CART
            </button>
         </div>
      </div>

      <div className="product-layout-luxury">
        
        {/* ── LEFT: CINEMATIC GALLERY (60% Width) ── */}
        <div className="luxury-gallery-section">
          <div className="main-display group">
            <img 
              src={allImages[activeImageIdx]} 
              alt={product.name} 
              className="display-img"
            />
            {allImages.length > 1 && (
              <div className="gallery-arrows">
                <button onClick={prevImage} className="arrow-btn left-10"><ChevronLeft size={24} /></button>
                <button onClick={nextImage} className="arrow-btn right-10"><ChevronRight size={24} /></button>
              </div>
            )}
          </div>
          <div className="thumbnails-wrapper container mx-auto flex justify-center gap-4 mt-12 pb-20">
            {allImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`thumb-box ${activeImageIdx === idx ? 'active' : ''}`}
              >
                <img src={img} alt="thumb" />
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: ELITE INFORMATION (40% Width) ── */}
        <div className="luxury-info-section">
           <div className="info-scroll-box">
              <div className="info-header mb-12">
                 <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C8B078]">
                       {product.collection || 'CASAMORATI'}
                    </span>
                 </div>
                 <h1 className="text-6xl font-heading mb-6 tracking-tight uppercase leading-[0.9]">{product.name}</h1>
                 <div className="flex items-baseline gap-6 mb-8">
                    <span className="text-2xl font-light">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                       <span className="text-lg text-mutted line-through opacity-40">{formatPrice(product.originalPrice)}</span>
                    )}
                 </div>
              </div>

              {/* Olfactory Pyramid (Vertical) */}
              <div className="olfactory-pyramid mb-16">
                 <h3 className="section-title-gold mb-10">OLFACTORY PYRAMID</h3>
                 <div className="pyramid-steps">
                    <div className="pyramid-step">
                       <div className="step-label">HEAD NOTES</div>
                       <div className="step-content">{product.notes?.top || 'Bergamot, Saffron'}</div>
                    </div>
                    <div className="pyramid-step">
                       <div className="step-label">HEART NOTES</div>
                       <div className="step-content">{product.notes?.heart || 'Oud, Rose'}</div>
                    </div>
                    <div className="pyramid-step">
                       <div className="step-label">BASE NOTES</div>
                       <div className="step-content">{product.notes?.base || 'Vanilla, Musk'}</div>
                    </div>
                 </div>
              </div>

              {/* Meta Stats */}
              <div className="meta-stats-grid mb-16">
                 <div className="stat-box">
                    <label>CONCENTRATION</label>
                    <span>Extrait de Parfum</span>
                 </div>
                 <div className="stat-box">
                    <label>FRAGRANCE FAMILY</label>
                    <span>{product.category || 'Woody'}</span>
                 </div>
                 <div className="stat-box">
                    <label>VOLUME</label>
                    <span>{product.size}{product.unit || 'ml'}</span>
                 </div>
                 <div className="stat-box">
                    <label>LONGEVITY</label>
                    <span>12+ Hours</span>
                 </div>
              </div>

              {/* Action Bloc */}
              <div className="actions-bloc mb-16">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="qty-selector-luxury">
                       <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                       <span>{qty}</span>
                       <button onClick={() => setQty(qty + 1)}>+</button>
                    </div>
                    <button onClick={() => addToCart(product, qty)} className="atc-btn-black">
                       ADD TO CART
                    </button>
                 </div>
                 <div className="trust-badges flex justify-between py-6 border-y border-[#F0F0F0]">
                    <div className="badge-item"><ShieldCheck size={14} /> <span>SECURE CHECKOUT</span></div>
                    <div className="badge-item"><Globe size={14} /> <span>WORLDWIDE SHIPPING</span></div>
                    <div className="badge-item"><Zap size={14} /> <span>EXPRESS DELIVERY</span></div>
                 </div>
              </div>

              {product.description && product.description.toLowerCase() !== 'nothing' && (
                 <div className="description-narrative mb-16">
                    <h3 className="section-title-gold mb-6">DESCRIPTION</h3>
                    <p className="text-lg font-light leading-relaxed text-mutted">{product.description}</p>
                 </div>
              )}
           </div>
        </div>

      </div>

      {/* ── THE EXPERIENCE ── */}
      <div className="experience-section py-40 border-t border-[#F0F0F0]">
         <div className="container">
            <div className="max-w-3xl mb-24">
               <h4 className="section-title-gold mb-4">THE UNBOXING RITUAL</h4>
               <h2 className="text-5xl font-heading mb-8">A Journey of Exclusivity</h2>
               <p className="text-xl text-mutted font-light">
                  From the moment you break the seal, the House of Qilzir ensures every sense is elevated. 
                  Our flacons are nestled in hand-stitched velvet and accompanied by a master provenance card.
               </p>
            </div>
            <div className="grid md:grid-cols-3 gap-16">
               <div className="ritual-card">
                  <div className="icon-wrap"><Droplets /></div>
                  <h3>Artisan Concentrate</h3>
                  <p>Highest absolute concentration for unparalleled depth and skin longevity.</p>
               </div>
               <div className="ritual-card">
                  <div className="icon-wrap"><Wind /></div>
                  <h3>Scent Portfolio</h3>
                  <p>A detailed sensory map detailing the origin of every ingredient in your flacon.</p>
               </div>
               <div className="ritual-card">
                  <div className="icon-wrap"><CheckCircle2 /></div>
                  <h3>House Seal</h3>
                  <p>Each flacon is numbered and quality-verified by our head perfumer.</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default ProductDetails;
