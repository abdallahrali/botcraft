import DatabaseManager from '../DatabaseManager.js';

/**
 * Repository for handling User data access.
 * Strict adherence to the Repository Pattern.
 * All queries enforce Soft Deletes (WHERE deleted_at IS NULL).
 */
class UserRepository {
    constructor() {
        this.db = DatabaseManager.getInstance();
    }

    /**
     * Finds an active user by their ID.
     * @param {number} id - The user's ID.
     * @returns {Promise<Object|null>} The user object or null if not found.
     */
    async findById(id) {
        const sql = `
            SELECT * FROM user 
            WHERE id = ? AND deleted_at IS NULL
        `;
        const results = await this.db.query(sql, [id]);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Finds an active user by their email address.
     * @param {string} email - The user's email address.
     * @returns {Promise<Object|null>} The user object or null if not found.
     */
    async findByEmail(email) {
        const sql = `
            SELECT * FROM user 
            WHERE email = ? AND deleted_at IS NULL
        `;
        const results = await this.db.query(sql, [email]);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Creates a new user in the database.
     * @param {Object} userData - Data for the new user.
     * @param {string} userData.firstName - User's first name.
     * @param {string} userData.lastName - User's last name.
     * @param {string} userData.email - User's email address.
     * @param {string} userData.passwordHash - Hashed password.
     * @returns {Promise<number>} The ID of the newly created user.
     */
    async create({ firstName, lastName, email, passwordHash }) {
        const sql = `
            INSERT INTO user (first_name, last_name, email, password_hash)
            VALUES (?, ?, ?, ?)
        `;
        const result = await this.db.query(sql, [firstName, lastName, email, passwordHash]);
        return result.insertId;
    }

    /**
     * Updates an existing user's data.
     * @param {number} id - The user's ID.
     * @param {Object} userData - Data to update.
     * @returns {Promise<boolean>} True if successful.
     */
    async update(id, { firstName, lastName, email, passwordHash, sessionToken }) {
        const sql = `
            UPDATE user 
            SET first_name = ?, last_name = ?, email = ?, password_hash = ?, session_token = ?
            WHERE id = ? AND deleted_at IS NULL
        `;
        const result = await this.db.query(sql, [
            firstName, 
            lastName, 
            email, 
            passwordHash, 
            sessionToken || null, 
            id
        ]);
        return result.affectedRows > 0;
    }

    /**
     * Soft deletes a user by setting the deleted_at timestamp.
     * @param {number} id - The user's ID.
     * @returns {Promise<boolean>} True if successfully deleted.
     */
    async softDelete(id) {
        const sql = `
            UPDATE user 
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = ? AND deleted_at IS NULL
        `;
        const result = await this.db.query(sql, [id]);
        return result.affectedRows > 0;
    }
}

export default UserRepository;
