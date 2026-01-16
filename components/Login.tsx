import React, { useState } from 'react';
import { ViewMode, User } from '../types';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<ViewMode>('player');
  const [isRegistering, setIsRegistering] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setMobile('');
    setLicenseId('');
    setError('');
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user: User;

      if (isRegistering) {
        if (role === 'player') {
          if (!email || !password || !name) throw new Error("Please fill all fields");
          user = await authService.registerPlayer(email, password, name);
        } else {
          // Owner Registration
          if (!email || !password || !name || !licenseId || !mobile) throw new Error("All fields including License ID are required");
          user = await authService.registerOwner(email, password, name, licenseId, mobile);
        }
      } else {
        // Login for both roles
        if (!email || !password) throw new Error("Email and Password are required");
        user = await authService.login(email, password);

        if (user.role !== role) {
          throw new Error(`This account is registered as a ${user.role}, please switch tabs.`);
        }
      }

      onLogin(user);

    } catch (err: any) {
      console.error(err);
      let message = "Authentication failed. Please try again.";
      if (err.code === 'auth/invalid-credential') {
        message = "Incorrect email or password. Please check your credentials.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please login instead.";
      } else if (err.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-transparent rounded-3xl flex items-center justify-center mx-auto mb-6">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-3xl shadow-2xl" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">SportsHub</h1>
          <p className="text-slate-400 mt-3 font-medium">Join the elite network of sports venues</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          {/* Role Switcher */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-8 border border-slate-800">
            <button
              onClick={() => { setRole('player'); resetForm(); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'player' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500'}`}
            >
              Player
            </button>
            <button
              onClick={() => { setRole('owner'); resetForm(); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'owner' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500'}`}
            >
              Owner
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isRegistering ? `Create ${role === 'player' ? 'Player' : 'Owner'} Account` : `Login as ${role === 'player' ? 'Player' : 'Owner'}`}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}

            {isRegistering && (
              <>
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none placeholder:text-slate-600"
                    placeholder="Full Name"
                  />
                </div>
                {role === 'owner' && (
                  <>
                    <div>
                      <input
                        type="text"
                        value={licenseId}
                        onChange={e => setLicenseId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none placeholder:text-slate-600"
                        placeholder="Game License ID (LIC-XXXX)"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={e => setMobile(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none placeholder:text-slate-600"
                        placeholder="Mobile Number"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none placeholder:text-slate-600"
                placeholder="Email Address"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none placeholder:text-slate-600"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-slate-900 font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Login')}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={toggleMode}
                className="text-xs text-slate-500 hover:text-emerald-400 font-bold transition-colors"
              >
                {isRegistering ? 'Already have an account? Login' : (role === 'player' ? 'Create a new player account' : 'Register as new Venue Owner')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
