import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'moaaqil99@gmail.com') {
      onLogin(true);
      navigate('/admin/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-20 relative overflow-hidden">
      {/* Decorative Frame Breaking Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px] bg-gold pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px] bg-black pointer-events-none"></div>

      <div className="w-full max-w-md bg-white p-10 shadow-xl relative z-10 animate-fade-up">
        <div className="text-center mb-8">
          <img src="/logo_cropped.png" alt="Qilzir" className="h-16 mx-auto mb-6" />
          <h1 className="font-heading text-2xl uppercase tracking-widest text-black">Boutique Access</h1>
          <p className="text-mutted text-sm mt-2">Sign in to manage your collection.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-black mb-2 font-bold">Concierge Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(false); }}
              className="w-full border-b border-[#E0DCD3] bg-transparent py-3 px-2 outline-none focus:border-gold transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-black mb-2 font-bold">Passkey</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-[#E0DCD3] bg-transparent py-3 px-2 outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">Unverified credentials. Access denied.</p>}

          <button type="submit" className="btn btn-primary w-full mt-8 tracking-widest">
            AUTHENTICATE
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
