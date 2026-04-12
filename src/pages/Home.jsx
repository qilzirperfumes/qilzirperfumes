import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import './Home.css';

const Home = () => {
  useEffect(() => {
    // Simple intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: 'url(/hero_luxury_fragrance.png)' }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <p className="hero-subtitle uppercase tracking-widest animate-fade-up">Welcome to your signature scent</p>
          <h1 className="hero-title font-heading animate-fade-up delay-100">Experience Qilzir<br/>Beyond The Bottle</h1>
          <div className="hero-ctas animate-fade-up delay-200">
            <Link to="/shop" className="btn btn-primary">Shop Now</Link>
            <Link to="/about" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>Explore Fragrance</Link>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="featured-section section-padding container relative">
        <div className="grid md-grid-cols-2 gap-12 items-center">
          <div className="featured-image-wrapper animate-on-scroll reveal">
            <img src="/silk_amber_attar.png" alt="Silk Amber Attar" className="featured-image parallax-img" />
            <div className="gold-accent-box"></div>
          </div>
          <div className="featured-info animate-on-scroll fade-left">
            <span className="text-gold tracking-widest text-sm uppercase font-bold">Featured Arrival</span>
            <h2 className="font-heading text-4xl mt-4 mb-6 text-black">Silk Amber</h2>
            <p className="text-mutted mb-8 text-lg">
              A masterclass in modern perfumery. Silk Amber weaves rich Omani frankincense with creamy Madagascar vanilla and warm spices. An intoxicating, sensual luxury attar designed to leave a mesmerizing trail.
            </p>
            <Link to="/product/silk-amber" className="btn btn-gold group">
              Discover Silk Amber <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="story-section section-padding relative">
        <div className="story-bg parallax-bg"></div>
        <div className="container relative z-10 text-center animate-on-scroll fade-up">
          <h2 className="font-heading text-4xl mb-6">The Essence of Qilzir</h2>
          <p className="text-lg max-w-2xl mx-auto mb-10 text-mutted">
            Born from the ancient traditions of Middle Eastern perfumery, Qilzir is a minimalist expression of absolute luxury. We use only the rarest, most precious ingredients to craft attars that speak to the soul.
          </p>
          <Link to="/about" className="btn btn-outline">Read Our Story</Link>
        </div>
      </section>

      {/* Experience Kit Preview */}
      <section className="experience-kit-section section-padding container">
        <div className="text-center mb-16 animate-on-scroll fade-up">
          <span className="text-gold tracking-widest text-sm uppercase">Curated Discovery</span>
          <h2 className="font-heading text-4xl mt-4">The Experience Kit</h2>
        </div>
        
        <div className="grid md-grid-cols-3 gap-8">
          <div className="kit-item animate-on-scroll fade-up delay-100">
            <div className="kit-icon-wrapper">
              <span className="text-2xl">01</span>
            </div>
            <h3 className="font-heading text-xl mb-3">Pure Attar</h3>
            <p className="text-mutted text-sm">A highly concentrated 10ml crystal vial of our signature scent for deep, intimate wear.</p>
          </div>
          <div className="kit-item animate-on-scroll fade-up delay-200">
            <div className="kit-icon-wrapper">
              <span className="text-2xl">02</span>
            </div>
            <h3 className="font-heading text-xl mb-3">Ceramic Diffuser</h3>
            <p className="text-mutted text-sm">An elegant passive diffuser to gently scent your personal space and wardrobe passively.</p>
          </div>
          <div className="kit-item animate-on-scroll fade-up delay-300">
            <div className="kit-icon-wrapper">
              <span className="text-2xl">03</span>
            </div>
            <h3 className="font-heading text-xl mb-3">Scent Profile</h3>
            <p className="text-mutted text-sm">A beautifully letterpressed card detailing the exact notes, longevity, and origin of ingredients.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section section-padding bg-surface">
        <div className="container">
          <div className="text-center mb-16 animate-on-scroll fade-up">
            <h2 className="font-heading text-3xl">Connoisseur Reviews</h2>
          </div>
          
          <div className="grid md-grid-cols-3 gap-8">
            {[1, 2, 3].map((item, i) => (
              <div key={item} className={`testimonial-card animate-on-scroll fade-up delay-${i+1}00`}>
                <div className="flex gap-1 text-gold mb-4">
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                </div>
                <p className="italic text-mutted mb-6">"An absolute masterpiece. The projection is incredible, and the dry down is the most beautiful vanilla amber I've ever experienced."</p>
                <div className="testimonial-author">
                  <span className="font-bold text-sm uppercase tracking-wide">— AE.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
