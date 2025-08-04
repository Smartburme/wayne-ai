// Enhanced Chat Interface with Multi-API Support
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChatButton');
    const clearBtn = document.getElementById('clearChatButton');
    const messagesDiv = document.getElementById('chatMessages');
    const historyList = document.getElementById('chatHistoryList');
    const modelSelector = document.getElementById('chatModelSelector');

    let currentConversation = [];
    let currentChatId = null;

    // Initialize model selector
    function initModelSelector() {
        const status = ai.getApiStatus();
        
        if (status.openai.enabled) {
            modelSelector.innerHTML += `
                <div class="model-option active" data-model="openai">
                    <div class="model-name">GPT-4</div>
                    <div class="model-status">OpenAI</div>
                </div>
            `;
        }
        
        if (status.gemini.enabled) {
            modelSelector.innerHTML += `
                <div class="model-option" data-model="gemini">
                    <div class="model-name">Gemini Pro</div>
                    <div class="model-status">Google</div>
                </div>
            `;
        }

        // Set first available model as active
        const firstModel = document.querySelector('.model-option');
        if (firstModel) {
            firstModel.classList.add('active');
        }
    }

    // Handle model selection
    modelSelector.addEventListener('click', function(e) {
        const modelOption = e.target.closest('.model-option');
        if (modelOption) {
            document.querySelectorAll('.model-option').forEach(opt => {
                opt.classList.remove('active');
            });
            modelOption.classList.add('active');
        }
    });

    // Send message
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        const selectedModel = document.querySelector('.model-option.active');
        if (!selectedModel) {
            alert('No AI model selected');
            return;
        }

        try {
            // Add user message to UI
            addMessage('user', message);
            chatInput.value = '';
            
            // Add to conversation history
            currentConversation.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });

            // Show loading indicator
            const loadingId = 'loading-' + Date.now();
            addMessage('ai', '<div class="loading-spinner"></div>', loadingId);

            // Get AI response
            const response = await ai.chat(message, currentConversation.slice(0, -1), {
                model: selectedModel.dataset.model === 'openai' ? 'gpt-4' : undefined
            });

            // Remove loading indicator
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) {
                loadingElement.remove();
            }

            // Add AI response
            addMessage('ai', response.content);
            
            // Add to conversation history
            currentConversation.push({
                role: 'ai',
                content: response.content,
                timestamp: new Date().toISOString(),
                api: response.api
            });

            // Save conversation
            saveConversation();

        } catch (error) {
            console.error('Chat failed:', error);
            addMessage('ai', `Error: ${error.message}`);
        }
    }

    // Add message to UI
    function addMessage(role, content, id = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        if (id) messageDiv.id = id;
        
        if (typeof content === 'string') {
            messageDiv.innerHTML = formatMessageContent(content);
        } else {
            messageDiv.appendChild(content);
        }
        
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Format message content
    function formatMessageContent(content) {
        // Simple formatting for code blocks
        return content
            .replace(/```(\w*)([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
            .replace(/\n/g, '<br>');
    }

    // Save conversation
    function saveConversation() {
        if (currentConversation.length === 0) return;
        
        if (!currentChatId) {
            currentChatId = 'chat-' + Date.now();
        }
        
        const chatData = {
            id: currentChatId,
            title: currentConversation[0].content.substring(0, 30),
            conversation: currentConversation,
            timestamp: new Date().toISOString(),
            model: document.querySelector('.model-option.active').dataset.model
        };
        
        let history = JSON.parse(localStorage.getItem('wayne-ai_chatHistory') || '[]');
        
        // Update or add new chat
        const existingIndex = history.findIndex(chat => chat.id === currentChatId);
        if (existingIndex !== -1) {
            history[existingIndex] = chatData;
        } else {
            history.unshift(chatData);
        }
        
        localStorage.setItem('wayne-ai_chatHistory', JSON.stringify(history.slice(0, 20)));
        updateHistoryDisplay();
    }

    // Load conversation
    function loadConversation(chatId) {
        const history = JSON.parse(localStorage.getItem('wayne-ai_chatHistory') || '[]');
        const chat = history.find(item => item.id === chatId);
        
        if (chat) {
            currentChatId = chat.id;
            currentConversation = chat.conversation;
            
            // Clear and rebuild chat UI
            messagesDiv.innerHTML = '';
            chat.conversation.forEach(msg => {
                addMessage(msg.role, msg.content);
            });
            
            // Set the correct model
            document.querySelectorAll('.model-option').forEach(opt => {
                opt.classList.remove('active');
                if (opt.dataset.model === chat.model) {
                    opt.classList.add('active');
                }
            });
        }
    }

    // Clear conversation
    function clearConversation() {
        if (confirm('Clear the current conversation?')) {
            currentConversation = [];
            currentChatId = null;
            messagesDiv.innerHTML = '';
        }
    }

    // Update history display
    function updateHistoryDisplay() {
        const history = JSON.parse(localStorage.getItem('wayne-ai_chatHistory') || '[]');
        historyList.innerHTML = '';
        
        history.forEach(chat => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="details">
                    <p>${chat.title}${chat.title.length === 30 ? '...' : ''}</p>
                    <small>${chat.model} • ${new Date(chat.timestamp).toLocaleString()}</small>
                </div>
                <button class="delete" data-id="${chat.id}">×</button>
            `;
            
            historyItem.addEventListener('click', () => {
                loadConversation(chat.id);
            });
            
            historyList.appendChild(historyItem);
        });
        
        // Add delete handlers
        document.querySelectorAll('.history-item .delete').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteConversation(this.dataset.id);
            });
        });
    }

    // Delete conversation
    function deleteConversation(chatId) {
        let history = JSON.parse(localStorage.getItem('wayne-ai_chatHistory') || '[]');
        history = history.filter(chat => chat.id !== chatId);
        
        if (currentChatId === chatId) {
            currentConversation = [];
            currentChatId = null;
            messagesDiv.innerHTML = '';
        }
        
        localStorage.setItem('wayne-ai_chatHistory', JSON.stringify(history));
        updateHistoryDisplay();
    }

    // Initialize
    initModelSelector();
    updateHistoryDisplay();
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    clearBtn.addEventListener('click', clearConversation);
    
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Load last conversation if exists
    const history = JSON.parse(localStorage.getItem('wayne-ai_chatHistory') || '[]');
    if (history.length > 0) {
        loadConversation(history[0].id);
    }
});
