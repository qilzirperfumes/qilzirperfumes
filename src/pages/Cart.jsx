import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, X, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal, formatPrice } = useStore();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page section-padding container min-h-screen flex flex-col items-center justify-center text-center">
        <div style={{ color: 'var(--color-gold)', marginBottom: '2rem' }}>
          <ShoppingBag size={64} strokeWidth={1} />
        </div>
        <h1 className="font-heading text-4xl mb-4">Your Cart is Empty</h1>
        <p className="text-mutted mb-8 max-w-md">
          Your selection awaits. Explore our curated collection of luxury attars.
        </p>
        <Link to="/shop" className="btn btn-primary">Browse The Collection</Link>
      </div>
    );
  }

  return (
    <div className="cart-page section-padding container min-h-screen">
      <div className="text-center mb-16 animate-fade-up">
        <h1 className="font-heading text-5xl mb-4">Your Selection</h1>
        <p className="text-mutted">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="grid animate-fade-up delay-100" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
          <div style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'minmax(0,1fr) 380px' }} className="cart-layout">

            {/* Cart Items */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #E0DCD3', marginBottom: '2rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700' }}
                className="hidden-mobile">
                <div>Product</div>
                <div style={{ textAlign: 'center' }}>Price</div>
                <div style={{ textAlign: 'center' }}>Quantity</div>
                <div style={{ textAlign: 'right' }}>Total</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item-row" style={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 1fr 1fr 1fr',
                    gap: '1rem',
                    alignItems: 'center',
                    paddingBottom: '2rem',
                    borderBottom: '1px solid #E0DCD3',
                  }}>
                    {/* Product */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <button onClick={() => removeFromCart(item.id)}
                        style={{ color: 'var(--color-text-mutted)', flexShrink: 0, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-error)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-mutted)'}>
                        <X size={18} />
                      </button>
                      <div style={{ width: '80px', height: '80px', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <h3 className="font-heading" style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-mutted)' }}>10ml Attar</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>{formatPrice(item.price)}</div>

                    {/* Qty */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E0DCD3', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                        <button onClick={() => updateQty(item.id, item.qty - 1)}
                          style={{ padding: '0.4rem 0.75rem', fontSize: '1rem', color: 'inherit' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-gold)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>−</button>
                        <span style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', minWidth: '2rem', textAlign: 'center' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)}
                          style={{ padding: '0.4rem 0.75rem', fontSize: '1rem', color: 'inherit' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-gold)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>+</button>
                      </div>
                    </div>

                    {/* Total */}
                    <div style={{ textAlign: 'right', fontWeight: '700', color: 'var(--color-gold)' }}>
                      {formatPrice(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
              <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <h3 className="font-heading" style={{ fontSize: '1.4rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E0DCD3' }}>Order Summary</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-mutted)' }}>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-mutted)' }}>Shipping</span>
                    <span style={{ color: 'var(--color-gold)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '700' }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.05rem', paddingTop: '1rem', borderTop: '1px solid #E0DCD3', marginTop: '0.25rem' }}>
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <button onClick={() => navigate('/checkout')} className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <div style={{ marginTop: '1.5rem' }}>
                  <Link to="/shop" style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-mutted)' }}>
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr !important; }
          .cart-item-row { grid-template-columns: 1fr !important; }
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;
