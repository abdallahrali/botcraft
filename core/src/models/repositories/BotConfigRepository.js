import DatabaseManager from '../DatabaseManager.js';

/**
 * Repository for handling Bot Configurations data access.
 * Strict adherence to the Repository Pattern.
 * All queries enforce Soft Deletes (WHERE deleted_at IS NULL).
 */
class BotConfigRepository {
    constructor() {
        this.db = DatabaseManager.getInstance();
    }

    /**
     * Helper to safely parse the enabled_modules JSON field.
     * Ensures consistent array retrieval from MySQL JSON column.
     * @param {Object} bot - The bot database row.
     * @returns {Object} The bot object with parsed enabled_modules.
     */
    _parseModules(bot) {
        if (!bot) return null;
        if (typeof bot.enabled_modules === 'string') {
            try {
                bot.enabled_modules = JSON.parse(bot.enabled_modules);
            } catch (e) {
                console.warn(`[BotConfigRepository] Failed to parse enabled_modules for bot ${bot.id}`);
                bot.enabled_modules = [];
            }
        }
        return bot;
    }

    /**
     * Finds an active bot configuration by its ID.
     * @param {number} id - The bot's ID.
     * @returns {Promise<Object|null>} The bot config object or null if not found.
     */
    async findById(id) {
        const sql = `
            SELECT * FROM bot 
            WHERE id = ? AND deleted_at IS NULL
        `;
        const results = await this.db.query(sql, [id]);
        return results.length > 0 ? this._parseModules(results[0]) : null;
    }

    /**
     * Finds all active bots owned by a specific user.
     * @param {number} userId - The user's ID.
     * @returns {Promise<Array>} Array of bot configuration objects.
     */
    async findByUserId(userId) {
        const sql = `
            SELECT * FROM bot 
            WHERE user_id = ? AND deleted_at IS NULL
        `;
        const results = await this.db.query(sql, [userId]);
        return results.map(bot => this._parseModules(bot));
    }

    /**
     * Finds all active bots associated with a specific server.
     * @param {number} serverId - The server's ID.
     * @returns {Promise<Array>} Array of bot configuration objects.
     */
    async findByServerId(serverId) {
        const sql = `
            SELECT * FROM bot 
            WHERE server_id = ? AND deleted_at IS NULL
        `;
        const results = await this.db.query(sql, [serverId]);
        return results.map(bot => this._parseModules(bot));
    }

    /**
     * Creates a new bot configuration.
     * Handles JSON.stringify for the enabled_modules array implicitly.
     * 
     * @param {Object} configData - The configuration details.
     * @param {number} configData.userId - The owner's user ID.
     * @param {number} configData.serverId - The target server's ID.
     * @param {string} configData.botName - A custom name for the bot.
     * @param {string} configData.username - The Minecraft username for the bot.
     * @param {number} [configData.reconnectDelayMs=10000] - Delay before reconnecting.
     * @param {Array<string>} [configData.enabledModules=[]] - List of module names to enable.
     * @param {string} [configData.status='offline'] - Initial status.
     * @returns {Promise<number>} The ID of the newly created bot config.
     */
    async create({ 
        userId, 
        serverId, 
        botName, 
        username, 
        reconnectDelayMs = 10000, 
        enabledModules = [], 
        status = 'offline' 
    }) {
        const sql = `
            INSERT INTO bot (user_id, server_id, bot_name, username, reconnect_delay_ms, enabled_modules, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        // MySQL expects a JSON string or valid JSON value for the JSON column type
        const modulesJson = JSON.stringify(enabledModules);
        
        const result = await this.db.query(sql, [
            userId, 
            serverId, 
            botName, 
            username, 
            reconnectDelayMs, 
            modulesJson, 
            status
        ]);
        
        return result.insertId;
    }

    /**
     * Updates ONLY the status of a bot.
     * @param {number} id - The bot's ID.
     * @param {string} status - The new status (offline, online, connecting, error).
     * @returns {Promise<boolean>} True if the update was successful.
     */
    async updateStatus(id, status) {
        const sql = `
            UPDATE bot 
            SET status = ?
            WHERE id = ? AND deleted_at IS NULL
        `;
        const result = await this.db.query(sql, [status, id]);
        return result.affectedRows > 0;
    }

    /**
     * Soft deletes a bot config by setting the deleted_at timestamp.
     * @param {number} id - The bot's ID.
     * @returns {Promise<boolean>} True if successfully soft deleted.
     */
    async softDelete(id) {
        const sql = `
            UPDATE bot 
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = ? AND deleted_at IS NULL
        `;
        const result = await this.db.query(sql, [id]);
        return result.affectedRows > 0;
    }
}

export default BotConfigRepository;
