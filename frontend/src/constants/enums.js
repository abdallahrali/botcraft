/**
 * BotCraft Frontend Enums & Constants
 * Mirrors core/src/constants/enums.js for frontend use
 */

export const BotStatus = Object.freeze({
  OFFLINE: 'offline',
  CONNECTING: 'connecting',
  ONLINE: 'online',
  ERROR: 'error',
});

export const BotModules = Object.freeze({
  AUTO_EAT: 'AutoEat',
  ANTI_AFK: 'AntiAfk',
  AUTO_DEFEND: 'AutoDefend',
  AUTO_COVER: 'AutoCover',
  PATHFINDER: 'Pathfinder',
});

export const ToastType = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
});

/**
 * Status color mappings for Tailwind classes
 */
export const StatusColors = Object.freeze({
  [BotStatus.ONLINE]: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    dot: 'bg-green-500',
    label: 'Online',
  },
  [BotStatus.OFFLINE]: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    dot: 'bg-red-500',
    label: 'Offline',
  },
  [BotStatus.CONNECTING]: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    dot: 'bg-yellow-500',
    label: 'Connecting',
  },
  [BotStatus.ERROR]: {
    bg: 'bg-red-700/20',
    text: 'text-red-300',
    dot: 'bg-red-700',
    label: 'Error',
  },
});
