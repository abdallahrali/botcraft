import IBotModule from '../IBotModule.js';
import { BotModules } from '../../constants/enums.js';
import { loader as autoeat } from 'mineflayer-auto-eat'; // Requires running `npm install mineflayer-auto-eat` in the core package if not already done

/**
 * Survival module handles basic survival instincts like eating food when hungry.
 * Wraps the 'mineflayer-auto-eat' ecosystem plugin safely.
 */
class SurvivalModule extends IBotModule {
    constructor() {
        super(BotModules.AUTO_EAT); // 'AutoEat'
        
        this._onHealthUpdate = this._onHealthUpdate.bind(this);
        this._onEatStart = this._onEatStart.bind(this);
        this._onEatStop = this._onEatStop.bind(this);
    }

    /**
     * Executes when the bot spawns.
     */
    onStart() {
        // 1. Load the external plugin into this specific mineflayer instance
        this.bot.loadPlugin(autoeat);

        // 2. Configure the auto-eat thresholds
        // We set it to eat when food drops below 14 (7 drumsticks)
        // Note: autoEat property is injected by the plugin
        this.bot.autoEat.options = {
            priority: 'foodPoints',
            startAt: 14,
            bannedFood: [] // Could pull this from DB config later
        };

        // 3. Attach listeners
        this.bot.on('health', this._onHealthUpdate);
        this.bot.on('autoeat_started', this._onEatStart);
        this.bot.on('autoeat_stopped', this._onEatStop);

        console.log(`[SurvivalModule] AutoEat initialized for ${this.bot.username}`);
    }

    /**
     * Executes when the bot disconnects or is stopped.
     */
    onStop() {
        if (this.bot) {
            this.bot.removeListener('health', this._onHealthUpdate);
            this.bot.removeListener('autoeat_started', this._onEatStart);
            this.bot.removeListener('autoeat_stopped', this._onEatStop);
            
            // Disable the plugin's internal loops
            if (this.bot.autoEat) {
                this.bot.autoEat.disable();
            }
            
            console.log(`[SurvivalModule] AutoEat disabled for ${this.bot.username}`);
        }
    }

    /**
     * Monitors health and toggles the plugin state based on fullness.
     */
    _onHealthUpdate() {
        if (!this.bot.autoEat) return;

        // If food is full (20 points / 10 drumsticks), disable the check to save CPU
        if (this.bot.food === 20) {
            this.bot.autoEat.disable();
        } else {
            // Otherwise, keep it enabled so it watches the `startAt` threshold
            this.bot.autoEat.enable();
        }
    }

    /**
     * Fires when the bot begins consuming an item.
     */
    _onEatStart(item, offhand) {
        console.log(`[SurvivalModule] ${this.bot.username} started eating ${item.name}`);
        this.botInstance.publishEvent('action_status', {
            action: 'eating',
            state: 'started',
            item: item.name
        });
    }

    /**
     * Fires when the bot finishes consuming the item.
     */
    _onEatStop() {
        console.log(`[SurvivalModule] ${this.bot.username} finished eating.`);
        this.botInstance.publishEvent('action_status', {
            action: 'eating',
            state: 'stopped'
        });
    }
}

export default SurvivalModule;
