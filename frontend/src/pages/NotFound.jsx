import React from 'react';
import { Link } from 'react-router-dom';
import McButton from '../components/McButton';

/* ─── Ender Particles ─────────────────────────────────────────── */
const enderParticles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 4 + 2,
  delay: `${Math.random() * 6}s`,
  duration: `${Math.random() * 5 + 3}s`,
  color: Math.random() > 0.5 ? '#c084fc' : '#e879f9',
}));

/* ─── Enderman Pixel Art ──────────────────────────────────────── */
const Enderman = () => (
  <svg
    width="64"
    height="128"
    viewBox="0 0 8 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-6"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Head */}
    <rect x="1" y="0" width="6" height="4" fill="#1a1a2e" />
    <rect x="0" y="1" width="1" height="2" fill="#1a1a2e" />
    <rect x="7" y="1" width="1" height="2" fill="#1a1a2e" />
    {/* Eyes */}
    <rect x="1" y="2" width="2" height="1" fill="#c084fc" />
    <rect x="5" y="2" width="2" height="1" fill="#c084fc" />
    {/* Eye glow */}
    <rect x="2" y="2" width="1" height="1" fill="#e879f9" />
    <rect x="5" y="2" width="1" height="1" fill="#e879f9" />
    {/* Body */}
    <rect x="2" y="4" width="4" height="5" fill="#111118" />
    <rect x="3" y="4" width="2" height="1" fill="#1a1a2e" />
    {/* Arms */}
    <rect x="0" y="5" width="2" height="1" fill="#111118" />
    <rect x="6" y="5" width="2" height="1" fill="#111118" />
    <rect x="0" y="6" width="1" height="3" fill="#111118" />
    <rect x="7" y="6" width="1" height="3" fill="#111118" />
    {/* Legs */}
    <rect x="2" y="9" width="2" height="5" fill="#111118" />
    <rect x="4" y="9" width="2" height="5" fill="#0d0d14" />
    {/* Feet */}
    <rect x="1" y="14" width="3" height="2" fill="#111118" />
    <rect x="4" y="14" width="3" height="2" fill="#0d0d14" />
  </svg>
);

const NotFound = () => {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      style={{
        background:
          'linear-gradient(180deg, #1a0a2e 0%, #1a1a2e 40%, #0d0d1a 70%, #1a0a2e 100%)',
      }}
    >
      {/* Keyframes */}
      <style>{`
        @keyframes enderFloat {
          0%, 100% { opacity: 0.2; transform: translateY(0) scale(1); }
          50%      { opacity: 0.7; transform: translateY(-18px) scale(1.2); }
        }
        @keyframes glitch404 {
          0%, 90%, 100% {
            transform: translate(0, 0) skew(0deg);
            text-shadow: 0 0 20px rgba(192,132,252,0.6), 0 0 60px rgba(192,132,252,0.3);
          }
          92% {
            transform: translate(-4px, 2px) skew(-2deg);
            text-shadow: -3px 0 #e879f9, 3px 0 #c084fc;
          }
          94% {
            transform: translate(3px, -1px) skew(1deg);
            text-shadow: 3px 0 #e879f9, -3px 0 #c084fc;
          }
          96% {
            transform: translate(-2px, 3px) skew(-1deg);
            text-shadow: -2px 0 #e879f9, 2px 0 #c084fc;
          }
          98% {
            transform: translate(4px, -2px) skew(2deg);
            text-shadow: 4px 0 #e879f9, -4px 0 #c084fc;
          }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
      `}</style>

      {/* Ender Particles */}
      {enderParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `enderFloat ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* 404 */}
        <h1
          className="font-pixel text-7xl sm:text-8xl text-purple-300 mb-2"
          style={{
            animation: 'glitch404 4s ease-in-out infinite',
            textShadow:
              '0 0 20px rgba(192,132,252,0.6), 0 0 60px rgba(192,132,252,0.3)',
          }}
        >
          404
        </h1>

        {/* Subtitle */}
        <h2
          className="font-pixel text-lg sm:text-xl text-purple-300 mb-8"
          style={{
            animation: 'subtlePulse 3s ease-in-out infinite',
            textShadow: '0 0 12px rgba(192,132,252,0.4)',
          }}
        >
          Lost in the Void
        </h2>

        {/* Enderman */}
        <Enderman />

        {/* Description */}
        <p className="font-body text-xl sm:text-2xl text-mc-stone max-w-md mb-10 leading-snug">
          The block you&apos;re looking for doesn&apos;t exist in this
          dimension.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link to="/dashboard">
            <McButton variant="green">Respawn</McButton>
          </Link>
          <Link
            to="/"
            className="font-body text-lg text-purple-300 hover:text-purple-100 underline underline-offset-4 transition-colors"
          >
            Return to Overworld
          </Link>
        </div>
      </div>

      {/* Bottom void gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a0a2e] to-transparent pointer-events-none" />
    </div>
  );
};

export default NotFound;
