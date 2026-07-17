import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRobot, FaServer, FaClock, FaPlay, FaStop, FaRedo, FaRocket, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';

/* ──────────────────────────────────────────────────────────────
 *  STEVE HEAD – Inline 8×8 pixel art SVG
 * ────────────────────────────────────────────────────────────── */
const SteveHead = ({ size = 48 }) => {
  // Row-major 8×8 grid (H = hair brown, S = skin, E = eye dark, W = eye white, M = mouth dark, N = nose)
  const palette = {
    H: '#6B3A1F',  // hair
    D: '#553118',  // dark hair
    S: '#C6956C',  // skin
    L: '#D9A87C',  // light skin
    E: '#1A1A2E',  // eye (dark)
    W: '#FFFFFF',  // eye white
    M: '#8B4C3B',  // mouth / dark skin
    N: '#A97B5A',  // nose shadow
  };

  const grid = [
    ['H','H','H','H','H','H','H','H'],
    ['H','D','H','H','H','H','D','H'],
    ['S','S','S','S','S','S','S','S'],
    ['S','W','E','S','S','E','W','S'],
    ['S','S','S','N','N','S','S','S'],
    ['S','S','L','S','S','L','S','S'],
    ['S','S','M','M','M','M','S','S'],
    ['M','S','S','S','S','S','S','M'],
  ];

  const px = size / 8;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="drop-shadow-[3px_3px_0_rgba(0,0,0,0.6)]"
      style={{ imageRendering: 'pixelated' }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <rect
            key={`${x}-${y}`}
            x={x * px}
            y={y * px}
            width={px}
            height={px}
            fill={palette[cell]}
          />
        ))
      )}
    </svg>
  );
};

/* ──────────────────────────────────────────────────────────────
 *  ANIMATED COUNTER – counts up from 0 to `end`
 * ────────────────────────────────────────────────────────────── */
