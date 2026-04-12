import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, Settings, LogOut, ChevronRight, 
  Heart, Sparkles, Shield, Package, Clock, Bell, ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './UserProfile.css'; 

const UserProfile = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { formatPrice, orders } = useStore();
  
  if (!user) {
    useEffect(() => navigate('/login'), []);
    return null;
  }

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  // Filter orders for this specific customer
  const userOrders = orders.filter(o => o.customerEmail === user.email);

  return (
    <div className="prof-shell">
      <div className="prof-container">
        
        {/* ── TOP NAVIGATION / LOGOUT ── */}
        <header className="prof-top-nav">
           <nav className="prof-breadcrumbs">
              <Link to="/">House</Link>
              <ChevronRight size={10} />
              <span className="active">My Collection</span>
           </nav>
           <button onClick={handleLogout} className="prof-logout-btn">
              <LogOut size={14} /> <span>Sign Out</span>
           </button>
        </header>

        <div className="prof-grid">
          
          {/* ── SIDECAR: Collector Identity ── */}
          <aside className="prof-sidebar">
            
            <div className="prof-id-card">
              <div className="prof-avatar-wrap">
                 <div className="prof-avatar">
                   {user.name?.charAt(0) || user.email?.charAt(0)}
                 </div>
                 <div className="prof-avatar-badge">
                    <Sparkles size={12} />
                 </div>
              </div>
              
              <div className="prof-name">{user.name || 'Collector'}</div>
              <div className="prof-email">{user.email}</div>
              
              <div className="prof-status-pill">
                 <Shield size={14} />
                 <span>Verified Collector</span>
              </div>
            </div>

            <nav className="prof-nav">
               <button className="prof-nav-item active">
                  <div className="prof-nav-label">
                     <ShoppingBag size={16} />
                     <span>Acquisitions</span>
                  </div>
                  <ChevronRight size={14} />
               </button>
               <button className="prof-nav-item">
                  <div className="prof-nav-label">
                     <Heart size={16} />
                     <span>Wishlist</span>
                  </div>
                  <ChevronRight size={14} style={{opacity: 0.3}} />
               </button>
               <button className="prof-nav-item">
                  <div className="prof-nav-label">
                     <Bell size={16} />
                     <span>Notifications</span>
                  </div>
                  <ChevronRight size={14} style={{opacity: 0.3}} />
               </button>
               <button className="prof-nav-item">
                  <div className="prof-nav-label">
                     <Settings size={16} />
                     <span>Account Security</span>
                  </div>
                  <ChevronRight size={14} style={{opacity: 0.3}} />
               </button>
            </nav>
          </aside>

          {/* ── MAIN: Activity & Privileges ── */}
          <div className="prof-main">
             
             {/* Acquisitions Section */}
             <section className="prof-fade-in">
                <header className="prof-section-header">
                   <div className="prof-section-title">
                      <h2>Acquisition History</h2>
                      <p>Your previous house selections</p>
                   </div>
                   <Link to="/shop" className="prof-link-more">
                      Browse Catalog <ArrowRight size={12} />
                   </Link>
                </header>
                
                {userOrders.length > 0 ? (
                  <div className="prof-order-list">
                    {userOrders.map(order => (
                      <div key={order._id || order.orderId} className="prof-order-card">
                         <div className="prof-order-info">
                            <div className="prof-order-icon">
                               <Package size={20} />
                            </div>
                            <div className="prof-order-meta">
                               <div className="prof-order-id">Acquisition #{order.orderId?.slice(-6) || 'QZ-LIVE'}</div>
                               <div className="prof-order-sub">
                                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                  <span className="prof-order-dot" />
                                  <span>{order.status}</span>
                               </div>
                            </div>
                         </div>
                         <div className="prof-order-total">
                            <div style={{fontWeight: 700}}>{formatPrice(order.total)}</div>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="prof-empty-state">
                     <div className="prof-empty-quote">"A collection of mastery begins with a single drop of excellence."</div>
                     <p className="prof-empty-msg">Your acquisition ledger is currently awaiting its first entry.</p>
                     <Link to="/shop" className="btn-p-black">Curate Your First Blend</Link>
                  </div>
                )}
             </section>

             {/* Privileges Section */}
             <section className="prof-fade-in">
                <header className="prof-section-header" style={{border: 'none', justifyContent: 'center'}}>
                   <div className="prof-section-title" style={{textAlign: 'center'}}>
                      <h2>Portfolio Privileges</h2>
                      <div style={{width: '40px', height: '1px', background: '#C8A96A', margin: '15px auto 0'}} />
                   </div>
                </header>
                
                <div className="prof-privileges">
                   <div className="prof-priv-card dark">
                      <div className="prof-priv-tag">Verified Elite</div>
                      <h3 className="prof-priv-title">Priority Reserve</h3>
                      <p className="prof-priv-text">
                        Early access to limited-edition boutique releases and the right of first refusal on vault perfumes.
                      </p>
                   </div>
                   
                   <div className="prof-priv-card light">
                      <div className="prof-priv-tag">House Support</div>
                      <h3 className="prof-priv-title">Private Concierge</h3>
                      <p className="prof-priv-text">
                        One-on-one direct communication for collection curation and bespoke fragrance pairing for gifting.
                      </p>
                   </div>
                </div>
             </section>

          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
