import DatabaseManager from '../DatabaseManager.js';

/**
 * Repository for handling Minecraft Server data access.
 * Strict adherence to the Repository Pattern.
 * All queries enforce Soft Deletes (WHERE deleted_at IS NULL).
 */
class ServerRepository {
    constructor() {
        this.db = DatabaseManager.getInstance();
    }

    /**
     * Finds an active server by its ID.
     * @param {number} id - The server's ID.
     * @returns {Promise<Object|null>} The server object or null if not found.
     */
    async findById(id) {
        const sql = `
            SELECT * FROM server 
            WHERE id = ? AND deleted_at IS NULL
        `;
        const results = await this.db.query(sql, [id]);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Finds all active servers associated with a specific user.
     * @param {number} userId - The user's ID.
     * @returns {Promise<Array>} An array of server objects.
     */
    async findByUserId(userId) {
        const sql = `
            SELECT * FROM server 
            WHERE user_id = ? AND deleted_at IS NULL
        `;
        return await this.db.query(sql, [userId]);
    }

    /**
     * Creates a new server record.
     * @param {Object} serverData - The server details.
     * @param {number} serverData.userId - The ID of the owner.
     * @param {string} serverData.serverName - A custom name for the server.
     * @param {string} serverData.ipAddress - The server's IP address.
     * @param {number} [serverData.port=25565] - The server's port.
     * @param {string} [serverData.version] - The Minecraft version.
     * @returns {Promise<number>} The ID of the newly created server.
     */
    async create({ userId, serverName, ipAddress, port = 25565, version = null }) {
        const sql = `
            INSERT INTO server (user_id, server_name, ip_address, port, version)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await this.db.query(sql, [userId, serverName, ipAddress, port, version]);
        return result.insertId;
    }

    /**
     * Updates an existing server's details.
     * @param {number} id - The server's ID.
     * @param {Object} serverData - The updated server details.
     * @returns {Promise<boolean>} True if the update was successful.
     */
    async update(id, { serverName, ipAddress, port, version }) {
        const sql = `
            UPDATE server 
            SET server_name = ?, ip_address = ?, port = ?, version = ?
            WHERE id = ? AND deleted_at IS NULL
        `;
        const result = await this.db.query(sql, [serverName, ipAddress, port, version, id]);
        return result.affectedRows > 0;
    }

    /**
     * Soft deletes a server by setting the deleted_at timestamp.
     * @param {number} id - The server's ID.
     * @returns {Promise<boolean>} True if successfully soft deleted.
     */
    async softDelete(id) {
        const sql = `
            UPDATE server 
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = ? AND deleted_at IS NULL
        `;
        const result = await this.db.query(sql, [id]);
        return result.affectedRows > 0;
    }
}

export default ServerRepository;
