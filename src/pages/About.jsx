import React, { useEffect } from 'react';
import './About.css';

const About = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.rev-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      
      {/* ── CINEMATIC HERO ── */}
      <section className="about-hero" style={{backgroundImage: 'url("/hero_luxury_fragrance.png")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="hero-content-p rev-scroll">
          <span className="hero-subtitle-p">Establishment 1988</span>
          <h1 className="hero-title-p">A Legacy<br />Restored</h1>
        </div>
      </section>

      <div className="container">
        
        {/* ── INTRO / PHILOSOPHY ── */}
        <section className="py-32 text-center max-w-4xl mx-auto rev-scroll rev-delay-1">
          <h2 className="font-heading text-4xl mb-10 text-charcoal">The Essence of Qilzir</h2>
          <p className="story-p-p text-xl">
            Qilzir is a modern boutique perfume house dedicated to the meticulous art of olfactory storytelling. 
            Born from a family archive that traces back to the golden era of South Indian fragrance creation, 
            we believe that a scent is the most intimate form of identity—a lingering echo of one's soul.
          </p>
        </section>

        {/* ── TIER 1: CRESCENT AROMATICS ── */}
        <section className="story-section-p">
          <div className="story-text-p rev-scroll">
            <span className="story-tag-p">Crescent Aromatics • 1988</span>
            <h2 className="story-title-p">The First Ascent</h2>
            <p className="story-p-p">
              In the late 1980s, a visionary chemical engineer from the Madras Institute of Technology founded a venture 
              that would change the region's scent landscape: <span className="text-black font-semibold">Crescent Aromatics</span>.
            </p>
            <p className="story-p-p">
              With a profound mastery of chemistry and a poet's heart for scent, he began 
              formulating concentrated fragrance oils that were quickly recognized for their 
              unparalleled depth and longevity across Tamil Nadu.
            </p>
          </div>
          <div className="story-img-wrap-p rev-scroll rev-delay-2">
            <div className="story-img-decoration-p"></div>
            <img src="/hero_luxury_fragrance.png" alt="Engineering the scent" className="story-img-p" />
          </div>
        </section>

        {/* ── TIER 2: THE QUOTE (TRAGEDY) ── */}
        <section className="quote-section-p rev-scroll">
          <div className="quote-content-p">
            <div className="quote-mark-p">“</div>
            <h2 className="main-quote-p">
              Within a year of achieving local acclaim, the journey was abruptly halted. 
              The company dissolved into silence, existing only in the memories shared 
              by my father about his late brother's passion.
            </h2>
            <div className="quote-signifier-p">— Heritage of Resilience —</div>
          </div>
        </section>

        {/* ── TIER 3: MODERN VISION ── */}
        <section className="story-section-p reverse">
          <div className="story-text-p rev-scroll">
            <span className="story-tag-p">Present Day • The Restoration</span>
            <h2 className="story-title-p">Heritage Meets<br />Modernity</h2>
            <p className="story-p-p">
              Today, Qilzir carries that dormant spirit forward. We don't just replicate the past; 
              we interpret it through a contemporary lens of science and fine artistry.
            </p>
            <p className="story-p-p">
              We reject mass-market trends in favor of distinctive, high-concentration extraits 
              that evoke raw emotion and leave an indelible impression.
            </p>

            <div className="vision-glass-box rev-scroll rev-delay-3">
              <h3 className="vision-title">Our Manifesto</h3>
              <p className="vision-text">
                To serve as a sanctuary for those who appreciate craftsmanship over vanity—providing 
                authentic, unique olfactory artifacts for the modern connoisseur.
              </p>
            </div>
          </div>
          <div className="story-img-wrap-p rev-scroll rev-delay-1">
            <div className="story-img-decoration-p"></div>
            <img src="/silk_amber_attar.png" alt="Modern Scent Craft" className="story-img-p" />
          </div>
        </section>

        {/* ── FINAL CTA / CLOSING ── */}
        <section className="py-40 text-center rev-scroll">
          <div className="w-px h-24 bg-gold mx-auto mb-10"></div>
          <h2 className="font-heading text-3xl italic text-charcoal mb-6">Meticulously Crafted for the Discerning.</h2>
          <p className="text-mutted text-xs uppercase tracking-[0.5em] font-bold">Qilzir Atelier</p>
        </section>

      </div>
    </div>
  );
};

export default About;
