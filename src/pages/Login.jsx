import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Login = ({ onAdminLogin, onUserLogin }) => {
  const { refreshCustomers } = useStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (email === 'moaaqil99@gmail.com') {
      onAdminLogin(true);
      navigate('/admin/dashboard');
      return;
    }

    const API_BASE = import.meta.env.VITE_API_URL || '/api';

    try {
      if (isRegistering) {
        // Register new customer
        const res = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: name || email.split('@')[0], 
            email, 
            role: 'customer' 
          })
        });

        let data = {};
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        }

        if (!res.ok) {
           // If it's a 400, it's likely a validation error (like email already exists)
           if (res.status === 400) throw new Error(data.error || 'This identity is already established in our master record.');
           throw new Error('The house registry is currently unreachable. Please ensure the master server is active.');
        }

        // Refresh admin's customer list immediately
        if (refreshCustomers) refreshCustomers();

        setSuccess('Master account established. Accessing collection...');
        setTimeout(() => {
           onUserLogin({ email, name: name || data.name, hasQPass: false });
           navigate('/profile');
        }, 1500);
      } else {
        // Mock login for now
        onUserLogin({ email, name: email.split('@')[0], hasQPass: false });
        setSuccess('Access granted. Welcome back.');
        setTimeout(() => navigate('/profile'), 1000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-20 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px] bg-gold pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px] bg-black pointer-events-none"></div>

      <div className="w-full max-w-md bg-white p-12 shadow-[0_40px_100px_rgba(0,0,0,0.08)] relative z-10 animate-fade-up border border-[#EBE9E4]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 mb-8 bg-[#FAF9F6] border border-[#F0EDEA] rounded-sm shadow-inner">
            <img src="/logo_cropped.png" alt="Qilzir" className="h-10 mix-blend-multiply opacity-90" />
          </div>
          <h1 className="font-heading text-2xl uppercase tracking-[0.2em] text-black">
            {isRegistering ? 'The Inner Circle' : 'Collector Access'}
          </h1>
          <p className="text-[#9A9386] text-[10px] uppercase tracking-widest font-bold mt-3 leading-loose">
            {isRegistering ? 'Establish Your Master Identity' : 'Authenticate Your Presence'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {isRegistering && (
             <div>
              <label className="block text-xs uppercase tracking-widest text-black mb-2 font-bold">Collector Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-[#E0DCD3] bg-transparent py-3 px-2 outline-none focus:border-gold transition-colors"
                placeholder="Full Name"
                required={isRegistering}
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-black mb-2 font-bold">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-[#E0DCD3] bg-transparent py-3 px-2 outline-none focus:border-gold transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-black mb-2 font-bold">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-[#E0DCD3] bg-transparent py-3 px-2 outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-500 text-xs text-center border border-red-100">{error}</div>}
          {success && <div className="p-3 bg-green-50 text-green-700 text-xs text-center border border-green-100">{success}</div>}

          <button type="submit" className="btn btn-primary w-full mt-10 tracking-[0.2em] font-bold text-[11px] py-5">
            {isRegistering ? 'ESTABLISH ACCOUNT' : 'AUTHENTICATE'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#E0DCD3] pt-6">
          <p className="text-sm text-mutted">
            {isRegistering ? 'Already have an account?' : 'New to Qilzir?'}
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccess(''); }}
              className="ml-2 text-black font-bold uppercase tracking-widest hover:text-gold transition-colors"
            >
              {isRegistering ? 'Sign In' : 'Register'}
            </button>
          </p>
          
          <Link to="/qpass" className="inline-block mt-6 text-xs uppercase tracking-widest text-gold hover:text-black transition">
            Explore Q-Pass Privileges →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
