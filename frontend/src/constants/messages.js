/**
 * BotCraft Predefined Toast Messages
 * Used with react-hot-toast for consistent messaging
 */

export const APP_MESSAGES = Object.freeze({
  AUTH: {
    LOGIN_SUCCESS: 'Successfully logged in. Welcome back!',
    LOGIN_ERROR: 'Invalid email or password.',
    REGISTER_SUCCESS: 'Account created successfully!',
    LOGOUT_SUCCESS: 'Logged out successfully.',
    SESSION_EXPIRED: 'Session expired. Please login again.',
  },
  BOT: {
    START_SUCCESS: 'Bot is now connecting to the server...',
    STOP_SUCCESS: 'Bot has been disconnected safely.',
    KICKED: 'Bot was kicked from the server.',
    AUTO_EAT_TRIGGERED: 'Bot consumed food due to low hunger.',
    DEPLOY_SUCCESS: 'Bot deployed successfully!',
    DELETE_SUCCESS: 'Bot removed successfully.',
  },
  SERVER: {
    ADD_SUCCESS: 'Target server saved successfully.',
    DELETE_SUCCESS: 'Server removed successfully.',
    CONNECTION_FAILED: 'Could not reach the Minecraft server.',
  },
  GENERAL: {
    LOADING: 'Generating World...',
    ERROR: 'Something went wrong. Please try again.',
    NETWORK_ERROR: 'Network error. Check your connection.',
  },
});
