/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      /* ── Minecraft Color Palette ─────────────────────────── */
      colors: {
        mc: {
          obsidian:      '#1a1a2e',   // deep dark background
          'gui-dark':    '#2a2a2a',   // dark UI panels / nav
          'gui-light':   '#3c3f41',   // lighter UI panels / cards
          stone:         '#8b8b8b',   // stone gray
          'stone-shadow':'#555555',   // darker stone / shadows
          grass:         '#55aa55',   // minecraft grass green
          dirt:          '#8b6b47',   // dirt brown
          redstone:      '#ff3333',   // redstone red
          yellow:        '#ffff55',   // minecraft yellow
          cyan:          '#55ffff',   // diamond / cyan
        },
      },

      /* ── Typography ──────────────────────────────────────── */
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body:  ['"VT323"', 'monospace'],
      },

      /* ── Minecraft Bevel Box Shadows ─────────────────────── */
      boxShadow: {
        'mc-outset':
          'inset 2px 2px 0 rgba(255,255,255,0.25), inset -2px -2px 0 rgba(0,0,0,0.5), 3px 3px 0 #000',
        'mc-inset':
          'inset 2px 2px 0 rgba(0,0,0,0.55), inset -2px -2px 0 rgba(255,255,255,0.12)',
        'mc-hard':
          'inset 2px 2px 0 rgba(255,255,255,0.14), inset -2px -2px 0 rgba(0,0,0,0.6), 4px 4px 0 #000',
      },

      /* ── Drop Shadows ────────────────────────────────────── */
      dropShadow: {
        'mc-hard': '2px 2px 0 rgba(0,0,0,0.8)',
      },

      /* ── Custom Border Width (border-3) ──────────────────── */
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
