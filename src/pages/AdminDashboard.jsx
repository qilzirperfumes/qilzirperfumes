import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Box, ShoppingCart, Users, BarChart3, Archive,
  Settings as SettingsIcon, LogOut, Search, Bell, Plus, X, Sparkles, 
  Trash2, Edit, RefreshCw, Image, Tag, Info, Layers, Droplets
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const { 
    products, addProduct, updateProduct, deleteProduct, updateStock, formatPrice,
    orders, customers, deleteCustomer, settings, updateSetting, apiReady, refreshCustomers
  } = useStore();

  const [tab, setTab]           = useState('overview');
  const [modal, setModal]       = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [toast, setToast]       = useState('');
  
  // Local state for banner url so it only updates on button click
  const [bannerUrl, setBannerUrl] = useState('');

  // Sync local bannerUrl once settings are loaded
  useEffect(() => {
    if (settings.new_arrivals_banner) {
      setBannerUrl(settings.new_arrivals_banner);
    }
  }, [settings.new_arrivals_banner]);

  const [form, setForm] = useState({ 
    name:'', price:'', originalPrice: '', stock:'', category:'', customCategory:'',
    description:'', image: '', extraImages: '', isNewArrival: false,
    size: '100', unit: 'ml',
    notes: { top: '', heart: '', base: '' }
  });

  const [editForm, setEditForm]   = useState({});
  const [editTab, setEditTab]     = useState('basic');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const finalCategory = form.category === 'new' ? form.customCategory : form.category;
    addProduct({ ...form, category: finalCategory });
    setForm({ 
      name:'', price:'', originalPrice: '', stock:'', category:'', customCategory:'',
      description:'', image: '', extraImages: '', isNewArrival: false,
      notes: { top: '', heart: '', base: '' }
    });
    setModal(false);
    showToast('✓  New release added to catalog');
  };

  const startEdit = (p) => {
    setEditForm({ 
      id: p.id || p._id,
      name: p.name, 
      price: String(p.price), 
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      stock: String(p.stock), 
      image: p.image || '', 
      extraImages: p.extraImages ? p.extraImages.join(', ') : '',
      isNewArrival: !!p.isNewArrival,
      description: p.description || '',
      size: p.size ? String(p.size) : '100',
      unit: p.unit || 'ml',
      category: p.category || '',
      customCategory: '',
      notes: {
        top: p.notes?.top || '',
        heart: p.notes?.heart || '',
        base: p.notes?.base || '',
      }
    });
    setEditTab('basic');
    setEditModal(true);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    const finalCategory = editForm.category === 'new' ? editForm.customCategory : editForm.category;
    updateProduct(editForm.id, {
      ...editForm,
      price: Number(editForm.price),
      originalPrice: editForm.originalPrice ? Number(editForm.originalPrice) : undefined,
      stock: parseInt(editForm.stock) || 0,
      extraImages: editForm.extraImages ? editForm.extraImages.split(',').map(s => s.trim()).filter(Boolean) : [],
      category: finalCategory,
    });
    setEditModal(false);
    showToast(`✓  "${editForm.name}" details updated`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Eradicate this product from the archive?')) {
      deleteProduct(id);
      showToast('✓  Product removed');
    }
  };

  const handleInventoryUpdate = (p) => {
    const input = window.prompt(`Adjust stock for "${p.name}":`, p.stock);
    if (input === null) return;
    const n = parseInt(input);
    if (!isNaN(n)) updateStock(p.id || p._id, n);
  };

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  const NAV = [
    { id:'overview',  label:'Atelier Overview', Icon: LayoutDashboard },
    { id:'products',  label:'Master Catalog',   Icon: Box             },
    { id:'inventory', label:'Reserve Control',  Icon: Archive         },
    { id:'orders',    label:'Acquisitions',     Icon: ShoppingCart    },
    { id:'customers', label:'Collectors',      Icon: Users           },
    { id:'settings',  label:'House Settings',   Icon: SettingsIcon    },
  ];

  return (
    <div className="adm-shell">
      {toast && <div className="adm-toast-premium">{toast}</div>}

      {/* --- ADD MASTERPIECE MODAL --- */}
      {modal && (
        <div className="adm-modal-overlay-p">
          <div className="adm-modal-p large">
            <header className="modal-p-header">
              <h2>New Essence Release</h2>
              <button onClick={() => setModal(false)}><X /></button>
            </header>
            <form onSubmit={handleAddProduct} className="modal-p-body">
              <div className="form-p-grid">
                <div className="form-p-group span-2">
                  <label>Fragrance Title</label>
                  <input required placeholder="e.g. Midnight Oud" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-p-group">
                  <label>Retail Price (₹)</label>
                  <input required type="number" placeholder="4500" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
                <div className="form-p-group">
                  <label>Original / MRP (₹)</label>
                  <input type="number" placeholder="5500" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} />
                </div>
                <div className="form-p-group">
                  <label>Collection Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="new">+ Define New Category</option>
                  </select>
                </div>
                <div className="form-p-group">
                  <label>Volume / Size</label>
                  <div className="flex gap-2">
                    <input style={{flex:1}} type="number" placeholder="100" value={form.size} onChange={e => setForm({...form, size: e.target.value})} />
                    <select style={{width:'80px'}} value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                        <option value="ml">ml</option>
                        <option value="g">g</option>
                        <option value="oz">oz</option>
                    </select>
                  </div>
                </div>
                {form.category === 'new' && (
                  <div className="form-p-group">
                    <label>New Category Name</label>
                    <input autoFocus placeholder="e.g. Rare Blends" value={form.customCategory} onChange={e => setForm({...form, customCategory: e.target.value})} />
                  </div>
                )}
                <div className="form-p-group span-2">
                  <label>Olfactory Story (Description)</label>
                  <textarea rows="3" placeholder="Describe the soul of this scent..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="form-p-group span-2">
                  <label>Main Image URL</label>
                  <input placeholder="https://..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
                </div>
              </div>
              <footer className="modal-p-footer">
                <button type="submit" className="btn-p-primary">Publish to House</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* --- ELITE EDIT MODAL (Tabbed) --- */}
      {editModal && (
        <div className="adm-modal-overlay-p">
          <div className="adm-modal-p large">
             <header className="modal-p-header">
              <h2>Refine Masterpiece: {editForm.name}</h2>
              <button onClick={() => setEditModal(false)}><X /></button>
            </header>
            
            <nav className="modal-p-nav">
               <button className={editTab === 'basic' ? 'active' : ''} onClick={() => setEditTab('basic')}><Info size={14}/> General</button>
               <button className={editTab === 'pricing' ? 'active' : ''} onClick={() => setEditTab('pricing')}><Tag size={14}/> Pricing & Stock</button>
               <button className={editTab === 'scent' ? 'active' : ''} onClick={() => setEditTab('scent')}><Droplets size={14}/> Scent Profile</button>
               <button className={editTab === 'media' ? 'active' : ''} onClick={() => setEditTab('media')}><Image size={14}/> Gallery</button>
            </nav>

            <form onSubmit={saveEdit} className="modal-p-body">
              {editTab === 'basic' && (
                <div className="form-p-grid">
                  <div className="form-p-group span-2"><label>Name</label><input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                  <div className="form-p-group span-2"><label>Description</label><textarea rows="4" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} /></div>
                  <div className="form-p-group">
                     <label>Category</label>
                     <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="new">+ Change Category</option>
                     </select>
                  </div>
                  {editForm.category === 'new' && (
                    <div className="form-p-group"><label>New Category</label><input autoFocus value={editForm.customCategory} onChange={e => setEditForm({...editForm, customCategory: e.target.value})} /></div>
                  )}
                </div>
              )}

              {editTab === 'pricing' && (
                <div className="form-p-grid">
                  <div className="form-p-group"><label>Selling Price (₹)</label><input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} /></div>
                  <div className="form-p-group"><label>Original/MRP (₹)</label><input type="number" value={editForm.originalPrice} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} /></div>
                  <div className="form-p-group"><label>Available Reserve (Stock)</label><input type="number" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: e.target.value})} /></div>
                  <div className="form-p-group">
                     <label>Volume / Unit</label>
                     <div className="flex gap-2">
                        <input style={{flex:1}} type="number" value={editForm.size} onChange={e => setEditForm({...editForm, size: e.target.value})} />
                        <select style={{width:'80px'}} value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})}>
                           <option value="ml">ml</option>
                           <option value="g">g</option>
                           <option value="oz">oz</option>
                        </select>
                     </div>
                  </div>
                  <div className="form-p-group" style={{display:'flex', alignItems:'center', marginTop:'24px'}}>
                     <label className="checkbox-p"><input type="checkbox" checked={editForm.isNewArrival} onChange={e => setEditForm({...editForm, isNewArrival: e.target.checked})} /> New Arrival Tag</label>
                  </div>
                </div>
              )}

              {editTab === 'scent' && (
                <div className="form-p-grid">
                   <div className="form-p-group"><label>Top Notes</label><input placeholder="Citrus, Bergamot..." value={editForm.notes.top} onChange={e => setEditForm({...editForm, notes: {...editForm.notes, top: e.target.value}})} /></div>
                   <div className="form-p-group"><label>Heart Notes</label><input placeholder="Rose, Jasmine..." value={editForm.notes.heart} onChange={e => setEditForm({...editForm, notes: {...editForm.notes, heart: e.target.value}})} /></div>
                   <div className="form-p-group"><label>Base Notes</label><input placeholder="Oud, Musk, Amber..." value={editForm.notes.base} onChange={e => setEditForm({...editForm, notes: {...editForm.notes, base: e.target.value}})} /></div>
                </div>
              )}

              {editTab === 'media' && (
                <div className="form-p-grid">
                   <div className="form-p-group span-2"><label>Primary Visual (Main URL)</label><input value={editForm.image} onChange={e => setEditForm({...editForm, image: e.target.value})} /></div>
                   <div className="form-p-group span-2"><label>Support Gallery (URLs, comma separated)</label><textarea rows="3" value={editForm.extraImages} onChange={e => setEditForm({...editForm, extraImages: e.target.value})} /></div>
                </div>
              )}

              <footer className="modal-p-footer">
                <button type="submit" className="btn-p-primary">Sync Updates to Live Site</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo"><img src="/logo_cropped.png" alt="Qilzir" /></div>
        <nav className="adm-nav">
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} className={`adm-nav-btn ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}><Icon /> {label}</button>
          ))}
          <div className="adm-nav-spacer" />
          <button className="adm-nav-btn danger" onClick={onLogout}><LogOut /> Sign Out</button>
        </nav>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="adm-main">
        <header className="adm-topbar">
          <div className="adm-search-container"><Search size={14}/><input placeholder="Explore House Archives..." /></div>
          <div className="adm-topbar-actions">
             <button className="adm-icon-btn rotate-on-click" onClick={() => window.location.reload()} title="Synchronize Archives"><RefreshCw size={18} /></button>
             <div className="sync-status">
               <span className={apiReady ? 'live' : 'offline'} /> 
               {apiReady ? 'Master Sync Active' : 'Offline Access'}
             </div>
             <button className="adm-icon-btn"><Bell size={18} /><span className="notif-badge" /></button>
          </div>
        </header>

        <div className="adm-content">

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div className="adm-fade-in">
              <div className="adm-header-row">
                <div className="adm-title-stack">
                   <h1>Atelier Performance</h1>
                   <p>Live house metrics and store health</p>
                </div>
                <button className="btn-p-primary" onClick={() => setModal(true)}><Plus size={16}/> Forge New Essence</button>
              </div>

              <div className="adm-widgets">
                <div className="adm-widget-card gold">
                   <div className="widget-label">NET REVENUE</div>
                   <div className="widget-val">{formatPrice(totalRevenue)}</div>
                   <div className="widget-trend">+14% Acquisition rate</div>
                </div>
                <div className="adm-widget-card">
                   <div className="widget-label">COLLECTION ENTRIES</div>
                   <div className="widget-val">{products.length} <small>Items</small></div>
                   <div className="widget-sub">Across {categories.length} segments</div>
                </div>
                <div className="adm-widget-card">
                   <div className="widget-label">LIFETIME COLLECTORS</div>
                   <div className="widget-val">{customers.length}</div>
                   <div className="widget-sub">Priority database active</div>
                </div>
                 <div className="adm-widget-card danger">
                   <div className="widget-label">LOW RESERVE</div>
                   <div className="widget-val">{products.filter(p => p.stock < 5).length}</div>
                   <div className="widget-sub">Items require replenishment</div>
                </div>
              </div>
            </div>
          )}

          {/* CATALOG TAB */}
          {tab === 'products' && (
            <div className="adm-fade-in">
              <div className="adm-header-row"><h1 className="adm-page-title">Master Catalog</h1></div>
              <div className="adm-table-premium">
                <table>
                  <thead><tr><th>Preview</th><th>Entity Details</th><th>Collection</th><th>Price</th><th>Action</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id || p._id}>
                        <td style={{width:'60px'}}><img src={p.image} className="td-img-p" /></td>
                        <td>
                           <div className="td-name-p">{p.name}</div>
                           <div className="td-sku-p">SKU: {p.id?.slice(-6).toUpperCase()}</div>
                        </td>
                        <td><span className="td-cat-p">{p.category}</span></td>
                        <td><span className="td-price-p">{formatPrice(p.price)}</span></td>
                        <td className="td-actions-p">
                          <button onClick={() => startEdit(p)} title="Refine Details"><Edit size={16}/></button>
                          <button onClick={() => handleDelete(p.id || p._id)} className="danger" title="Eradicate"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RESERVE / INVENTORY */}
          {tab === 'inventory' && (
            <div className="adm-fade-in">
              <div className="adm-header-row"><h1 className="adm-page-title">Reserve Control</h1></div>
              <div className="adm-table-premium">
                <table>
                  <thead><tr><th>Entity</th><th>Stock Level</th><th>Health</th><th>Operations</th></tr></thead>
                  <tbody>
                    {products.map(p => {
                      const st = p.stock > 10 ? 'Healthy' : p.stock > 0 ? 'Refill Soon' : 'Depleted';
                      const badgeCls = p.stock > 10 ? 'badge-green' : p.stock > 0 ? 'badge-gold' : 'badge-red';
                      return (
                        <tr key={p.id}>
                          <td className="nm-p">{p.name}</td>
                          <td className="stock-val-p">{p.stock} units</td>
                          <td><span className={`badge-p ${badgeCls}`}>{st}</span></td>
                          <td><button className="btn-p-outline sm" onClick={() => handleInventoryUpdate(p)}>Update Stock</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACQUISITIONS / ORDERS */}
          {tab === 'orders' && (
            <div className="adm-fade-in">
               <div className="adm-header-row"><h1 className="adm-page-title">Order Ledger</h1></div>
               <div className="adm-table-premium">
                 <table>
                   <thead><tr><th>Order ID</th><th>Customer Entity</th><th>Acquisition Value</th><th>Date</th></tr></thead>
                   <tbody>
                     {orders.map(o => (
                       <tr key={o.orderId}>
                         <td className="td-order-id">{o.orderId}</td>
                         <td>{o.customerName}</td>
                         <td className="td-price-p">{formatPrice(o.total)}</td>
                         <td className="td-sku-p">{new Date(o.createdAt).toLocaleDateString()}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* COLLECTORS / CUSTOMERS */}
          {tab === 'customers' && (
             <div className="adm-fade-in">
                <div className="adm-header-row"><h1 className="adm-page-title">Collectors Portfolio</h1></div>
                <div className="adm-table-premium">
                  <table>
                    <thead><tr><th>Collector Name</th><th>Contact Identifier</th><th>Tier</th><th>Activity</th><th>Action</th></tr></thead>
                    <tbody>
                      {customers.map(c => (
                        <tr key={c.id || c._id || c.email}>
                          <td><strong>{c.name}</strong></td>
                          <td>{c.email}</td>
                          <td><span className="badge-p badge-gold">{c.tier}</span></td>
                          <td>{formatPrice(c.totalSpent || 0)}</td>
                          <td>
                            <button 
                              className="adm-btn-icon danger" 
                              onClick={() => {
                                if (window.confirm(`Permanently remove collector ${c.name} from the house records?`)) {
                                  deleteCustomer(c.id || c._id);
                                  setToast('Collector record purged.');
                                  setTimeout(() => setToast(''), 3000);
                                }
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <div className="adm-fade-in">
               <div className="adm-header-row"><h1 className="adm-page-title">House Settings</h1></div>
               <div className="adm-settings-grid-p">
                  <div className="settings-card-p">
                     <h3>Visual Identity</h3>
                     <div className="field-p">
                        <label>New Arrivals Hero Image URL</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                          <input 
                            style={{ flex: 1, padding: '12px', border: '1.5px solid #eee', borderRadius: '8px' }}
                            value={bannerUrl} 
                            onChange={e => setBannerUrl(e.target.value)} 
                          />
                          <button 
                            className="btn-p-primary"
                            style={{ padding: '0 24px' }}
                            onClick={() => {
                              updateSetting('new_arrivals_banner', bannerUrl);
                              showToast('✓  House visuals updated');
                            }}
                          >
                            Update
                          </button>
                        </div>
                     </div>
                  </div>
                  <div className="settings-card-p">
                     <h3>Master System</h3>
                     <p>Synchronization: <strong>{apiReady ? 'Cloud Synced' : 'Offline Mode'}</strong></p>
                     <button className="btn-p-outline mt-4" onClick={() => window.location.reload()}>Refresh Cache</button>
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
