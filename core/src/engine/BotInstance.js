import { EventEmitter } from 'events';
import mineflayer from 'mineflayer';
import { BotStatus } from '../constants/enums.js';

/**
 * The core wrapper around a single Mineflayer instance.
 * Acts as the Publisher in the Observer pattern, emitting events up to the BotManager.
 */
class BotInstance extends EventEmitter {
    /**
     * @param {Object} config - The bot's configuration from the database.
     * @param {Object} serverDetails - The target server's connection details.
     */
    constructor(config, serverDetails) {
        super();
        this.config = config;
        this.serverDetails = serverDetails;
        this.bot = null; // The actual mineflayer instance
        this.modules = new Map(); // Map<string, IBotModule>
        this.status = BotStatus.OFFLINE;
        
        // Track the reconnect timeout so we can cancel it if manually stopped
        this.reconnectTimeout = null;
        // Flag to differentiate intentional disconnects from crashes
        this.intentionalDisconnect = false;
    }

    /**
     * Initiates the connection to the Minecraft server.
     * Creates the mineflayer instance and sets up core lifecycle listeners.
     */
    connect() {
        if (this.status === BotStatus.ONLINE || this.status === BotStatus.CONNECTING) {
            console.warn(`[BotInstance - ${this.config.bot_name}] Already online or connecting.`);
            return;
        }

        this.intentionalDisconnect = false;
        this._updateStatus(BotStatus.CONNECTING);

        try {
            console.log(`[BotInstance - ${this.config.bot_name}] Connecting to ${this.serverDetails.ip_address}:${this.serverDetails.port}...`);
            
            this.bot = mineflayer.createBot({
                host: this.serverDetails.ip_address,
                port: this.serverDetails.port,
                username: this.config.username,
                version: this.serverDetails.version || false, // false allows auto-detect
                logErrors: false,
                hideErrors: true // We handle errors manually
            });

            this._attachCoreListeners();
        } catch (error) {
            console.error(`[BotInstance - ${this.config.bot_name}] Failed to create bot: ${error.message}`);
            this._updateStatus(BotStatus.ERROR);
            this.handleReconnect();
        }
    }

    /**
     * Safely disconnects the bot and cleans up resources.
     */
    disconnect() {
        this.intentionalDisconnect = true;
        
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.bot) {
            console.log(`[BotInstance - ${this.config.bot_name}] Disconnecting manually...`);
            // Tell all modules to clean up their listeners
            this._stopModules();
            // Quit gracefully
            this.bot.quit('BotCraft intentional disconnect');
            this.bot = null;
        }

        this._updateStatus(BotStatus.OFFLINE);
    }

    /**
     * Dynamically registers a module to this bot.
     * @param {import('./IBotModule.js').default} botModule 
     */
    loadModule(botModule) {
        if (this.modules.has(botModule.name)) {
            console.warn(`[BotInstance - ${this.config.bot_name}] Module ${botModule.name} is already loaded.`);
            return;
        }
        
        // Pass the BotInstance context into the module
        botModule.init(this);
        this.modules.set(botModule.name, botModule);
        console.log(`[BotInstance - ${this.config.bot_name}] Loaded module: ${botModule.name}`);
    }

    /**
     * Starts all loaded modules. Usually called upon successful spawn.
     */
    _startModules() {
        for (const [name, mod] of this.modules) {
            try {
                // Ensure the module has the reference to the active mineflayer bot
                mod.bot = this.bot;
                mod.onStart();
            } catch (error) {
                console.error(`[BotInstance - ${this.config.bot_name}] Error starting module ${name}:`, error);
            }
        }
    }

    /**
     * Stops all loaded modules. Usually called upon disconnect.
     */
    _stopModules() {
        for (const [name, mod] of this.modules) {
            try {
                mod.onStop();
            } catch (error) {
                console.error(`[BotInstance - ${this.config.bot_name}] Error stopping module ${name}:`, error);
            }
        }
    }

    /**
     * Attaches fundamental listeners to the mineflayer instance to track state.
     */
    _attachCoreListeners() {
        this.bot.on('login', () => {
            console.log(`[BotInstance - ${this.config.bot_name}] Logged in successfully.`);
        });

        this.bot.on('spawn', () => {
            console.log(`[BotInstance - ${this.config.bot_name}] Spawned in world.`);
            this._updateStatus(BotStatus.ONLINE);
            // Now that we exist in the world, start all plugin logic
            this._startModules();
        });

        this.bot.on('end', (reason) => {
            console.log(`[BotInstance - ${this.config.bot_name}] Disconnected. Reason: ${reason}`);
            this._stopModules();
            
            if (!this.intentionalDisconnect) {
                this._updateStatus(BotStatus.ERROR);
                this.handleReconnect();
            }
        });

        this.bot.on('kicked', (reason) => {
            console.log(`[BotInstance - ${this.config.bot_name}] Kicked! Reason: ${reason}`);
            this._updateStatus(BotStatus.ERROR);
            // We will let 'end' handle the reconnect logic as it always fires after 'kicked'
        });

        this.bot.on('error', (err) => {
            console.error(`[BotInstance - ${this.config.bot_name}] Mineflayer Error:`, err);
            this.emit('error', err);
        });
    }

    /**
     * Handles automated crash recovery based on the config's reconnect delay.
     */
    handleReconnect() {
        if (this.intentionalDisconnect) return;

        const delay = this.config.reconnect_delay_ms || 10000;
        console.log(`[BotInstance - ${this.config.bot_name}] Attempting reconnect in ${delay / 1000}s...`);
        
        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, delay);
    }

    /**
     * Internal helper to update status and emit it upwards.
     */
    _updateStatus(newStatus) {
        this.status = newStatus;
        // Emit upwards so BotManager can sync to DB and WebSockets
        this.emit('status_changed', this.status);
    }

    /**
     * Publishes a generic event up to the Manager/WebSocketGateway.
     * @param {string} eventName 
     * @param {Object} data 
     */
    publishEvent(eventName, data = {}) {
        this.emit('custom_event', { eventName, data });
    }
}

export default BotInstance;
