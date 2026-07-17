import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

/* ─── Inline SVG Pixel Icons ──────────────────────────────────── */

const CompassIcon = () => (
  <svg width="48" height="48" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
    <rect x="6" y="0" width="4" height="2" fill="#c0c0c0"/>
    <rect x="4" y="2" width="2" height="2" fill="#c0c0c0"/>
    <rect x="10" y="2" width="2" height="2" fill="#c0c0c0"/>
    <rect x="2" y="4" width="2" height="2" fill="#c0c0c0"/>
    <rect x="12" y="4" width="2" height="2" fill="#c0c0c0"/>
    <rect x="2" y="6" width="2" height="4" fill="#c0c0c0"/>
    <rect x="12" y="6" width="2" height="4" fill="#c0c0c0"/>
    <rect x="7" y="3" width="2" height="4" fill="#ff3333"/>
    <rect x="7" y="7" width="2" height="4" fill="#ffffff"/>
    <rect x="5" y="7" width="2" height="2" fill="#eee"/>
    <rect x="9" y="7" width="2" height="2" fill="#eee"/>
    <rect x="4" y="10" width="2" height="2" fill="#c0c0c0"/>
    <rect x="10" y="10" width="2" height="2" fill="#c0c0c0"/>
    <rect x="6" y="12" width="4" height="2" fill="#c0c0c0"/>
  </svg>
);

const PickaxeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
    <rect x="4" y="0" width="2" height="2" fill="#55ffff"/>
    <rect x="6" y="0" width="2" height="2" fill="#55ffff"/>
    <rect x="8" y="0" width="2" height="2" fill="#55ffff"/>
    <rect x="10" y="0" width="2" height="2" fill="#55ffff"/>
    <rect x="2" y="2" width="2" height="2" fill="#55ffff"/>
    <rect x="10" y="2" width="2" height="2" fill="#3ac5c5"/>
    <rect x="8" y="4" width="2" height="2" fill="#8b6b47"/>
    <rect x="6" y="6" width="2" height="2" fill="#8b6b47"/>
    <rect x="4" y="8" width="2" height="2" fill="#8b6b47"/>
    <rect x="2" y="10" width="2" height="2" fill="#8b6b47"/>
    <rect x="0" y="12" width="2" height="2" fill="#8b6b47"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
    <rect x="4" y="4" width="2" height="2" fill="#c0c0c0"/>
    <rect x="10" y="4" width="2" height="2" fill="#c0c0c0"/>
    <rect x="2" y="6" width="2" height="2" fill="#c0c0c0"/>
    <rect x="6" y="6" width="4" height="2" fill="#ffffff"/>
    <rect x="12" y="6" width="2" height="2" fill="#c0c0c0"/>
    <rect x="2" y="8" width="2" height="2" fill="#c0c0c0"/>
    <rect x="4" y="8" width="2" height="2" fill="#ffffff"/>
    <rect x="6" y="8" width="4" height="2" fill="#55ffff"/>
    <rect x="10" y="8" width="2" height="2" fill="#ffffff"/>
    <rect x="12" y="8" width="2" height="2" fill="#c0c0c0"/>
    <rect x="4" y="10" width="2" height="2" fill="#c0c0c0"/>
    <rect x="6" y="10" width="4" height="2" fill="#ffffff"/>
    <rect x="10" y="10" width="2" height="2" fill="#c0c0c0"/>
  </svg>
);

/* ─── Floating Pixel Block ────────────────────────────────────── */
const FloatingBlock = ({ color, size = 40, delay = '0s', left, top }) => (
  <div
    className="absolute opacity-30 pointer-events-none"
    style={{
      left,
      top,
      width: size,
      height: size,
      animation: `blockFloat 6s ease-in-out ${delay} infinite`,
    }}
  >
    <svg width={size} height={size} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="10" fill={color} />
      <rect width="5" height="5" fill="rgba(255,255,255,0.15)" />
      <rect x="5" y="5" width="5" height="5" fill="rgba(0,0,0,0.15)" />
    </svg>
  </div>
);

/* ─── Particle Field ──────────────────────────────────────────── */
const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: `${Math.random() * 4}s`,
  duration: `${Math.random() * 3 + 2}s`,
}));

/* ─── Feature Card ────────────────────────────────────────────── */
const FeatureCard = ({ icon, title, description }) => (
  <div className="mc-panel p-6 text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
    {icon}
    <h3 className="font-pixel text-sm text-mc-grass mb-3">{title}</h3>
    <p className="font-body text-xl text-mc-stone leading-snug">{description}</p>
  </div>
);

