import { io } from 'socket.io-client';

/**
 * Shared Socket.io client for real-time communication with the
 * BotCraft backend (Express + Socket.io on port 8000).
 *
 * - `withCredentials` ensures session cookies are forwarded.
 * - `autoConnect: false` lets consumers connect explicitly when ready
 *    (e.g. after authentication) by calling `socket.connect()`.
 * - `reconnection` handles transient network drops gracefully.
 */
const BACKEND_URL = 'http://localhost:8000';

const socket = io(BACKEND_URL, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ['websocket', 'polling'],
});

/* ── Debug helpers (dev only) ────────────────────────────── */
if (import.meta.env.DEV) {
  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.warn('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
  });
}

export default socket;
