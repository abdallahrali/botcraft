import bcrypt from 'bcrypt';
import UserRepository from '../../../core/src/models/repositories/UserRepository.js';

/**
 * Service for handling authentication logic.
 * Abstracts user verification and hashing away from controllers.
 */
class AuthService {
    constructor() {
        this.userRepo = new UserRepository();
    }

    /**
     * Registers a new user after validating their data.
     * 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<number>} The ID of the newly created user.
     */
    async register(firstName, lastName, email, password) {
        // Check if user already exists
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists.');
        }

        // Hash password with 10 salt rounds
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        return await this.userRepo.create({
            firstName,
            lastName,
            email,
            passwordHash
        });
    }

    /**
     * Authenticates a user and returns their profile.
     * 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} The authenticated user object (without password).
     */
    async login(email, password) {
        const user = await this.userRepo.findByEmail(email);
        
        if (!user) {
            throw new Error('Invalid credentials.');
        }

        // Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Invalid credentials.');
        }

        // Return user without the hash
        const { password_hash, ...userProfile } = user;
        return userProfile;
    }
}

export default new AuthService();
