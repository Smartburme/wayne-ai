// Enhanced Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all pages
    initNavigation();
    initDarkModeToggle();
    initAPIStatusDisplay();
    
    // Page-specific initializations
    if (document.querySelector('.dashboard')) {
        initDashboard();
    }
    
    if (document.querySelector('.generation-container')) {
        initGenerationPage();
    }
});

function initNavigation() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

function initDarkModeToggle() {
    // Dark mode is default in Nero theme
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('nero-theme');
            document.body.classList.toggle('light-theme');
            
            // Save preference
            const isDark = document.body.classList.contains('nero-theme');
            localStorage.setItem('wayne-ai_themePreference', isDark ? 'dark' : 'light');
        });
        
        // Load saved preference
        const savedTheme = localStorage.getItem('wayne-ai_themePreference') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.remove('nero-theme');
            document.body.classList.add('light-theme');
        }
    }
}

function initAPIStatusDisplay() {
    // Display API status in footer
    const status = ai.getApiStatus();
    const footer = document.querySelector('footer');
    
    if (footer) {
        const statusElement = document.createElement('div');
        statusElement.className = 'api-status';
        
        statusElement.innerHTML = `
            <span class="${status.gemini.enabled ? 'active' : 'inactive'}">Gemini</span>
            <span class="${status.openai.enabled ? 'active' : 'inactive'}">OpenAI</span>
            <span class="${status.stability.enabled ? 'active' : 'inactive'}">Stability</span>
        `;
        
        footer.prepend(statusElement);
    }
}

function initDashboard() {
    // Initialize main dashboard
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
    
    // Initialize quick action cards
    document.querySelectorAll('.generator-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                alert('Please select an AI model first');
            }
        });
    });
}

function initGenerationPage() {
    // Common generation page functionality
    console.log('Generation page initialized');
    
    // Check if any APIs are available
    const status = ai.getApiStatus();
    if (!status.gemini.enabled && !status.openai.enabled && !status.stability.enabled) {
        alert('Warning: No AI APIs are currently configured');
    }
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message) {
        // Add to chat history
        addMessageToChat('user', message);
        input.value = '';
        
        try {
            // Get AI response
            const response = await ai.chat(message);
            
            // Add AI response
            addMessageToChat('ai', response.content);
        } catch (error) {
            console.error('Chat failed:', error);
            addMessageToChat('ai', "I'm having trouble responding right now. Please try again later.");
        }
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

// Initialize AI handler
window.ai = new AIHandler();
