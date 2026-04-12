import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer text-white">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <img src="/logo_cropped.png" alt="Qilzir" className="footer-logo-img mb-6" style={{ filter: 'invert(1) brightness(2)' }} />
            <p className="text-sm font-light leading-relaxed mb-6" style={{ color: '#b0b0b0' }}>
              Experience Qilzir beyond the bottle. Luxury attar for the modern connoisseur, steeped in Middle Eastern heritage.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com/qilzir" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://facebook.com/qilzir" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="20" height="20">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="https://x.com/qilzir" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="18" height="18">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://wa.me/919789392728" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.117 1.524 5.845L0 24l6.335-1.485A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.012-1.374l-.36-.214-3.733.875.941-3.636-.235-.374A9.784 9.784 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Boutique & Support</h3>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li>
                <span className="block text-gold text-xs tracking-widest mt-4 mb-1">EMAIL</span>
                <a href="mailto:qilzirperfumes@gmail.com" className="lowercase !text-sm">qilzirperfumes@gmail.com</a>
              </li>
              <li>
                <span className="block text-gold text-xs tracking-widest mt-2 mb-1">PHONE</span>
                <a href="tel:+919789392728" className="!text-sm">+91 9789 392 728</a>
              </li>
              <li>
                <span className="block text-gold text-xs tracking-widest mt-2 mb-1">LOCATION</span>
                <span className="block !text-sm text-mutted">10/8 Pandiyan Nagar Melur.</span>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Explore</h3>
            <ul>
              <li><Link to="/shop">All Fragrances</Link></li>
              <li><Link to="/new-arrivals">New Arrivals</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/about">Philosophy</Link></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h3 className="footer-title">The Inner Circle</h3>
            <p className="text-sm font-light mb-6" style={{ color: '#b0b0b0' }}>Subscribe to receive early access to new releases and exclusive events.</p>
            <form className="newsletter-form border-bottom-only">
              <input type="email" placeholder="Enter your email address" required className="text-white" />
              <button type="submit" className="newsletter-btn">SUBSCRIBE</button>
            </form>
          </div>

        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-links">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Shipping Info</Link>
          </div>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Qilzir Perfumes. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
