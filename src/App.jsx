import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Shop from './pages/Shop';
import NewArrivals from './pages/NewArrivals';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import QPass from './pages/QPass';
import CustomCursor from './components/CustomCursor';

function AppInner() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <CustomCursor />
      <ScrollToTop />

      {/* ── PREMIUM LOADING SCREEN ── */}
      <div className={`page-loader ${!loading ? 'hidden' : ''}`}>
        {/* Golden sweep line */}
        <div className="loader-line" />
        {/* Logo with clip reveal */}
        <div className="loader-logo-wrap">
          <img src="/logo_cropped.png" alt="Qilzir" className="loader-logo" />
        </div>
        {/* Tagline */}
        <p className="loader-tagline">Luxury Attar</p>
        {/* Corner ornaments */}
        <span className="loader-corner loader-corner--tl" />
        <span className="loader-corner loader-corner--tr" />
        <span className="loader-corner loader-corner--bl" />
        <span className="loader-corner loader-corner--br" />
      </div>

      {!isAdminRoute && <Navbar user={user} />}

      <main className={!isAdminRoute ? 'main-content' : ''} style={{ minHeight: '100vh', paddingTop: isAdminRoute ? '0' : '80px' }}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"              element={<Home />} />
          <Route path="/shop"          element={<Shop />} />
          <Route path="/new-arrivals"  element={<NewArrivals />} />
          <Route path="/product/:id"   element={<ProductDetails />} />
          <Route path="/cart"          element={<Cart />} />
          <Route path="/checkout"      element={<Checkout />} />
          <Route path="/about"         element={<About />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/qpass"         element={<QPass />} />
          <Route path="/login"         element={<Login onAdminLogin={setIsAuthenticated} onUserLogin={setUser} />} />
          <Route path="/profile"       element={<UserProfile user={user} onLogout={() => setUser(null)} />} />
          <Route path="/admin"
            element={!isAuthenticated
              ? <Login onAdminLogin={setIsAuthenticated} onUserLogin={setUser} />
              : <AdminDashboard onLogout={() => setIsAuthenticated(false)} />}
          />
          <Route path="/admin/dashboard"
            element={isAuthenticated
              ? <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
              : <Login onAdminLogin={setIsAuthenticated} onUserLogin={setUser} />}
          />
        </Routes>
      </main>

      {!isAdminRoute && (
        <a
          href="https://wa.me/919789392728"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-fab"
          aria-label="Chat on WhatsApp"
        >
          {/* WhatsApp SVG icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.117 1.524 5.845L0 24l6.335-1.485A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.012-1.374l-.36-.214-3.733.875.941-3.636-.235-.374A9.784 9.784 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
          </svg>
        </a>
      )}

      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}

export default App;
