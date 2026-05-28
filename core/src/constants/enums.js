/**
 * Standard enums used across the BotCraft ecosystem.
 * Frozen objects are used to simulate enum behavior in JavaScript.
 */

export const BotStatus = Object.freeze({
    OFFLINE: 'offline',
    CONNECTING: 'connecting',
    ONLINE: 'online',
    ERROR: 'error'
});

export const BotModules = Object.freeze({
    AUTO_EAT: 'AutoEat',
    ANTI_AFK: 'AntiAfk',
    AUTO_DEFEND: 'AutoDefend',
    AUTO_COVER: 'AutoCover',
    PATHFINDER: 'Pathfinder'
});

export const ToastType = Object.freeze({
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
});
