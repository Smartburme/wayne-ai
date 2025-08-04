// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-message');
const attachButton = document.getElementById('attach-file');
const quickPrompts = document.querySelectorAll('.quick-prompt');
const toggleGenerator = document.getElementById('toggle-generator');
const generatorPanel = document.querySelector('.generator-panel');
const navButtons = document.querySelectorAll('.nav-btn');
const settingsButton = document.querySelector('[data-target="settings"]');
const settingsPanel = document.getElementById('settings-panel');
const closeSettings = document.getElementById('close-settings');
const themeToggle = document.getElementById('theme-toggle');
const themeOptions = document.querySelectorAll('.theme-option');
const clearHistoryButton = document.getElementById('clear-history');
const aiModelSelect = document.getElementById('ai-model');

// State Management
let currentTheme = 'dark';
let currentModel = 'gemini-pro';
let chatHistory = [];

// Initialize the app
function init() {
    loadSettings();
    setupEventListeners();
    adjustTextareaHeight();
    checkSystemTheme();
}

// Event Listeners
function setupEventListeners() {
    // Chat functionality
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Textarea auto-resize
    userInput.addEventListener('input', adjustTextareaHeight);
    
    // Quick prompts
    quickPrompts.forEach(prompt => {
        prompt.addEventListener('click', () => {
            userInput.value = prompt.textContent;
            adjustTextareaHeight();
            userInput.focus();
        });
    });
    
    // Generator panel toggle
    toggleGenerator.addEventListener('click', () => {
        generatorPanel.classList.toggle('open');
        const icon = toggleGenerator.querySelector('i');
        if (generatorPanel.classList.contains('open')) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    });
    
    // Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            if (button.dataset.target === 'settings') {
                settingsPanel.classList.add('open');
            } else {
                settingsPanel.classList.remove('open');
            }
        });
    });
    
    // Settings panel
    closeSettings.addEventListener('click', () => {
        settingsPanel.classList.remove('open');
        document.querySelector('[data-target="chat"]').classList.add('active');
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Theme options
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            currentTheme = option.dataset.theme;
            applyTheme(currentTheme);
            saveSettings();
        });
    });
    
    // Clear history
    clearHistoryButton.addEventListener('click', clearChatHistory);
    
    // Model selection
    aiModelSelect.addEventListener('change', (e) => {
        currentModel = e.target.value;
        saveSettings();
    });
    
    // Handle system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (currentTheme === 'system') {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Chat Functions
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage('user', message);
    userInput.value = '';
    adjustTextareaHeight();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response after a delay
    setTimeout(() => {
        removeTypingIndicator();
        generateAIResponse(message);
    }, 1500);
}

function addMessage(role, content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `message-${role}`);
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            ${role === 'user' ? '<i class="fas fa-user"></i>' : '<img src="../assets/images/ai-logo.png" alt="AI">'}
        </div>
        <div class="message-content">
            <div class="message-text">${content}</div>
            <div class="message-time">${timestamp}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to chat history
    chatHistory.push({ role, content, timestamp });
}

function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.classList.add('typing-indicator');
    typingElement.id = 'typing-indicator';
    typingElement.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        typingElement.remove();
    }
}

async function generateAIResponse(prompt) {
    try {
        let response;
        
        switch (currentModel) {
            case 'gemini-pro':
                response = await generateText(prompt, currentModel);
                break;
            case 'gpt-4':
                response = await generateText(prompt, currentModel);
                break;
            case 'claude-2':
                response = await generateText(prompt, currentModel);
                break;
            default:
                response = "I'm not sure how to respond to that.";
        }
        
        addMessage('bot', response);
    } catch (error) {
        addMessage('bot', `Sorry, I encountered an error: ${error.message}`);
        console.error('AI Response Error:', error);
    }
}

// UI Functions
function adjustTextareaHeight() {
    userInput.style.height = 'auto';
    userInput.style.height = `${Math.min(userInput.scrollHeight, 150)}px`;
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    saveSettings();
    
    // Update theme options
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === currentTheme) {
            option.classList.add('active');
        }
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle icon
    const icon = themeToggle.querySelector('i');
    icon.classList.remove('fa-moon', 'fa-sun');
    icon.classList.add(theme === 'dark' ? 'fa-moon' : 'fa-sun');
}

function checkSystemTheme() {
    if (currentTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        applyTheme(systemTheme);
    }
}

// Settings Functions
function saveSettings() {
    const settings = {
        theme: currentTheme,
        model: currentModel,
        history: chatHistory
    };
    localStorage.setItem('wayne-ai-settings', JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('wayne-ai-settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        currentTheme = settings.theme || 'dark';
        currentModel = settings.model || 'gemini-pro';
        chatHistory = settings.history || [];
        
        // Apply loaded settings
        applyTheme(currentTheme);
        aiModelSelect.value = currentModel;
        
        // Restore chat history
        if (chatHistory.length > 0) {
            chatHistory.forEach(msg => {
                addMessage(msg.role, msg.content);
            });
        }
        
        // Set active theme option
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === currentTheme) {
                option.classList.add('active');
            }
        });
    }
}

function clearChatHistory() {
    chatMessages.innerHTML = `
        <div class="welcome-message">
            <img src="../assets/images/ai-logo.png" alt="Wayne-AI" class="bot-avatar">
            <div class="message-content">
                <h3>Welcome to Wayne-AI</h3>
                <p>I'm your AI assistant. How can I help you today?</p>
                <div class="quick-prompts">
                    <button class="quick-prompt">Explain quantum computing</button>
                    <button class="quick-prompt">Generate Python code</button>
                    <button class="quick-prompt">Create a marketing plan</button>
                </div>
            </div>
        </div>
    `;
    chatHistory = [];
    saveSettings();
    
    // Reattach event listeners to quick prompts
    document.querySelectorAll('.quick-prompt').forEach(prompt => {
        prompt.addEventListener('click', () => {
            userInput.value = prompt.textContent;
            adjustTextareaHeight();
            userInput.focus();
        });
    });
}

// Navigation
function navigateTo(page) {
    window.location.href = `${page}.html`;
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
