import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import AppRouter from './routes/AppRouter.js';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const app = express();
const MySQLStore = MySQLStoreFactory(session);

/**
 * Session Store Configuration
 * Connects to the remote Aiven MySQL database using SSL.
 */
const sessionOptions = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true
    },
    // Database table to store session data
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions'
    }
};

const sessionStore = new MySQLStore(sessionOptions);

// Middleware Setup
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Session Middleware
 * Securely manages user sessions in the MySQL store.
 */
app.use(session({
    key: 'botcraft_session',
    secret: process.env.SESSION_SECRET || 'botcraft-super-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Mount API Router
app.use('/api', AppRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[Server] Unhandled Error: ${err.stack}`);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Server] BotCraft Web API running on port ${PORT}`);
});

export default app;
