import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

/**
 * 8×8 Creeper face pixel art as inline SVG.
 * Each 1×1 rect maps to one pixel of the iconic creeper pattern.
 */
const CreeperFace = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 8 8"
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Background — light green */}
    <rect width="8" height="8" fill="#55FF55" />
    {/* Eyes — dark green */}
    <rect x="1" y="1" width="2" height="2" fill="#1a4a1a" />
    <rect x="5" y="1" width="2" height="2" fill="#1a4a1a" />
    {/* Nose / mouth — dark green */}
    <rect x="3" y="3" width="2" height="1" fill="#1a4a1a" />
    <rect x="2" y="4" width="4" height="1" fill="#1a4a1a" />
    <rect x="2" y="5" width="1" height="2" fill="#1a4a1a" />
    <rect x="5" y="5" width="1" height="2" fill="#1a4a1a" />
  </svg>
);

/**
 * Simplified Steve head pixel art (8×8) for the user avatar.
 */
const SteveHead = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 8 8"
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Hair — dark brown */}
    <rect width="8" height="2" fill="#4a3728" />
    <rect x="0" y="2" width="1" height="1" fill="#4a3728" />
    <rect x="7" y="2" width="1" height="1" fill="#4a3728" />
    {/* Skin */}
    <rect x="1" y="2" width="6" height="4" fill="#c8a07e" />
    {/* Eyes */}
    <rect x="2" y="3" width="1" height="1" fill="#FFFFFF" />
    <rect x="5" y="3" width="1" height="1" fill="#FFFFFF" />
    <rect x="2" y="3" width="1" height="1" fill="#4a3728" rx="0" />
    <rect x="5" y="3" width="1" height="1" fill="#4a3728" rx="0" />
    {/* Eye whites behind pupil */}
    <rect x="2" y="3" width="1" height="1" fill="#fff" />
    <rect x="5" y="3" width="1" height="1" fill="#fff" />
    {/* Pupils */}
    <rect x="2" y="3" width="0.5" height="1" fill="#4a3728" />
    <rect x="5" y="3" width="0.5" height="1" fill="#4a3728" />
    {/* Nose */}
    <rect x="3" y="4" width="2" height="1" fill="#b08968" />
    {/* Mouth */}
    <rect x="2" y="5" width="4" height="1" fill="#8b6b50" />
    {/* Bottom */}
    <rect x="0" y="6" width="8" height="2" fill="#4a3728" />
  </svg>
);

/** Hamburger / X icon for mobile toggle */
const MenuIcon = ({ open }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="transition-transform duration-200"
  >
    {open ? (
      <>
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="6" y1="18" x2="18" y2="6" />
      </>
    ) : (
      <>
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </>
    )}
  </svg>
);

/**
 * Navbar — top navigation bar for BotCraft.
 *
 * @param {boolean}  isAuthenticated – whether the user is logged in
 * @param {object}   user            – current user object (optional)
 * @param {function} onLogout        – callback executed after successful logout
 */
const Navbar = ({ isAuthenticated = false, user = null, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path.startsWith('#')) return false;
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Logged out successfully.');
      onLogout?.();
      navigate('/');
    } catch {
      toast.error('Logout failed — please try again.');
    }
  };

  const closeMobile = () => setMobileOpen(false);

  /* ── Link helpers ─────────────────────────────────────────── */
  const navLinkClasses = (path) =>
    `font-body text-lg tracking-wide transition-colors duration-150 ${
      isActive(path)
        ? 'text-mc-grass drop-shadow-mc-hard'
        : 'text-gray-300 hover:text-mc-grass'
    }`;

  /* ── Public (landing page) links ─────────────────────────── */
  const PublicLinks = () => (
    <>
      <a href="#features" onClick={closeMobile} className={navLinkClasses('#features')}>
        Features
      </a>
      <a href="#pricing" onClick={closeMobile} className={navLinkClasses('#pricing')}>
        Pricing
      </a>
      <Link
        to="/signup"
        onClick={closeMobile}
        className="mc-button mc-button-green text-[9px] px-5 py-2"
      >
        Start Crafting
      </Link>
    </>
  );

  /* ── Authenticated links ─────────────────────────────────── */
  const AuthLinks = () => (
    <>
      <Link to="/dashboard" onClick={closeMobile} className={navLinkClasses('/dashboard')}>
        Dashboard
      </Link>
      <Link to="/servers" onClick={closeMobile} className={navLinkClasses('/servers')}>
        Servers
      </Link>
      <Link to="/bots" onClick={closeMobile} className={navLinkClasses('/bots')}>
        Bots
      </Link>

      {/* User pill */}
      <div className="flex items-center gap-2 ml-2">
        <div className="mc-panel p-0.5 rounded-sm">
          <SteveHead size={24} />
        </div>
        <span className="font-body text-sm text-gray-300 hidden lg:inline">
          {user?.firstName ?? 'Player'}
        </span>
      </div>

      <button
        onClick={() => {
          closeMobile();
          handleLogout();
        }}
        className="mc-button text-[9px] px-4 py-2 !bg-mc-redstone/80 hover:!bg-mc-redstone"
      >
        Logout
      </button>
    </>
  );

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-mc-gui-dark/95 backdrop-blur-sm border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* ── Logo ────────────────────────────────────── */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2 group"
          >
            <CreeperFace size={28} />
            <span className="font-pixel text-mc-grass text-[11px] sm:text-xs drop-shadow-mc-hard group-hover:brightness-125 transition">
              BotCraft
            </span>
          </Link>

          {/* ── Desktop links ───────────────────────────── */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? <AuthLinks /> : <PublicLinks />}
          </div>

          {/* ── Mobile toggle ───────────────────────────── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-gray-300 hover:text-white p-1"
            aria-label="Toggle menu"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden mc-panel-dark border-t-2 border-black">
          <div className="flex flex-col gap-4 px-6 py-5">
            {isAuthenticated ? <AuthLinks /> : <PublicLinks />}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
