// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all pages
    initNavigation();
    initDarkModeToggle();
    
    // Page-specific initializations
    if (document.querySelector('.dashboard')) {
        initDashboard();
    }
    
    if (document.querySelector('.generation-container')) {
        initGenerationPage();
    }
});

function initNavigation() {
    // Mobile menu toggle would go here
    console.log('Navigation initialized');
}

function initDarkModeToggle() {
    // Dark mode is default in Nero theme
    console.log('Dark mode initialized');
}

function initDashboard() {
    const chatInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    if (chatInput && sendButton) {
        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    console.log('Dashboard initialized');
}

function initGenerationPage() {
    // Common generation page functionality
    console.log('Generation page initialized');
    
    // Load history for the current page
    loadHistory();
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message) {
        // Add to chat history
        addMessageToChat('user', message);
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            addMessageToChat('ai', "I'm Wayne-AI. How can I assist you further?");
        }, 1000);
    }
}

function addMessageToChat(sender, text) {
    const chatHistory = document.getElementById('chatHistory');
    if (!chatHistory) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function loadHistory() {
    // This would load from localStorage
    console.log('Loading history for current page');
}

// Utility function to save to localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(`wayne-ai_${key}`, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

// Utility function to load from localStorage
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(`wayne-ai_${key}`);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return null;
    }
}
