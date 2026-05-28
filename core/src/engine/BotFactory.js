import BotInstance from './BotInstance.js';
import { BotModules } from '../constants/enums.js';

// Import all potential modules
import ChatModule from './modules/ChatModule.js';
import SurvivalModule from './modules/SurvivalModule.js';
// Add others here as they are built (NavigationModule, AntiAfkModule, etc.)

/**
 * Factory class responsible for instantiating BotInstances and wiring up 
 * their requested plugin modules based on the configuration array.
 */
class BotFactory {
    /**
     * Assembles and returns a complete, un-started BotInstance.
     * 
     * @param {Object} config - The bot's row from the database.
     * @param {Object} serverDetails - The server's row from the database.
     * @returns {BotInstance} The fully assembled bot instance.
     */
    static createBot(config, serverDetails) {
        // 1. Create the base instance
        const botInstance = new BotInstance(config, serverDetails);

        // 2. Parse the requested modules
        let requestedModules = config.enabled_modules || [];
        if (typeof requestedModules === 'string') {
            try {
                requestedModules = JSON.parse(requestedModules);
            } catch (error) {
                console.error(`[BotFactory] Failed to parse enabled_modules for bot ${config.id}:`, error);
                requestedModules = [];
            }
        }

        // 3. Instantiate and load each requested module
        requestedModules.forEach(moduleName => {
            const moduleInstance = BotFactory._createModuleFromName(moduleName);
            if (moduleInstance) {
                botInstance.loadModule(moduleInstance);
            } else {
                console.warn(`[BotFactory] Warning: Module '${moduleName}' requested by bot ${config.id} is not recognized or not yet implemented.`);
            }
        });

        // The BotInstance is now fully assembled and ready to call .connect()
        return botInstance;
    }

    /**
     * Maps a string name from the database to an actual Class instantiation.
     * @param {string} name - The name from the BotModules enum.
     * @returns {import('./IBotModule.js').default|null} The module instance or null.
     */
    static _createModuleFromName(name) {
        switch (name) {
            case BotModules.AUTO_EAT: // 'AutoEat'
                return new SurvivalModule(); // We map AutoEat to the broader SurvivalModule
            // Case for Chat is implicit, we might always want it, or it can be a separate toggle.
            // For now, let's assume if 'Chat' was in the enum, we'd load it.
            // Let's actually always load ChatModule as a core capability for this platform:
            default:
                return null;
        }
    }
}

export default BotFactory;
