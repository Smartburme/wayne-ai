import aiService from './api.js';
import { ENV } from './env.js';

class ChatHistory {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('wayne-ai-chat-history')) || [];
        this.maxHistory = 50;
    }

    addMessage(role, content) {
        const message = {
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            role,
            content,
            timestamp: new Date().toISOString()
        };
        
        this.history.push(message);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        
        this._saveToStorage();
        return message;
    }

    getConversation() {
        return [...this.history];
    }

    clear() {
        this.history = [];
        this._saveToStorage();
    }

    _saveToStorage() {
        localStorage.setItem('wayne-ai-chat-history', JSON.stringify(this.history));
    }
}

class ChatUI {
    constructor() {
        this.chatContainer = document.getElementById('chat-messages');
        this.inputField = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-btn');
        this.newChatButton = document.getElementById('new-chat-btn');
        this.typingIndicator = this._createTypingIndicator();
    }

    _createTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        return indicator;
    }

    showTyping() {
        this.chatContainer.appendChild(this.typingIndicator);
        this._scrollToBottom();
    }

    hideTyping() {
        if (this.typingIndicator.parentNode) {
            this.chatContainer.removeChild(this.typingIndicator);
        }
    }

    addMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.role}-message`;
        messageElement.dataset.messageId = message.id;
        
        messageElement.innerHTML = `
            <div class="message-content">${this._escapeHtml(message.content)}</div>
            <div class="message-meta">
                <span class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</span>
                ${message.role === 'assistant' ? 
                    '<button class="copy-btn" title="Copy message"><img src="../assets/images/attach-icon.png" alt="Copy"></button>' : ''}
            </div>
        `;
        
        this.chatContainer.appendChild(messageElement);
        this._scrollToBottom();
        
        // Add copy functionality for AI messages
        if (message.role === 'assistant') {
            messageElement.querySelector('.copy-btn').addEventListener('click', () => {
                this._copyToClipboard(message.content);
            });
        }
    }

    clearMessages() {
        this.chatContainer.innerHTML = '';
    }

    _scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    _escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    _copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            const tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'Copied!';
            document.body.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.classList.add('fade-out');
                setTimeout(() => document.body.removeChild(tooltip), 300);
            }, 1000);
        });
    }
}

class ChatBot {
    constructor() {
        this.history = new ChatHistory();
        this.ui = new ChatUI();
        this.isGenerating = false;
        
        this._init();
        this._loadPreviousChat();
    }

    _init() {
        this.ui.sendButton.addEventListener('click', () => this._sendMessage());
        this.ui.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._sendMessage();
            }
        });
        
        this.ui.newChatButton.addEventListener('click', () => {
            if (confirm('Start a new chat? Current conversation will be cleared.')) {
                this.history.clear();
                this.ui.clearMessages();
            }
        });
    }

    _loadPreviousChat() {
        const conversation = this.history.getConversation();
        if (conversation.length > 0) {
            conversation.forEach(msg => this.ui.addMessage(msg));
        }
    }

    async _sendMessage() {
        const userInput = this.ui.inputField.value.trim();
        if (!userInput || this.isGenerating) return;
        
        this.ui.inputField.value = '';
        
        // Add user message to history and UI
        const userMessage = this.history.addMessage('user', userInput);
        this.ui.addMessage(userMessage);
        
        // Generate AI response
        this.isGenerating = true;
        this.ui.showTyping();
        
        try {
            const response = await aiService.generateContent(
                userInput,
                'chat',
                {
                    context: this.history.getConversation()
                        .filter(msg => msg.role === 'user')
                        .map(msg => msg.content)
                        .join('\n')
                }
            );
            
            const aiMessage = this.history.addMessage('assistant', response.text);
            this.ui.addMessage(aiMessage);
        } catch (error) {
            const errorMessage = this.history.addMessage('assistant', 
                "Sorry, I encountered an error. Please try again later.");
            this.ui.addMessage(errorMessage);
            console.error('Chat error:', error);
        } finally {
            this.isGenerating = false;
            this.ui.hideTyping();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    document.body.classList.add(`${ENV.THEME}-theme`);
    
    // Initialize chat bot
    new ChatBot();
    
    // Register service worker if enabled
    if (ENV.ENABLE_SERVICE_WORKER && 'serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/wayne-ai/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});
