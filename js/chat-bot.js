import apiService from './api.js';
import ENV from './env.js';

class ChatManager {
    constructor() {
        this.chatHistory = [];
        this.isGenerating = false;
        this.initElements();
        this.loadHistory();
        this.setupEventListeners();
    }

    initElements() {
        this.chatContainer = document.getElementById('chat-messages');
        this.inputField = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-btn');
        this.newChatButton = document.getElementById('new-chat-btn');
    }

    loadHistory() {
        const savedHistory = localStorage.getItem('wayne-ai-chat-history');
        if (savedHistory) {
            this.chatHistory = JSON.parse(savedHistory);
            this.renderHistory();
        }
    }

    saveHistory() {
        localStorage.setItem(
            'wayne-ai-chat-history',
            JSON.stringify(this.chatHistory)
        );
    }

    renderHistory() {
        this.chatContainer.innerHTML = '';
        this.chatHistory.forEach(msg => this.renderMessage(msg));
        this.scrollToBottom();
    }

    renderMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.role}-message`;
        messageElement.innerHTML = `
            <div class="message-content">${this.escapeHtml(message.content)}</div>
            <div class="message-meta">
                <span class="message-time">
                    ${new Date(message.timestamp).toLocaleTimeString()}
                </span>
                ${message.role === 'assistant' ? `
                    <button class="copy-btn" title="Copy message">
                        <img src="../assets/images/attach-icon.png" alt="Copy">
                    </button>
                ` : ''}
            </div>
        `;
        
        if (message.role === 'assistant') {
            messageElement.querySelector('.copy-btn')
                .addEventListener('click', () => this.copyToClipboard(message.content));
        }
        
        this.chatContainer.appendChild(messageElement);
    }

    async sendMessage() {
        const userInput = this.inputField.value.trim();
        if (!userInput || this.isGenerating) return;

        // Add user message
        const userMessage = {
            role: 'user',
            content: userInput,
            timestamp: new Date().toISOString()
        };
        this.chatHistory.push(userMessage);
        this.renderMessage(userMessage);
        this.inputField.value = '';
        this.saveHistory();

        // Generate AI response
        this.isGenerating = true;
        this.showTypingIndicator();

        try {
            const response = await apiService.generateContent(
                userInput,
                'chat',
                {
                    context: this.getConversationContext(),
                    provider: ENV.DEFAULT_PROVIDER
                }
            );

            const aiMessage = {
                role: 'assistant',
                content: response.text,
                timestamp: new Date().toISOString(),
                provider: response.provider
            };
            
            this.chatHistory.push(aiMessage);
            this.renderMessage(aiMessage);
            this.saveHistory();
        } catch (error) {
            console.error('Chat error:', error);
            this.showError("Sorry, I couldn't process your request. Please try again.");
        } finally {
            this.isGenerating = false;
            this.hideTypingIndicator();
        }
    }

    getConversationContext() {
        return this.chatHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content)
            .join('\n');
    }

    showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'message assistant-message typing';
        typingElement.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        this.chatContainer.appendChild(typingElement);
        this.scrollToBottom();
        this.typingElement = typingElement;
    }

    hideTypingIndicator() {
        if (this.typingElement && this.typingElement.parentNode) {
            this.typingElement.remove();
        }
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'message system-message error';
        errorElement.textContent = message;
        this.chatContainer.appendChild(errorElement);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            const tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'Copied!';
            document.body.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.classList.add('fade-out');
                setTimeout(() => tooltip.remove(), 300);
            }, 1000);
        });
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.newChatButton.addEventListener('click', () => {
            if (confirm('Start a new chat? Current conversation will be cleared.')) {
                this.chatHistory = [];
                this.saveHistory();
                this.renderHistory();
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatManager();
});
