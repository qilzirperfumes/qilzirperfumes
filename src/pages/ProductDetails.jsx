import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  ChevronLeft, ChevronRight, ShoppingBag, 
  Droplets, Wind, RefreshCw, Star, ArrowLeft,
  ChevronDown, Search, Globe, ShieldCheck
} from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, formatPrice } = useStore();
  const [product, setProduct] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    if (!products || products.length === 0) return;
    
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

  const allImages = [product.image, ...(product.extraImages || [])].filter(Boolean);
  const nextImage = () => setActiveImageIdx((activeImageIdx + 1) % allImages.length);
  const prevImage = () => setActiveImageIdx((activeImageIdx - 1 + allImages.length) % allImages.length);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return (
    <div className="xerjoff-inspired-page animate-fade-in">
      
      {/* ── TOP NAVIGATION CONTEXT ── */}
      <div className="product-top-nav container">
        <Link to="/shop" className="back-link">
           <ArrowLeft size={14} /> <span>BACK TO COLLECTION</span>
        </Link>
        <div className="breadcrumb-info">
           ARTISAN ARCHIVE / {product.collection || 'SIGNATURE'} / {product.name}
        </div>
      </div>

      <div className="main-product-container container">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* ── LEFT: IMMERSIVE GALLERY ── */}
          <div className="lg:col-span-7 gallery-stage">
            <div className="main-visual-wrap shadow-xl">
              <img 
                src={allImages[activeImageIdx]} 
                alt={product.name} 
                className="main-visual"
              />
              {allImages.length > 1 && (
                <div className="gallery-nav">
                  <button onClick={prevImage} className="nav-circ"><ChevronLeft size={20} /></button>
                  <button onClick={nextImage} className="nav-circ"><ChevronRight size={20} /></button>
                </div>
              )}
            </div>
            
            <div className="thumbnails-strip mt-8">
              {allImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`thumb-btn ${activeImageIdx === idx ? 'active' : ''}`}
                >
                  <img src={img} alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: MASTER METADATA ── */}
          <div className="lg:col-span-5 info-stage pt-4">
             <div className="product-header-luxury mb-10">
                <span className="scent-label">{product.collection || 'SIGNATURE'} COLLECTION</span>
                <h1 className="product-title-bold uppercase tracking-tight">{product.name}</h1>
                <div className="price-display mt-4">
                   <span className="price-current">{formatPrice(product.price)}</span>
                   {product.originalPrice > product.price && (
                      <span className="price-original">{formatPrice(product.originalPrice)}</span>
                   )}
                </div>
             </div>

             <div className="metadata-table mb-12">
                <div className="meta-item">
                   <span className="meta-label">TYPE</span>
                   <span className="meta-val">{product.type || 'PURE ATTAR'}</span>
                </div>
                <div className="meta-item">
                   <span className="meta-label">SCENT PROFILE</span>
                   <span className="meta-val">{product.category || 'ORIENTAL WOOD'}</span>
                </div>
             </div>

             {product.description && product.description.toLowerCase() !== 'nothing' && (
                <div className="narrative-section mb-12">
                   <p>{product.description}</p>
                </div>
             )}

             {/* Tabbed Experience */}
             <div className="experience-tabs mb-12">
                <div className="tabs-header">
                   <button 
                      className={`tab-link ${activeTab === 'notes' ? 'active' : ''}`}
                      onClick={() => setActiveTab('notes')}
                   >
                      SCENT NOTES
                   </button>
                   <button 
                      className={`tab-link ${activeTab === 'details' ? 'active' : ''}`}
                      onClick={() => setActiveTab('details')}
                   >
                      TECHNICAL DETAILS
                   </button>
                </div>

                <div className="tabs-content py-8">
                   {activeTab === 'notes' ? (
                      <div className="scent-notes-grid">
                         <div className="note-group">
                            <span className="note-heading">TOP</span>
                            <p>{product.notes?.top || 'Fresh Saffron, White Bergamot, Spice'}</p>
                         </div>
                         <div className="note-group">
                            <span className="note-heading">HEART</span>
                            <p>{product.notes?.heart || 'Cambodian Oud, Damascus Rose, Jasmine'}</p>
                         </div>
                         <div className="note-group">
                            <span className="note-heading">BASE</span>
                            <p>{product.notes?.base || 'Madagascar Vanilla, Crystal Musk, Amber'}</p>
                         </div>
                      </div>
                   ) : (
                      <div className="technical-list">
                         <div className="tech-row"><span>Volume</span> <span>{product.size}{product.unit || 'ml'}</span></div>
                         <div className="tech-row"><span>Intensity</span> <span>Extrait (30%+)</span></div>
                         <div className="tech-row"><span>Origin</span> <span>House Archives</span></div>
                         <div className="tech-row"><span>Longevity</span> <span>12+ Hours</span></div>
                      </div>
                   )}
                </div>
             </div>

             {/* Purchase Bloc */}
             <div className="purchase-bloc sticky-pos">
                <div className="order-controls mb-6">
                   <div className="qty-luxury">
                      <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                      <span>{qty}</span>
                      <button onClick={() => setQty(qty + 1)}>+</button>
                   </div>
                   <button onClick={() => addToCart(product, qty)} className="atc-btn-luxury">
                      ADD TO CART
                   </button>
                </div>
                <div className="shipping-banner-plum">
                   FREE WORLDWIDE SHIPPING FROM ₹15,000
                </div>
             </div>
          </div>
        </div>

        {/* ── DEEP IMMERSION (Ingredient Visuals) ── */}
        <div className="mt-40 grid md:grid-cols-2 gap-20 items-center">
           <div className="immersion-text">
              <span className="scent-label">INGREDIENT HIGHLIGHT</span>
              <h2 className="font-heading text-6xl mb-8">Artisan Sourcing</h2>
              <p className="text-xl font-light text-mutted leading-relaxed">
                 We select only the most precious raw materials from the ancient silk road. Our oils are aged 
                 for 24 months in complete darkness to achieve a depth that transcends traditional perfumery.
              </p>
           </div>
           <div className="immersion-visual shadow-2xl overflow-hidden aspect-square">
              <img src="/hero_luxury_fragrance.png" alt="Sourcing" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
           </div>
        </div>

        {/* ── CINEMATIC FILM ── */}
        {product.videoUrl && (
          <div className="mt-40 concept-film-section">
             <div className="text-center mb-16">
                <span className="scent-label">COLLECTION FILM</span>
                <h2 className="font-heading text-5xl mt-4 uppercase">Visual Journey</h2>
             </div>
             <div className="video-window relative aspect-video bg-black shadow-2xl">
                <iframe 
                  src={getEmbedUrl(product.videoUrl)} 
                  title="Film"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
             </div>
          </div>
        )}

        {/* ── EXPERIENCE CARDS ── */}
        <div className="mt-40 experience-led-grid grid md:grid-cols-3 gap-10">
           <div className="exp-card border border-[#E0DCD3] p-12 text-center">
              <Droplets className="mx-auto text-[#C8B078] mb-6" size={32} />
              <h3 className="font-heading text-2xl mb-4">Pure Extract</h3>
              <p className="text-sm text-mutted">No alcohol diluents. Just pure essential essence.</p>
           </div>
           <div className="exp-card border border-[#E0DCD3] p-12 text-center">
              <Globe className="mx-auto text-[#C8B078] mb-6" size={32} />
              <h3 className="font-heading text-2xl mb-4">Ethical Source</h3>
              <p className="text-sm text-mutted">Direct trade with the world's most elite plantations.</p>
           </div>
           <div className="exp-card border border-[#E0DCD3] p-12 text-center">
              <ShieldCheck className="mx-auto text-[#C8B078] mb-6" size={32} />
              <h3 className="font-heading text-2xl mb-4">Archive Seal</h3>
              <p className="text-sm text-mutted">Guaranteed authenticity and vintage heritage.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
