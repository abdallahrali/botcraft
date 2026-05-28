import BotFactory from './BotFactory.js';
import ChatModule from './modules/ChatModule.js';

/**
 * Singleton Manager for orchestrating all active bot lifecycles.
 * Maintains the in-memory state of running bots to prevent memory leaks and duplication.
 */
class BotManager {
    static instance = null;

    constructor() {
        if (BotManager.instance) {
            return BotManager.instance;
        }

        // Map storing active BotInstances, keyed by their database ID
        this.activeBots = new Map();

        BotManager.instance = this;
    }

    /**
     * @returns {BotManager} The singleton instance.
     */
    static getInstance() {
        if (!BotManager.instance) {
            BotManager.instance = new BotManager();
        }
        return BotManager.instance;
    }

    /**
     * Spawns a new bot instance and adds it to the active pool.
     * 
     * @param {Object} config - The bot configuration object.
     * @param {Object} serverDetails - The target server configuration object.
     * @returns {boolean} True if successfully started, false if it was already running.
     */
    startBot(config, serverDetails) {
        const botId = config.id;

        if (this.activeBots.has(botId)) {
            console.warn(`[BotManager] Bot ${botId} (${config.bot_name}) is already running. Ignoring start request.`);
            return false;
        }

        console.log(`[BotManager] Assembling bot ${botId} (${config.bot_name})...`);
        const botInstance = BotFactory.createBot(config, serverDetails);

        // --- Core Platform Overrides ---
        // For BotCraft, we always want the ChatModule active so the web UI can see chat,
        // regardless of what user plugins are enabled in the JSON array.
        botInstance.loadModule(new ChatModule());

        // Listen for status changes to potentially update the database (handled in Stage 5)
        botInstance.on('status_changed', (newStatus) => {
            console.log(`[BotManager] Bot ${botId} status changed to: ${newStatus}`);
            // Note: In Stage 5 we will import BotConfigRepository here and update the DB,
            // and pass the status to WebSocketGateway.
        });

        // Store in memory and start
        this.activeBots.set(botId, botInstance);
        botInstance.connect();

        return true;
    }

    /**
     * Gracefully disconnects a bot and removes it from memory.
     * 
     * @param {number} botId - The database ID of the bot to stop.
     */
    stopBot(botId) {
        if (!this.activeBots.has(botId)) {
            console.warn(`[BotManager] Cannot stop bot ${botId}: Not currently active.`);
            return;
        }

        const botInstance = this.activeBots.get(botId);
        botInstance.disconnect(); // This triggers cleanup on all its modules
        
        this.activeBots.delete(botId);
        console.log(`[BotManager] Bot ${botId} stopped and removed from memory.`);
    }

    /**
     * Retrieves an active bot instance for direct interaction.
     * 
     * @param {number} botId - The ID of the bot.
     * @returns {import('./BotInstance.js').default|undefined} The instance or undefined.
     */
    getBot(botId) {
        return this.activeBots.get(botId);
    }
}

export default BotManager;
