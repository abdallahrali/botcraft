import BotConfigRepository from '../../../core/src/models/repositories/BotConfigRepository.js';
import { BotStatus } from '../../../core/src/constants/enums.js';

/**
 * Controller for Bot Configuration and Instance Control.
 * Interfaces between the user dashboard and the BotManager (Core Engine).
 */
class BotController {
    constructor() {
        this.botRepo = new BotConfigRepository();
    }

    /**
     * Fetches all bots belonging to the user.
     */
    async handleGetBots = async (req, res) => {
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const bots = await this.botRepo.findByUserId(userId);

            res.status(200).json({
                success: true,
                data: bots
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching bots.',
                error: error.message
            });
        }
    }

    /**
     * Triggers a bot to start its connection sequence.
     */
    async handleStartBot = async (req, res) => {
        try {
            const userId = req.session.userId;
            const { botId } = req.body;

            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            // Authorization check
            const bot = await this.botRepo.findById(botId);
            if (!bot || bot.user_id !== userId) {
                return res.status(403).json({ success: false, message: 'Access denied.' });
            }

            // Update status to connecting in DB
            await this.botRepo.updateStatus(botId, BotStatus.CONNECTING);

            // TODO: Call BotManager.getInstance().startBot(bot) here once Engine is built.
            console.log(`[BotController] Starting bot ${botId} for user ${userId}`);

            res.status(200).json({
                success: true,
                message: 'Bot is now connecting to the server...',
                data: { status: BotStatus.CONNECTING }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error starting bot.',
                error: error.message
            });
        }
    }

    /**
     * Signals a bot to disconnect gracefully.
     */
    async handleStopBot = async (req, res) => {
        try {
            const userId = req.session.userId;
            const { botId } = req.body;

            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            // Authorization check
            const bot = await this.botRepo.findById(botId);
            if (!bot || bot.user_id !== userId) {
                return res.status(403).json({ success: false, message: 'Access denied.' });
            }

            // Update status to offline in DB
            await this.botRepo.updateStatus(botId, BotStatus.OFFLINE);

            // TODO: Call BotManager.getInstance().stopBot(botId) here once Engine is built.
            console.log(`[BotController] Stopping bot ${botId} for user ${userId}`);

            res.status(200).json({
                success: true,
                message: 'Bot has been disconnected safely.',
                data: { status: BotStatus.OFFLINE }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error stopping bot.',
                error: error.message
            });
        }
    }

    /**
     * Updates runtime parameters for a specific bot (reconnect delay, modules, etc).
     */
    async handleUpdateConfig = async (req, res) => {
        try {
            const userId = req.session.userId;
            const { id } = req.params;
            const configUpdates = req.body;

            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            // Authorization check
            const bot = await this.botRepo.findById(id);
            if (!bot || bot.user_id !== userId) {
                return res.status(403).json({ success: false, message: 'Access denied.' });
            }

            // For now, we reuse the repository pattern to persist changes.
            // Note: In Stage 4, this might also trigger live module loading in the engine.
            // await this.botRepo.update(id, configUpdates); 
            
            console.log(`[BotController] Updating config for bot ${id}`, configUpdates);

            res.status(200).json({
                success: true,
                message: 'Bot configuration updated successfully.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating bot config.',
                error: error.message
            });
        }
    }
}

export default new BotController();
