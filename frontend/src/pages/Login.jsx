import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import McButton from '../components/McButton';
import McInput from '../components/McInput';

/* ─── Background Void Particles ───────────────────────────────── */
const voidParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: `${Math.random() * 5}s`,
  duration: `${Math.random() * 4 + 3}s`,
}));

/* ─── Pixel Key / Sword Icon ──────────────────────────────────── */
const KeyIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-4"
  >
    {/* Key head (circular ring) */}
    <rect x="0" y="4" width="2" height="4" fill="#ffff55" />
    <rect x="2" y="2" width="2" height="2" fill="#ffff55" />
    <rect x="2" y="8" width="2" height="2" fill="#ffff55" />
    <rect x="4" y="0" width="4" height="2" fill="#ffff55" />
    <rect x="4" y="10" width="4" height="2" fill="#ffff55" />
    <rect x="8" y="2" width="2" height="2" fill="#ffff55" />
    <rect x="8" y="8" width="2" height="2" fill="#ffff55" />
    {/* Key shaft */}
    <rect x="8" y="4" width="6" height="4" fill="#ccaa00" />
    {/* Key teeth */}
    <rect x="12" y="8" width="2" height="2" fill="#ccaa00" />
    <rect x="14" y="4" width="2" height="4" fill="#ccaa00" />
    {/* Inner hole */}
    <rect x="4" y="4" width="4" height="4" fill="#1a1a2e" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      toast.success(res.data.message || 'Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-mc-obsidian overflow-hidden">
      {/* Keyframes */}
      <style>{`
        @keyframes voidDrift {
          0%, 100% { opacity: 0.1; transform: translateY(0); }
          50%      { opacity: 0.5; transform: translateY(-12px); }
        }
      `}</style>

      {/* Subtle dark grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Void particles */}
      {voidParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-mc-grass/60 pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `voidDrift ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="mc-panel p-8 sm:p-10">
          <KeyIcon />
          <h1
            className="font-pixel text-xl text-center text-white mb-8"
            style={{ textShadow: '2px 2px 0 #1a1a1a' }}
          >
            LOGIN
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-pixel text-[9px] text-mc-stone mb-2 uppercase">
                Email
              </label>
              <McInput
                type="email"
                name="email"
                placeholder="steve@minecraft.net"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block font-pixel text-[9px] text-mc-stone mb-2 uppercase">
                Password
              </label>
              <McInput
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <McButton
              type="submit"
              variant="green"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Enter World'}
            </McButton>
          </form>

          <p className="font-body text-lg text-mc-stone text-center mt-6">
            Need an account?{' '}
            <Link
              to="/signup"
              className="text-mc-grass hover:text-mc-cyan transition-colors underline underline-offset-4"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
