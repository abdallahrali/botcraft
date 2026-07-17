import AuthService from '../services/AuthService.js';

/**
 * Controller for Authentication endpoints.
 * Manages Express sessions and standardizes API responses.
 */
class AuthController {
    /**
     * Handles user registration.
     */
    async handleRegister(req, res) {
        try {
            const { firstName, lastName, email, password } = req.body;

            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields.'
                });
            }
            const userId = await AuthService.register(firstName, lastName, email, password);

            // Automatically log in the user after registration
            req.session.userId = userId;

            res.status(201).json({
                success: true,
                message: 'Account created successfully!',
                data: { userId }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Handles user login and session creation.
     */
    async handleLogin(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required.'
                });
            }

            const user = await AuthService.login(email, password);

            // Set session data
            req.session.userId = user.id;

            res.status(200).json({
                success: true,
                message: 'Successfully logged in. Welcome back!',
                data: { user }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Handles user logout and session destruction.
     */
    async handleLogout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Could not log out.'
                });
            }
            
            res.clearCookie('botcraft_session');
            res.status(200).json({
                success: true,
                message: 'Logged out successfully.'
            });
        });
    }
}

export default new AuthController();
