import IBotModule from '../IBotModule.js';

/**
 * Handles listening to and forwarding Minecraft chat messages.
 * This is a core module that bridges the game chat to the BotCraft web interface.
 */
class ChatModule extends IBotModule {
    constructor() {
        // Name doesn't have an enum match because it's a mandatory core module, 
        // but we give it an identifier anyway.
        super('CoreChat'); 
        
        // We must bind the context of our listener functions so they can be added/removed cleanly
        this._onChat = this._onChat.bind(this);
        this._onWhisper = this._onWhisper.bind(this);
    }

    /**
     * Executes when the bot spawns.
     */
    onStart() {
        // mineflayer 'chat' event: (username, message, translate, jsonMsg, matches)
        this.bot.on('chat', this._onChat);
        
        // mineflayer 'whisper' event: (username, message, translate, jsonMsg, matches)
        this.bot.on('whisper', this._onWhisper);
        
        console.log(`[ChatModule] Chat listeners attached for ${this.bot.username}`);
    }

    /**
     * Executes when the bot disconnects or is stopped.
     */
    onStop() {
        if (this.bot) {
            this.bot.removeListener('chat', this._onChat);
            this.bot.removeListener('whisper', this._onWhisper);
            console.log(`[ChatModule] Chat listeners removed for ${this.bot.username}`);
        }
    }

    /**
     * Internal handler for public chat.
     */
    _onChat(username, message) {
        // Ignore messages from ourselves to prevent feedback loops
        if (username === this.bot.username) return;

        // Emit upwards to BotInstance, which will be caught by the Manager/Gateway
        this.botInstance.publishEvent('chat_received', {
            type: 'public',
            sender: username,
            message: message,
            timestamp: new Date()
        });
    }

    /**
     * Internal handler for private messages.
     */
    _onWhisper(username, message) {
        if (username === this.bot.username) return;

        this.botInstance.publishEvent('chat_received', {
            type: 'private',
            sender: username,
            message: message,
            timestamp: new Date()
        });
    }

    /**
     * Exposed method allowing the web UI to send a message through the bot.
     * @param {string} msg - The message to send.
     */
    sendToServer(msg) {
        if (this.bot) {
            this.bot.chat(msg);
        }
    }
}

export default ChatModule;
