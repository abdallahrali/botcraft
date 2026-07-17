import React, { useState, useEffect } from 'react';

/* ── CSS-only keyframe animations (injected once) ──────────────── */
const animationStyles = `
@keyframes mc-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-12px) rotate(2deg); }
}
@keyframes mc-progress {
  0%   { width: 0%; }
  100% { width: 100%; }
}
@keyframes mc-pulse-text {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
}
`;

/**
 * Inline SVG of a Minecraft-style dirt/grass block (16×16 pixel grid).
 */
const GrassBlock = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      imageRendering: 'pixelated',
      animation: 'mc-float 2s ease-in-out infinite',
    }}
  >
    {/* Grass top */}
    <rect width="16" height="3" fill="#55aa55" />
    <rect x="0"  y="0" width="2" height="1" fill="#66cc66" />
    <rect x="5"  y="0" width="3" height="1" fill="#66cc66" />
    <rect x="10" y="0" width="2" height="1" fill="#66cc66" />
    <rect x="14" y="0" width="2" height="1" fill="#66cc66" />
    <rect x="2"  y="1" width="2" height="1" fill="#44aa44" />
    <rect x="8"  y="1" width="2" height="1" fill="#44aa44" />
    <rect x="13" y="1" width="2" height="1" fill="#44aa44" />

    {/* Dirt body */}
    <rect y="3" width="16" height="13" fill="#8b6b47" />
    {/* Noise / texture pixels */}
    <rect x="1"  y="4"  width="2" height="1" fill="#7a5c3a" />
    <rect x="6"  y="5"  width="2" height="1" fill="#7a5c3a" />
    <rect x="11" y="4"  width="2" height="1" fill="#9b7b57" />
    <rect x="3"  y="7"  width="2" height="1" fill="#9b7b57" />
    <rect x="8"  y="8"  width="2" height="1" fill="#7a5c3a" />
    <rect x="13" y="7"  width="1" height="1" fill="#7a5c3a" />
    <rect x="1"  y="10" width="2" height="1" fill="#9b7b57" />
    <rect x="5"  y="11" width="2" height="1" fill="#7a5c3a" />
    <rect x="10" y="10" width="3" height="1" fill="#9b7b57" />
    <rect x="3"  y="13" width="2" height="1" fill="#7a5c3a" />
    <rect x="8"  y="14" width="2" height="1" fill="#9b7b57" />
    <rect x="12" y="13" width="2" height="1" fill="#7a5c3a" />
  </svg>
);

/** Cycling sub-messages */
const SUB_MESSAGES = [
  'Loading terrain...',
  'Spawning entities...',
  'Building chunks...',
  'Planting trees...',
  'Filling oceans...',
];

/**
 * LoadingScreen — full-screen Minecraft-themed loading overlay.
 *
 * @param {string} message – primary message (defaults to 'Generating World...')
 */
const LoadingScreen = ({ message = 'Generating World...' }) => {
  const [subIdx, setSubIdx] = useState(0);

  /* Cycle the sub-message every 2 seconds */
  useEffect(() => {
    const timer = setInterval(() => {
      setSubIdx((prev) => (prev + 1) % SUB_MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Inject keyframes once */}
      <style>{animationStyles}</style>

      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-mc-obsidian/95 backdrop-blur-sm">
        {/* Floating grass block */}
        <div className="mb-8">
          <GrassBlock />
        </div>

        {/* Primary message */}
        <h2 className="font-pixel text-mc-grass text-xs sm:text-sm mb-6 drop-shadow-mc-hard tracking-wider">
          {message}
        </h2>

        {/* Progress bar container */}
        <div className="w-64 sm:w-80 h-5 mc-inset-box relative overflow-hidden">
          {/* Animated green bar — CSS-only, 4s loop */}
          <div
            className="absolute inset-y-0 left-0 bg-mc-grass"
            style={{
              animation: 'mc-progress 4s ease-in-out infinite',
              imageRendering: 'pixelated',
            }}
          />
          {/* Scanline / pixel overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)',
            }}
          />
        </div>

        {/* Sub-message */}
        <p
          className="font-body text-lg text-mc-stone mt-4 tracking-wide"
          style={{ animation: 'mc-pulse-text 2s ease-in-out infinite' }}
        >
          {SUB_MESSAGES[subIdx]}
        </p>
      </div>
    </>
  );
};

export default LoadingScreen;
