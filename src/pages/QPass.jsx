import React from 'react';
import { useNavigate } from 'react-router-dom';

const QPass = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center overflow-hidden py-24 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold opacity-10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
      
      <div className="w-full max-w-4xl relative z-10 text-center animate-fade-up">
        <h1 className="font-heading text-5xl md:text-7xl mb-4 text-gold-gradient">The Q-Pass</h1>
        <p className="text-xl tracking-widest uppercase mb-12 text-white/70">Absolute Privilege.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="bg-white/5 border border-white/10 p-10 frame-break-hover transition-transform duration-500">
            <h2 className="text-3xl font-heading mb-6 border-b border-gold/30 pb-4">Standard</h2>
            <div className="text-4xl font-light mb-8">Free</div>
            <ul className="space-y-4 mb-12 text-white/70">
              <li className="flex items-center gap-3">✓ Standard shipping rates</li>
              <li className="flex items-center gap-3">✓ General access to collections</li>
              <li className="flex items-center gap-3 opacity-30">× Dedicated concierge</li>
              <li className="flex items-center gap-3 opacity-30">× 50% discount on orders</li>
            </ul>
            <button onClick={() => navigate('/login')} className="w-full py-4 border border-white/30 text-center uppercase tracking-widest text-sm hover:bg-white/10 transition">
              Create Account
            </button>
          </div>

          <div className="bg-gold/10 border border-gold p-10 frame-break-hover transition-transform duration-500 relative">
            <div className="absolute top-0 right-0 bg-gold text-black px-4 py-1 text-xs font-bold uppercase tracking-widest transform translate-x-2 -translate-y-2">Most Exclusive</div>
            <h2 className="text-3xl font-heading mb-6 text-gold border-b border-gold/30 pb-4">Q-Pass Elite</h2>
            <div className="text-4xl font-light mb-8 text-gold">₹999 <span className="text-sm text-white/50">/lifetime</span></div>
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3">✓ <strong className="text-gold">Flat 50% OFF</strong> all future orders</li>
              <li className="flex items-center gap-3">✓ VIP Next-Day Delivery</li>
              <li className="flex items-center gap-3">✓ Private Reserve Early Access</li>
              <li className="flex items-center gap-3">✓ 24/7 Personal Fragrance Concierge</li>
            </ul>
            <button 
              onClick={() => {
                alert("Payment Gateway Triggered (Stripe / Razorpay). Initializing ₹999 Checkout...");
                navigate('/login');
              }} 
              className="w-full bg-gold text-black py-4 font-bold text-center uppercase tracking-widest text-sm hover:bg-white transition"
            >
              Acquire Q-Pass Now
            </button>
          </div>
        </div>
        
        <p className="mt-16 text-sm text-white/40 max-w-2xl mx-auto">
          The Q-Pass is a non-refundable, lifetime digital passport. Your 50% discount will automatically apply at checkout to all attars, experience kits, and private reserves once your account is authenticated.
        </p>
      </div>
    </div>
  );
};

export default QPass;
