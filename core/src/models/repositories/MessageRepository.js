import DatabaseManager from '../DatabaseManager.js';

/**
 * Repository for handling Chat Messages data access.
 * Messages represent the history of global and private bot chats.
 * Note: Messages do not have a deleted_at field, so soft-delete rules do not apply.
 */
class MessageRepository {
    constructor() {
        this.db = DatabaseManager.getInstance();
    }

    /**
     * Creates a new chat message entry.
     * @param {Object} messageData - The message details.
     * @param {number} messageData.serverId - The server this message belongs to.
     * @param {number|null} [messageData.botId=null] - The bot this message belongs to, or null for global chat.
     * @param {string} messageData.sender - The sender's name/username.
     * @param {string} messageData.content - The text content of the message.
     * @returns {Promise<number>} The ID of the newly created message.
     */
    async create({ serverId, botId = null, sender, content }) {
        const sql = `
            INSERT INTO message (server_id, bot_id, sender, content)
            VALUES (?, ?, ?, ?)
        `;
        const result = await this.db.query(sql, [serverId, botId, sender, content]);
        return result.insertId;
    }

    /**
     * Retrieves messages for a specific server using cursor-based pagination.
     * Fetches messages older than the provided timestamp, ordered newest first.
     * Allows seamless reverse scrolling in chat UI.
     * 
     * @param {number} serverId - The server's ID.
     * @param {string|Date|null} beforeTimestamp - The timestamp cursor. If null, fetches latest messages.
     * @param {number} [limit=50] - The maximum number of messages to retrieve.
     * @returns {Promise<Array>} Array of message objects.
     */
    async findByServerId(serverId, beforeTimestamp = null, limit = 50) {
        // Ensure limit is a positive integer to safely supply to prepared statement
        const safeLimit = Math.max(1, parseInt(limit, 10)) || 50;
        
        let sql;
        let params;

        // If a cursor timestamp is provided, fetch messages before that time
        if (beforeTimestamp) {
            sql = `
                SELECT * FROM message 
                WHERE server_id = ? AND timestamp < ?
                ORDER BY timestamp DESC
                LIMIT ?
            `;
            // Ensure we use a valid Date object if passed as string
            const dateParam = beforeTimestamp instanceof Date 
                ? beforeTimestamp 
                : new Date(beforeTimestamp);
                
            params = [serverId, dateParam, safeLimit];
        } else {
            // Initial load without cursor, fetch the most recent messages
            sql = `
                SELECT * FROM message 
                WHERE server_id = ?
                ORDER BY timestamp DESC
                LIMIT ?
            `;
            params = [serverId, safeLimit];
        }
        
        return await this.db.query(sql, params);
    }
}

export default MessageRepository;
