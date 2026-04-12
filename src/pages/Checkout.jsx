import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, CheckCircle, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Checkout.css';

const STEPS = ['Delivery', 'Payment', 'Confirm'];

const Checkout = () => {
  const { cartItems, cartTotal, formatPrice, completeOrder, isCODEligible, createOrder } = useStore();

  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', pincode: '',
  });
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });

  if (cartItems.length === 0 && !placed) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-inner">
          <div className="checkout-empty-icon">🛒</div>
          <h2 className="font-heading text-3xl mb-4">Your cart is empty</h2>
          <p className="text-mutted mb-8">Add some attars to your cart before checking out.</p>
          <Link to="/shop" className="btn btn-primary">Browse The Collection</Link>
        </div>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="checkout-success">
        <div className="checkout-success-inner animate-fade-up">
          <div className="checkout-success-icon">
            <CheckCircle size={64} strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-4xl mb-4">Order Confirmed</h1>
          <p className="text-mutted text-lg mb-2">Thank you, {form.name || 'Valued Client'}.</p>
          <p className="text-mutted mb-10">Your Qilzir attar is being prepared with the utmost care.</p>
          <div className="checkout-order-id">Order #QZ-{Math.floor(Math.random() * 90000) + 10000}</div>
          <p className="text-xs uppercase tracking-widest text-mutted mt-4 mb-10">Confirmation sent to {form.email || 'your email'}</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const handleDeliveryNext = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const initRazorpay = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_somekeyhere', // User will need to set this in .env
      amount: cartTotal * 100, // Amount in paise
      currency: "INR",
      name: "Qilzir Perfumes",
      description: "Artisan Attar Acquisition",
      image: "/logo.png",
      handler: function (response) {
        // Payment success
        handlePlaceOrder({
          paymentId: response.razorpay_payment_id,
          method: 'online'
        });
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone
      },
      theme: { color: "#C8A96A" },
      // Prioritize UPI and Card for Indian Market
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Preferred Methods',
              instruments: [
                { method: 'upi' },
                { method: 'card' }
              ],
            },
          },
          sequence: ['block.banks'],
        },
      },
    };


    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Payment gateway failed to load. Please check your connection.");
    }
  };

  const handlePlaceOrder = async (paymentDetails = {}) => {
    const orderData = {
      customerName: form.name,
      email: form.email,
      phone: form.phone,
      address: `${form.address}, ${form.city} - ${form.pincode}`,
      items: cartItems.map(i => ({
        product: i._id || i.id,
        name: i.name,
        qty: i.qty,
        price: i.price
      })),
      total: cartTotal,
      paymentMethod: paymentMethod,
      paymentId: paymentDetails.paymentId || 'N/A',
    };

    try {
      await createOrder(orderData);
      setPlaced(true);
    } catch (err) {
      alert(`Failed to save order: ${err.message}. Please check if database is connected.`);
    }

  };

  const handleConfirmOrder = () => {
    if (paymentMethod === 'online') {
      initRazorpay();
    } else {
      handlePlaceOrder({ method: 'cod' });
    }
  };


  return (
    <div className="checkout-page section-padding container min-h-screen">
      {/* Header */}
      <div className="checkout-header animate-fade-up">
        <Link to="/cart" className="checkout-back">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 className="font-heading text-4xl">Secure Checkout</h1>
        {/* Stepper */}
        <div className="checkout-stepper">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="checkout-step-dot">{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`checkout-step-line ${i < step ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="checkout-layout animate-fade-up delay-100">
        {/* Left: Steps */}
        <div className="checkout-main">

          {/* Step 0: Delivery */}
          {step === 0 && (
            <div className="checkout-panel">
              <h2 className="checkout-panel-title">Delivery Information</h2>
              <form onSubmit={handleDeliveryNext} className="checkout-form">
                <div className="checkout-form-row">
                  <div className="checkout-field">
                    <label>Full Name</label>
                    <input required value={form.name} placeholder="Enter your name"
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="checkout-field">
                    <label>Email Address</label>
                    <input required type="email" value={form.email} placeholder="name@example.com"
                      onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="checkout-field">
                  <label>Phone Number</label>
                  <input required value={form.phone} placeholder="+91 98765 43210"
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="checkout-field">
                  <label>Full Address</label>
                  <input required value={form.address} placeholder="House / Apartment, Street"
                    onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="checkout-form-row">
                  <div className="checkout-field">
                    <label>City</label>
                    <input required value={form.city} placeholder="Mumbai"
                      onChange={e => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div className="checkout-field">
                    <label>Pincode</label>
                    <input required value={form.pincode} placeholder="400001"
                      onChange={e => setForm({ ...form, pincode: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full mt-4">Continue to Payment</button>
              </form>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="checkout-panel">
              <h2 className="checkout-panel-title">Payment Method</h2>
              <div className="payment-options">
                {/* Online Payment */}
                <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')} />
                  <div className="payment-option-content">
                    <div className="payment-option-header">
                      <CreditCard size={20} />
                      <div>
                        <div className="payment-option-title">Online Payment</div>
                        <div className="payment-option-sub">Credit / Debit Card · UPI · Net Banking</div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''} ${!isCODEligible ? 'disabled' : ''}`}>
                  <input type="radio" name="payment" value="cod"
                    checked={paymentMethod === 'cod'}
                    disabled={!isCODEligible}
                    onChange={() => isCODEligible && setPaymentMethod('cod')} />
                  <div className="payment-option-content">
                    <div className="payment-option-header">
                      <Truck size={20} />
                      <div>
                        <div className="payment-option-title">
                          Cash on Delivery
                          {!isCODEligible && <span className="payment-locked-badge">🔒 Unlocks after 1st order</span>}
                        </div>
                        <div className="payment-option-sub">Pay when your parcel arrives</div>
                      </div>
                    </div>
                    {!isCODEligible && (
                      <p className="payment-locked-msg">Complete your first order to unlock Cash on Delivery.</p>
                    )}
                  </div>
                </label>
              </div>

              {/* Online payment description - No manual form needed as Razorpay handles it */}
              {paymentMethod === 'online' && (

                <div className="checkout-payment-details mt-6 animate-fade-in">
                  <div className="payment-support-icons">
                    <img src="https://img.icons8.com/color/48/000000/google-pay.png" alt="GPay" />
                    <img src="https://img.icons8.com/color/48/000000/upi.png" alt="UPI" />
                    <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" />
                  </div>
                  <p className="payment-notice">
                    You will be redirected to a secure payment gateway to complete your transaction via <strong>UPI</strong>, <strong>Cards</strong>, or <strong>Net Banking</strong>.
                  </p>
                  <div className="checkout-secure-note">
                    <Lock size={12} /> Your payment information is encrypted and secure.
                  </div>
                  <button onClick={() => setStep(2)} className="btn btn-primary w-full mt-6">Review Order</button>
                </div>
              )}

              {paymentMethod === 'cod' && isCODEligible && (

                <div className="mt-6">
                  <div className="checkout-cod-info">
                    Pay ₹{formatPrice(cartTotal).replace('₹', '')} upon delivery. No advance payment needed.
                  </div>
                  <button onClick={() => setStep(2)} className="btn btn-primary w-full mt-4">Review Order</button>
                </div>
              )}

              <button onClick={() => setStep(0)} className="checkout-back-link">← Back to Delivery</button>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="checkout-panel">
              <h2 className="checkout-panel-title">Review & Place Order</h2>

              <div className="confirm-section">
                <div className="confirm-label">Delivering to</div>
                <div className="confirm-value">{form.name}</div>
                <div className="confirm-value text-mutted text-sm">{form.address}, {form.city} – {form.pincode}</div>
                <div className="confirm-value text-mutted text-sm">{form.phone}</div>
              </div>

              <div className="confirm-section">
                <div className="confirm-label">Payment</div>
                <div className="confirm-value">
                  {paymentMethod === 'online' ? '💳 Online Payment (Razorpay)' : '🚚 Cash on Delivery'}
                </div>

              </div>

              <div className="confirm-items">
                {cartItems.map(item => (
                  <div key={item.id} className="confirm-item">
                    <div className="confirm-item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="confirm-item-info">
                      <div className="confirm-item-name">{item.name}</div>
                      <div className="confirm-item-sub">10ml · Qty: {item.qty}</div>
                    </div>
                    <div className="confirm-item-price">{formatPrice(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>

              <button onClick={handleConfirmOrder} className="btn btn-gold w-full mt-6 text-lg py-5">
                Place Order · {formatPrice(cartTotal)}
              </button>

              <button onClick={() => setStep(1)} className="checkout-back-link">← Back to Payment</button>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="checkout-summary">
          <div className="checkout-summary-inner">
            <h3 className="font-heading text-xl mb-6 pb-4 border-b border-[#E0DCD3]">Order Summary</h3>
            <div className="checkout-summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-summary-item">
                  <div className="checkout-summary-item-img">
                    <img src={item.image} alt={item.name} />
                    <span className="checkout-summary-qty">{item.qty}</span>
                  </div>
                  <div className="checkout-summary-item-info">
                    <div className="checkout-summary-item-name">{item.name}</div>
                    <div className="checkout-summary-item-sub">10ml Attar</div>
                  </div>
                  <div className="checkout-summary-item-price">{formatPrice(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
            <div className="checkout-summary-totals">
              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Shipping</span>
                <span className="text-gold text-xs tracking-widest">FREE</span>
              </div>
              <div className="checkout-summary-row total">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
