/**
 * Interface that all BotCraft modules must implement.
 * Ensures a consistent lifecycle and event structure across the engine.
 */
class IBotModule {
    /**
     * @param {string} name - The unique name of the module (must match BotModules enum).
     */
    constructor(name) {
        if (new.target === IBotModule) {
            throw new TypeError("Cannot construct IBotModule instances directly.");
        }
        this.name = name;
        this.botInstance = null;
        this.bot = null; // The actual mineflayer bot object
        this.wsGateway = null; // Will be used in Stage 5 for pushing state to React
    }

    /**
     * Initializes the module with the necessary context.
     * Called automatically by BotFactory during bot assembly.
     * 
     * @param {import('./BotInstance.js').default} botInstance - The parent wrapper.
     */
    init(botInstance) {
        this.botInstance = botInstance;
        this.bot = botInstance.bot;
        // this.wsGateway = WebSocketGateway.getInstance(); // TODO in Stage 5
    }

    /**
     * Executed when the bot successfully connects to the server and spawns.
     * This is where event listeners should be attached to the mineflayer `this.bot`.
     * Must be implemented by the subclass.
     */
    onStart() {
        throw new Error("Method 'onStart()' must be implemented.");
    }

    /**
     * Executed when the bot disconnects or the module is disabled.
     * This is where event listeners should be safely removed to prevent memory leaks.
     * Must be implemented by the subclass.
     */
    onStop() {
        throw new Error("Method 'onStop()' must be implemented.");
    }
}

export default IBotModule;
