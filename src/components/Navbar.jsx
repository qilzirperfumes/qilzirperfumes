import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Navbar.css';

/* Xerjoff-style nav:
   LEFT:  Home | Shop | New Arrivals
   CENTER: Logo
   RIGHT: Our World | Contact | [icons]
*/
const LEFT_LINKS  = [
  { to: '/',           label: 'Home' },
  { to: '/shop',       label: 'Shop' },
  { to: '/new-arrivals', label: 'New Arrivals' },
];
const RIGHT_LINKS = [
  { to: '/about',   label: 'Our World' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = ({ user }) => {
  const [isScrolled, setIsScrolled]         = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen]         = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const { cartCount } = useStore();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMobileMenuOpen(false);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''} ${!isHome ? 'navbar-always-dark' : ''}`}>
      <div className="navbar-container">

        {/* ── LEFT LINKS (desktop) ── */}
        <nav className="nav-group nav-left">
          {LEFT_LINKS.map(({ to, label }) => (
            <NavLink key={label} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── HAMBURGER (mobile only) ── */}
        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* ── LOGO (center) ── */}
        <Link to="/" className="navbar-logo" onClick={close}>
          <img src="/logo_cropped.png" alt="Qilzir" className="navbar-logo-img" />
        </Link>

        {/* ── RIGHT LINKS + ICONS ── */}
        <div className="nav-group nav-right">
          {RIGHT_LINKS.map(({ to, label }) => (
            <NavLink key={label} to={to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
              {label}
            </NavLink>
          ))}

          <div className="nav-icons">
            {searchOpen ? (
              <div className="nav-search-inline">
                <Search size={13} />
                <input
                  autoFocus
                  placeholder="Search fragrances…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
                      setSearchOpen(false);
                    }
                    if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
                  }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}><X size={13} /></button>
              </div>
            ) : (
              <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search size={18} />
              </button>
            )}
            <Link to={user ? "/profile" : "/login"} className="icon-btn" aria-label="Account">
              <User size={18} />
            </Link>
            <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>}
            </Link>
          </div>
        </div>

      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && <div className="nav-backdrop" onClick={close} />}
      <nav className={`nav-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={close}><X size={20} /></button>
        <Link to="/" className="drawer-logo" onClick={close}>
          <img src="/logo_cropped.png" alt="Qilzir" />
        </Link>
        <div className="drawer-links">
          {[...LEFT_LINKS, ...RIGHT_LINKS].map(({ to, label }) => (
            <NavLink key={label} to={to} onClick={close} className={({ isActive }) => `drawer-link ${isActive ? 'drawer-link--active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </div>
        <div className="drawer-icons">
          <Link to={user ? "/profile" : "/login"} className="icon-btn" onClick={close}><User size={20} /></Link>
          <Link to="/cart"  className="icon-btn cart-btn" onClick={close}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
