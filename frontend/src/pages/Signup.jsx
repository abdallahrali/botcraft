import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import McButton from '../components/McButton';
import McInput from '../components/McInput';

/* ─── Background Particles ────────────────────────────────────── */
const bgParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: `${Math.random() * 5}s`,
  duration: `${Math.random() * 4 + 3}s`,
}));

/* ─── Pixel Crafting Table Icon ───────────────────────────────── */
const CraftIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-4"
  >
    {/* Table top */}
    <rect x="0" y="0" width="16" height="8" fill="#8b6b47" />
    <rect x="0" y="0" width="8" height="4" fill="#a07850" />
    <rect x="8" y="4" width="8" height="4" fill="#a07850" />
    {/* Grid lines */}
    <rect x="5" y="0" width="1" height="8" fill="#6b4d2d" />
    <rect x="10" y="0" width="1" height="8" fill="#6b4d2d" />
    <rect x="0" y="3" width="16" height="1" fill="#6b4d2d" />
    {/* Legs */}
    <rect x="1" y="8" width="3" height="8" fill="#8b6b47" />
    <rect x="12" y="8" width="3" height="8" fill="#8b6b47" />
    {/* Leg highlights */}
    <rect x="1" y="8" width="1" height="8" fill="#a07850" />
    <rect x="12" y="8" width="1" height="8" fill="#a07850" />
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('First and last name are required.');
      return false;
    }
    if (!form.email.trim()) {
      toast.error('Email is required.');
      return false;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      toast.success(res.data.message || 'Account created! Welcome to BotCraft!');
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-mc-obsidian overflow-hidden py-12">
      {/* Keyframes */}
      <style>{`
        @keyframes driftUp {
          0%, 100% { opacity: 0.1; transform: translateY(0); }
          50%      { opacity: 0.45; transform: translateY(-10px); }
        }
      `}</style>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Particles */}
      {bgParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-mc-cyan/40 pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `driftUp ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="mc-panel p-8 sm:p-10">
          <CraftIcon />
          <h1
            className="font-pixel text-xl text-center text-white mb-8"
            style={{ textShadow: '2px 2px 0 #1a1a1a' }}
          >
            CREATE ACCOUNT
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-pixel text-[9px] text-mc-stone mb-2 uppercase">
                  First Name
                </label>
                <McInput
                  type="text"
                  name="firstName"
                  placeholder="Steve"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block font-pixel text-[9px] text-mc-stone mb-2 uppercase">
                  Last Name
                </label>
                <McInput
                  type="text"
                  name="lastName"
                  placeholder="Crafter"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block font-pixel text-[9px] text-mc-stone mb-2 uppercase">
                Confirm Password
              </label>
              <McInput
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={form.confirmPassword}
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
              {loading ? 'Crafting Account...' : 'Join the Craft'}
            </McButton>
          </form>

          <p className="font-body text-lg text-mc-stone text-center mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-mc-grass hover:text-mc-cyan transition-colors underline underline-offset-4"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
