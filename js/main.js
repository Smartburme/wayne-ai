document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const newChatBtn = document.getElementById('newChatBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const chatHistoryList = document.getElementById('chatHistoryList');
    const generateHistoryList = document.getElementById('generateHistoryList');
    const historySidebar = document.getElementById('historySidebar');
    
    // Chat state
    let currentChatId = generateChatId();
    let chats = loadChats();
    let currentChat = getCurrentChat();
    
    // Initialize the UI
    renderChatHistory();
    renderCurrentChat();
    
    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    newChatBtn.addEventListener('click', startNewChat);
    clearHistoryBtn.addEventListener('click', clearChatHistory);
    
    // Functions
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        userInput.value = '';
        
        // Simulate bot response (in a real app, this would be an API call)
        setTimeout(() => {
            const botResponse = generateBotResponse(message);
            addMessageToChat('bot', botResponse);
            
            // Update history
            updateChatHistory();
        }, 1000);
    }
    
    function addMessageToChat(sender, message) {
        const timestamp = new Date().toISOString();
        currentChat.messages.push({
            sender,
            message,
            timestamp
        });
        
        saveChats();
        renderCurrentChat();
    }
    
    function renderCurrentChat() {
        chatContainer.innerHTML = '';
        
        if (currentChat.messages.length === 0) {
            // Show welcome message if no messages
            chatContainer.innerHTML = `
                <div class="chat-message bot-message">
                    <div class="message-content">
                        <div class="message-text">
                            <h2>Welcome to Wayne-AI!</h2>
                            <p>I'm your AI assistant. How can I help you today?</p>
                        </div>
                        <div class="message-time">Just now</div>
                    </div>
                </div>
            `;
            return;
        }
        
        currentChat.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${msg.sender}-message`;
            
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${msg.message}</div>
                    <div class="message-time">${formatTime(msg.timestamp)}</div>
                </div>
            `;
            
            chatContainer.appendChild(messageDiv);
        });
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    function startNewChat() {
        // Save current chat if not empty
        if (currentChat.messages.length > 0) {
            currentChatId = generateChatId();
            currentChat = {
                id: currentChatId,
                title: 'New Chat',
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            chats.push(currentChat);
            saveChats();
        }
        
        renderCurrentChat();
        renderChatHistory();
    }
    
    function renderChatHistory() {
        chatHistoryList.innerHTML = '';
        
        chats.forEach(chat => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const preview = lastMessage ? 
                lastMessage.message.substring(0, 30) + (lastMessage.message.length > 30 ? '...' : '') : 
                'New Chat';
            
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${chat.id === currentChatId ? 'active' : ''}`;
            historyItem.innerHTML = `
                <div class="history-preview">${preview}</div>
                <div class="history-time">${formatTime(chat.updatedAt)}</div>
            `;
            
            historyItem.addEventListener('click', () => {
                currentChatId = chat.id;
                currentChat = chat;
                renderCurrentChat();
                renderChatHistory();
            });
            
            chatHistoryList.appendChild(historyItem);
        });
    }
    
    function clearChatHistory() {
        if (confirm('Are you sure you want to clear all chat history?')) {
            chats = [];
            currentChatId = generateChatId();
            currentChat = {
                id: currentChatId,
                title: 'New Chat',
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            saveChats();
            renderChatHistory();
            renderCurrentChat();
        }
    }
    
    function updateChatHistory() {
        const chatIndex = chats.findIndex(chat => chat.id === currentChatId);
        if (chatIndex !== -1) {
            chats[chatIndex] = currentChat;
            saveChats();
            renderChatHistory();
        }
    }
    
    // Helper functions
    function generateChatId() {
        return Date.now().toString();
    }
    
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    function generateBotResponse(userMessage) {
        // This is a simplified response generator
        // In a real app, you would call your AI API here
        const responses = [
            `I understand you're asking about "${userMessage}". Can you provide more details?`,
            `Interesting question about "${userMessage}". Here's what I know...`,
            `Regarding "${userMessage}", I can help with that.`,
            `Thanks for your message about "${userMessage}". Let me think about that.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Data persistence functions
    function loadChats() {
        const savedChats = localStorage.getItem('wayneAIChats');
        if (savedChats) {
            return JSON.parse(savedChats);
        }
        return [{
            id: currentChatId,
            title: 'Welcome Chat',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }];
    }
    
    function getCurrentChat() {
        const chat = chats.find(chat => chat.id === currentChatId);
        if (chat) return chat;
        
        // If not found, create new
        const newChat = {
            id: currentChatId,
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        chats.push(newChat);
        return newChat;
    }
    
    function saveChats() {
        localStorage.setItem('wayneAIChats', JSON.stringify(chats));
    }
});