/* ─── Step Card ───────────────────────────────────────────────── */
const StepCard = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center">
    {/* Pixel number block */}
    <div className="w-16 h-16 bg-mc-grass shadow-mc-outset flex items-center justify-center mb-4">
      <span className="font-pixel text-2xl text-white" style={{ textShadow: '2px 2px 0 #1a3a1a' }}>
        {number}
      </span>
    </div>
    <h3 className="font-pixel text-xs text-white mb-2">{title}</h3>
    <p className="font-body text-lg text-mc-stone">{description}</p>
  </div>
);

/* ─── Pricing Card ────────────────────────────────────────────── */
const PricingCard = ({ name, price, period, features, highlight, cta }) => (
  <div
    className={`mc-panel p-6 flex flex-col relative ${
      highlight
        ? 'border-mc-grass ring-2 ring-mc-grass/40 ring-offset-2 ring-offset-mc-obsidian scale-105'
        : ''
    }`}
  >
    {highlight && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-mc-grass px-4 py-1 shadow-mc-outset">
        <span className="font-pixel text-[8px] uppercase tracking-widest text-white">Most Popular</span>
      </div>
    )}
    <h3 className="font-pixel text-sm text-center text-white mb-2">{name}</h3>
    <div className="text-center mb-4">
      <span className="font-pixel text-3xl text-mc-grass">{price}</span>
      {period && <span className="font-body text-lg text-mc-stone">/{period}</span>}
    </div>
    <ul className="flex-1 space-y-2 mb-6">
      {features.map((f, i) => (
        <li key={i} className="font-body text-lg text-mc-stone flex items-start gap-2">
          <span className="text-mc-grass mt-1">■</span>
          {f}
        </li>
      ))}
    </ul>
    <Link
      to="/register"
      className={`mc-button text-center block ${highlight ? 'mc-button-green' : ''}`}
    >
      {cta}
    </Link>
  </div>
);

