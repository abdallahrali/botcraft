import mysql from 'mysql2/promise';

/**
 * Singleton DatabaseManager for handling database connections and queries.
 * Ensures only one connection pool exists throughout the application lifecycle.
 * Adheres strictly to the Singleton Pattern for optimal resource usage.
 */
class DatabaseManager {
    static instance = null;
    connectionPool = null;

    /**
     * Private constructor to prevent direct instantiation.
     */
    constructor() {
        if (DatabaseManager.instance) {
            return DatabaseManager.instance;
        }

        this.connect();
        DatabaseManager.instance = this;
    }

    /**
     * Gets the Singleton instance of the DatabaseManager.
     * @returns {DatabaseManager} The singleton instance.
     */
    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    /**
     * Initializes the connection pool using environment variables.
     * Includes SSL requirements for secure connections (e.g., Aiven MySQL).
     */
    connect() {
        if (!this.connectionPool) {
            this.connectionPool = mysql.createPool({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                ssl: {
                    rejectUnauthorized: true
                }
            });
            console.log('[DatabaseManager] Connection pool initialized.');
        }
    }

    /**
     * Executes a generic SQL query against the database.
     * Provides basic error logging to safely capture and diagnose SQL failures.
     * 
     * @param {string} sql - The SQL query to execute.
     * @param {Array} params - The parameters to bind to the query.
     * @returns {Promise<Array|Object>} The query results.
     */
    async query(sql, params = []) {
        try {
            // Using execute() over query() utilizes prepared statements which protect against SQL injection
            const [results] = await this.connectionPool.execute(sql, params);
            return results;
        } catch (error) {
            console.error(`[DatabaseManager] Database Query Error: ${error.message}`);
            console.error(`[DatabaseManager] Executed SQL: ${sql}`);
            console.error(`[DatabaseManager] With Params: ${JSON.stringify(params)}`);
            throw error; // Re-throw the error for the caller to handle
        }
    }
}

export default DatabaseManager;