const AnimatedNumber = ({ end, duration = 800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.max(1, Math.floor(end / (duration / 30)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count}</>;
};

/* ──────────────────────────────────────────────────────────────
 *  PULSING DOT – animated status indicator
 * ────────────────────────────────────────────────────────────── */
const PulsingDot = ({ color = 'bg-green-400' }) => (
  <span className="relative flex h-2.5 w-2.5">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
  </span>
);

/* ──────────────────────────────────────────────────────────────
 *  STATUS BADGE
 * ────────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const config = {
    online:     { bg: 'bg-green-500/20',  text: 'text-green-400',  dot: 'bg-green-400',  pulse: true  },
    offline:    { bg: 'bg-red-500/20',     text: 'text-red-400',    dot: null,            pulse: false },
    connecting: { bg: 'bg-yellow-500/20',  text: 'text-yellow-400', dot: 'bg-yellow-400', pulse: true  },
    error:      { bg: 'bg-red-700/20',     text: 'text-red-300',    dot: null,            pulse: false },
  };

  const c = config[status] || config.offline;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-body text-lg ${c.bg} ${c.text}`}>
      {c.pulse && c.dot && <PulsingDot color={c.dot} />}
      {status}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════
 *  USER DASHBOARD PAGE
 * ══════════════════════════════════════════════════════════════ */
const UserDashboard = () => {
  const navigate = useNavigate();

  /* ── State ────────────────────────────────────────────────── */
  const [user, setUser] = useState(null);
  const [bots, setBots] = useState([]);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingBots, setTogglingBots] = useState({}); // { [botId]: true }

  /* ── Data fetching ────────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [botsRes, serversRes] = await Promise.all([
        api.get('/bots'),
        api.get('/servers'),
      ]);
      setBots(botsRes.data?.data ?? []);
      setServers(serversRes.data?.data ?? []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Bot start / stop ─────────────────────────────────────── */
  const handleToggleBot = async (bot) => {
    const action = bot.status === 'online' || bot.status === 'connecting' ? 'stop' : 'start';
    setTogglingBots((prev) => ({ ...prev, [bot.id]: true }));
    try {
      if (action === 'start') {
        await api.post('/bots/start', { botId: bot.id });
        toast.success(`Starting ${bot.bot_name}...`);
      } else {
        await api.post('/bots/stop', { botId: bot.id });
        toast.success(`Stopping ${bot.bot_name}...`);
      }
      // Re-fetch to get fresh statuses
      const res = await api.get('/bots');
      setBots(res.data?.data ?? []);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} bot.`);
    } finally {
      setTogglingBots((prev) => ({ ...prev, [bot.id]: false }));
    }
  };

  /* ── Helpers ──────────────────────────────────────────────── */
  const getServerName = (serverId) => {
    const srv = servers.find((s) => s.id === serverId);
    return srv ? srv.server_name : '—';
  };

  const getBotsForServer = (serverId) => bots.filter((b) => b.server_id === serverId).length;

  const onlineBots = bots.filter((b) => b.status === 'online').length;

  /* ══════════════════════════════════════════════════════════
   *  LOADING STATE
   * ══════════════════════════════════════════════════════════ */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        {/* Animated pickaxe / spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-mc-stone-shadow border-t-mc-grass rounded-sm animate-spin" />
        </div>
        <p className="font-pixel text-xs text-mc-grass animate-pulse tracking-wider">
          Loading Command Center...
        </p>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
   *  ERROR STATE
   * ══════════════════════════════════════════════════════════ */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4">
        <div className="mc-panel p-8 max-w-md w-full text-center space-y-4">
          <div className="text-4xl mb-2">⚠️</div>
          <h2 className="font-pixel text-sm text-mc-redstone">Something Went Wrong</h2>
          <p className="font-body text-xl text-gray-400">{error}</p>
          <button onClick={fetchData} className="mc-button mc-button-green mt-4 inline-flex items-center gap-2">
            <FaRedo /> Retry
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
   *  MAIN RENDER
   * ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">

        {/* ── WELCOME BANNER ─────────────────────────────────── */}
        <section className="mc-panel overflow-hidden">
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 p-6 sm:p-8 flex items-center gap-6">
            <div className="flex-shrink-0 hidden sm:block">
              <SteveHead size={64} />
            </div>
            <div>
              <h1 className="font-pixel text-sm sm:text-base text-mc-grass leading-relaxed">
                Welcome back, Commander!
              </h1>
              <p className="font-body text-xl sm:text-2xl text-gray-400 mt-1">
                Your command center awaits. Deploy bots, manage servers, dominate.
              </p>
            </div>
          </div>
        </section>

        {/* ── QUICK STATS ROW ────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Bots */}
          <div className="mc-panel p-5 group hover:border-mc-grass transition-colors duration-200 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-lg text-gray-400 uppercase tracking-wide">Total Bots</p>
                <p className="font-pixel text-2xl text-mc-grass mt-1">
                  <AnimatedNumber end={bots.length} />
                </p>
              </div>
              <div className="text-3xl text-mc-stone group-hover:text-mc-grass transition-colors">
                <FaRobot />
              </div>
            </div>
          </div>

          {/* Online Bots */}
          <div className="mc-panel p-5 group hover:border-green-500 transition-colors duration-200 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-lg text-gray-400 uppercase tracking-wide">Online Bots</p>
                <p className="font-pixel text-2xl text-green-400 mt-1">
                  <AnimatedNumber end={onlineBots} />
                </p>
              </div>
              <div className="text-3xl text-mc-stone group-hover:text-green-400 transition-colors">
                <PulsingDot color="bg-green-400" />
              </div>
            </div>
          </div>

          {/* Total Servers */}
          <div className="mc-panel p-5 group hover:border-mc-cyan transition-colors duration-200 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-lg text-gray-400 uppercase tracking-wide">Servers</p>
                <p className="font-pixel text-2xl text-mc-cyan mt-1">
                  <AnimatedNumber end={servers.length} />
                </p>
              </div>
              <div className="text-3xl text-mc-stone group-hover:text-mc-cyan transition-colors">
                <FaServer />
              </div>
            </div>
          </div>

          {/* Uptime */}
          <div className="mc-panel p-5 group hover:border-mc-yellow transition-colors duration-200 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-lg text-gray-400 uppercase tracking-wide">Uptime</p>
                <p className="font-pixel text-2xl text-mc-yellow mt-1">99.9%</p>
              </div>
              <div className="text-3xl text-mc-stone group-hover:text-mc-yellow transition-colors">
                <FaClock />
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICK ACTIONS ──────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/bots"
            className="mc-button mc-button-green flex items-center justify-center gap-3 py-5 text-center text-[12px] hover:scale-[1.02] transition-transform"
          >
            <FaRocket className="text-lg" />
            Deploy New Bot
          </Link>
          <Link
            to="/servers"
            className="mc-button flex items-center justify-center gap-3 py-5 text-center text-[12px] hover:scale-[1.02] transition-transform"
          >
            <FaPlus className="text-lg" />
            Add Target Server
          </Link>
        </section>

        {/* ── RECENT BOT ACTIVITY ────────────────────────────── */}
        <section className="mc-panel">
          <div className="border-b-3 border-mc-stone-shadow p-5 flex items-center justify-between">
            <h2 className="font-pixel text-xs sm:text-sm text-white">Recent Bot Activity</h2>
            {bots.length > 0 && (
              <Link to="/bots" className="font-body text-lg text-mc-grass hover:underline">
                View All →
              </Link>
            )}
          </div>

          {bots.length === 0 ? (
            /* Empty state */
            <div className="p-10 text-center space-y-4">
              <div className="text-5xl opacity-30">🤖</div>
              <p className="font-pixel text-xs text-gray-500">No bots deployed yet</p>
              <p className="font-body text-xl text-gray-500">
                Deploy your first bot and start automating!
              </p>
              <Link
                to="/bots"
                className="mc-button mc-button-green inline-flex items-center gap-2 mt-2"
              >
                <FaRocket /> Deploy First Bot
              </Link>
            </div>
          ) : (
            /* Bot list */
            <div className="divide-y divide-mc-stone-shadow/30">
              {bots.map((bot) => (
                <div
                  key={bot.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-white/[0.03] transition-colors"
                >
                  {/* Left: name + status + server */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="mc-inset-box w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-sm">
                      <FaRobot className="text-mc-grass" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-pixel text-[10px] text-white truncate">{bot.bot_name}</p>
                      <p className="font-body text-lg text-gray-500 truncate">
                        {getServerName(bot.server_id)}
                      </p>
                    </div>
                  </div>

                  {/* Right: status + actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={bot.status} />

                    {/* Start / Stop */}
                    <button
                      onClick={() => handleToggleBot(bot)}
                      disabled={togglingBots[bot.id]}
                      className={`mc-button text-[9px] px-3 py-2 inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-wait ${
                        bot.status === 'online' || bot.status === 'connecting'
                          ? 'bg-mc-redstone/80 hover:bg-mc-redstone'
                          : 'mc-button-green'
                      }`}
                    >
                      {togglingBots[bot.id] ? (
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : bot.status === 'online' || bot.status === 'connecting' ? (
                        <><FaStop /> Stop</>
                      ) : (
                        <><FaPlay /> Start</>
                      )}
                    </button>

                    {/* Control Hub link */}
                    <Link
                      to={`/bot/${bot.id}/dashboard`}
                      className="mc-button text-[9px] px-3 py-2 inline-flex items-center gap-1.5 hover:bg-[#6868aa]"
                    >
                      Control Hub →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── CONNECTED SERVERS ──────────────────────────────── */}
        <section className="mc-panel">
          <div className="border-b-3 border-mc-stone-shadow p-5 flex items-center justify-between">
            <h2 className="font-pixel text-xs sm:text-sm text-white">Connected Servers</h2>
            {servers.length > 0 && (
              <Link to="/servers" className="font-body text-lg text-mc-grass hover:underline">
                Manage →
              </Link>
            )}
          </div>

          {servers.length === 0 ? (
            /* Empty state */
            <div className="p-10 text-center space-y-4">
              <div className="text-5xl opacity-30">🖥️</div>
              <p className="font-pixel text-xs text-gray-500">No servers connected</p>
              <p className="font-body text-xl text-gray-500">
                Add your first Minecraft server to get started.
              </p>
              <Link
                to="/servers"
                className="mc-button mc-button-green inline-flex items-center gap-2 mt-2"
              >
                <FaPlus /> Add Server
              </Link>
            </div>
          ) : (
            /* Server grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {servers.map((srv) => {
                const botCount = getBotsForServer(srv.id);
                return (
                  <div
                    key={srv.id}
                    className="mc-inset-box rounded-sm p-4 space-y-3 hover:bg-white/[0.04] transition-colors group"
                  >
                    {/* Name */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-pixel text-[10px] text-white truncate group-hover:text-mc-cyan transition-colors">
                        {srv.server_name}
                      </h3>
                      {srv.version && (
                        <span className="font-body text-base bg-mc-cyan/10 text-mc-cyan px-2 py-0.5 rounded">
                          {srv.version}
                        </span>
                      )}
                    </div>

                    {/* Address */}
                    <p className="font-body text-lg text-gray-400 truncate">
                      {srv.ip_address}:{srv.port}
                    </p>

                    {/* Bot count */}
                    <div className="flex items-center gap-2 font-body text-lg text-gray-500">
                      <FaRobot className="text-sm" />
                      {botCount} bot{botCount !== 1 ? 's' : ''} connected
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default UserDashboard;