/* ─── Stats Data ──────────────────────────────────────────────── */
const stats = [
  { value: '10K+', label: 'Bots Deployed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '50K+', label: 'Players' },
  { value: '24/7', label: 'Support' },
];

/* ════════════════════════════════════════════════════════════════
   LANDING PAGE
   ════════════════════════════════════════════════════════════════ */
const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar isAuthenticated={false} />

      {/* ── GLOBAL KEYFRAMES (injected once) ──────────────────── */}
      <style>{`
        @keyframes blockFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-24px) rotate(6deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50%      { opacity: 0.9; }
        }
        @keyframes heroGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(85,170,85,0.4), 0 0 30px rgba(85,170,85,0.2); }
          50%      { text-shadow: 0 0 20px rgba(85,170,85,0.7), 0 0 60px rgba(85,170,85,0.35); }
        }
      `}</style>

      {/* ═══════════ SECTION 1 — HERO ═══════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: `
            linear-gradient(180deg,
              #0a0a2e 0%,
              #0f1b3e 30%,
              #162d50 55%,
              #1f4068 70%,
              #55aa55 75%,
              #4a9a4a 76%,
              #8b6b47 78%,
              #7a5c3a 82%,
              #6b4d2d 88%,
              #3c2a14 100%
            )`,
        }}
      >
        {/* Particles / Stars */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animation: `twinkle ${p.duration} ease-in-out ${p.delay} infinite`,
            }}
          />
        ))}

        {/* Floating pixel blocks */}
        <FloatingBlock color="#55aa55" size={50} delay="0s" left="10%" top="20%" />
        <FloatingBlock color="#8b6b47" size={35} delay="1.5s" left="80%" top="30%" />
        <FloatingBlock color="#55ffff" size={28} delay="3s" left="25%" top="65%" />
        <FloatingBlock color="#ff3333" size={42} delay="0.8s" left="75%" top="60%" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="font-pixel text-2xl sm:text-3xl md:text-5xl text-white mb-6 leading-relaxed"
            style={{ animation: 'heroGlow 3s ease-in-out infinite' }}
          >
            AUTOMATE YOUR
            <br />
            MINECRAFT WORLD
          </h1>
          <p className="font-body text-xl sm:text-2xl text-mc-stone mb-10 max-w-2xl mx-auto leading-snug">
            Deploy intelligent bots. Farm resources. Explore endlessly.
            <br className="hidden sm:block" />
            All from your browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="mc-button mc-button-green text-center px-8 py-4">
              Deploy Your First Bot
            </Link>
            <a href="#how-it-works" className="mc-button text-center px-8 py-4">
              Watch Demo
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-mc-stone font-body text-lg animate-bounce">
          ▼ Scroll Down ▼
        </div>
      </section>

      {/* ═══════════ SECTION 2 — STATS BAR ═════════════════════ */}
      <section className="relative bg-mc-gui-dark border-y-2 border-mc-stone-shadow">
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-pixel text-lg sm:text-xl text-mc-grass">{s.value}</p>
              <p className="font-body text-lg text-mc-stone">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ SECTION 3 — FEATURES ══════════════════════ */}
      <section className="py-20 px-4 bg-mc-obsidian">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-pixel text-lg sm:text-xl text-center text-white mb-4">
            POWERFUL FEATURES
          </h2>
          <p className="font-body text-xl text-mc-stone text-center mb-12 max-w-xl mx-auto">
            Everything you need to command an army of Minecraft bots.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CompassIcon />}
              title="SMART PATHFINDING"
              description="Advanced A* navigation with terrain awareness. Your bots find the fastest route through any landscape."
            />
            <FeatureCard
              icon={<PickaxeIcon />}
              title="AUTO RESOURCE FARMING"
              description="Set targets and let bots mine, chop, and harvest automatically. Stockpile resources while you're AFK."
            />
            <FeatureCard
              icon={<EyeIcon />}
              title="REAL-TIME 3D VIEWER"
              description="Watch your bots in action through an embedded 3D viewport. See exactly what they see, live."
            />
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 4 — HOW IT WORKS ══════════════════ */}
      <section
        id="how-it-works"
        className="py-20 px-4 bg-gradient-to-b from-mc-obsidian via-mc-gui-dark to-mc-obsidian"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="font-pixel text-lg sm:text-xl text-center text-white mb-4">
            HOW IT WORKS
          </h2>
          <p className="font-body text-xl text-mc-stone text-center mb-16 max-w-lg mx-auto">
            Get your first bot running in under two minutes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <StepCard
              number="1"
              title="CREATE ACCOUNT"
              description="Sign up for free and access your dashboard instantly."
            />

            {/* Arrow connector (desktop only) */}
            <div className="hidden md:flex items-center justify-center -mt-6">
              <div className="flex items-center gap-2 text-mc-stone">
                <div className="w-12 h-[3px] bg-mc-stone-shadow" />
                <span className="font-pixel text-lg">→</span>
              </div>
            </div>

            <StepCard
              number="2"
              title="ADD YOUR SERVER"
              description="Enter your Minecraft server address and port — we handle the rest."
            />

            <div className="hidden md:flex items-center justify-center -mt-6">
              <div className="flex items-center gap-2 text-mc-stone">
                <div className="w-12 h-[3px] bg-mc-stone-shadow" />
                <span className="font-pixel text-lg">→</span>
              </div>
            </div>

            <StepCard
              number="3"
              title="DEPLOY BOTS"
              description="Choose a bot template and deploy. Watch them work in real-time."
            />
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 5 — PRICING ═══════════════════════ */}
      <section className="py-20 px-4 bg-mc-obsidian">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-pixel text-lg sm:text-xl text-center text-white mb-4">
            CHOOSE YOUR PLAN
          </h2>
          <p className="font-body text-xl text-mc-stone text-center mb-12 max-w-lg mx-auto">
            Start free. Upgrade when you need more power.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <PricingCard
              name="FREE"
              price="$0"
              period=""
              features={['1 Bot', '1 Server', 'Basic pathfinding', 'Community support']}
              cta="Get Started"
            />
            <PricingCard
              name="PRO"
              price="$9.99"
              period="mo"
              features={[
                '10 Bots',
                '5 Servers',
                'Advanced AI modules',
                'Priority support',
                '3D Viewer access',
              ]}
              highlight
              cta="Go Pro"
            />
            <PricingCard
              name="ENTERPRISE"
              price="$29.99"
              period="mo"
              features={[
                'Unlimited Bots',
                'Unlimited Servers',
                'Custom bot modules',
                'Dedicated support',
                'API access',
              ]}
              cta="Contact Us"
            />
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 6 — FOOTER ════════════════════════ */}
      <footer className="bg-mc-gui-dark border-t-2 border-mc-stone-shadow py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Logo / Brand */}
          <div>
            <h3 className="font-pixel text-sm text-mc-grass mb-3">BOTCRAFT</h3>
            <p className="font-body text-lg text-mc-stone">
              Intelligent Minecraft automation, right from your browser.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-pixel text-[10px] text-white mb-3 uppercase">Product</h4>
            <ul className="space-y-2 font-body text-lg text-mc-stone">
              <li><a href="#" className="hover:text-mc-grass transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-mc-grass transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-mc-grass transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-pixel text-[10px] text-white mb-3 uppercase">Company</h4>
            <ul className="space-y-2 font-body text-lg text-mc-stone">
              <li><a href="#" className="hover:text-mc-grass transition-colors">About</a></li>
              <li><a href="#" className="hover:text-mc-grass transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-mc-grass transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-pixel text-[10px] text-white mb-3 uppercase">Legal</h4>
            <ul className="space-y-2 font-body text-lg text-mc-stone">
              <li><a href="#" className="hover:text-mc-grass transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-mc-grass transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-mc-grass transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-mc-stone-shadow text-center">
          <p className="font-body text-lg text-mc-stone-shadow">
            © {new Date().getFullYear()} BotCraft. Not affiliated with Mojang or Microsoft.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
