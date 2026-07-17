import ServerRepository from '../../../core/src/models/repositories/ServerRepository.js';

/**
 * Controller for Minecraft Server management.
 * Ensures users only access and modify their own server records.
 */
class ServerController {
    constructor() {
        this.serverRepo = new ServerRepository();
    }

    /**
     * Retrieves all servers belonging to the logged-in user.
     */
    handleGetServers = async (req, res) => {
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const servers = await this.serverRepo.findByUserId(userId);

            res.status(200).json({
                success: true,
                data: servers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching servers.',
                error: error.message
            });
        }
    }

    /**
     * Adds a new Minecraft server to the user's profile.
     */
    handleAddServer = async (req, res) => {
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const { serverName, ipAddress, port, version } = req.body;

            if (!serverName || !ipAddress) {
                return res.status(400).json({
                    success: false,
                    message: 'Server name and IP address are required.'
                });
            }

            const serverId = await this.serverRepo.create({
                userId,
                serverName,
                ipAddress,
                port: port || 25565,
                version
            });

            res.status(201).json({
                success: true,
                message: 'Target server saved successfully.',
                data: { serverId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error adding server.',
                error: error.message
            });
        }
    }

    /**
     * Soft-deletes a server from the user's profile.
     */
    handleDeleteServer = async (req, res) => {
        try {
            const userId = req.session.userId;
            const { id } = req.params;

            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            // Verify ownership before deleting
            const server = await this.serverRepo.findById(id);
            if (!server || server.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You do not own this server record.'
                });
            }

            await this.serverRepo.softDelete(id);

            res.status(200).json({
                success: true,
                message: 'Server removed successfully.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting server.',
                error: error.message
            });
        }
    }
}

export default new ServerController();
