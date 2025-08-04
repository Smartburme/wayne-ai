document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    });
    
    // Chat functionality
    const chatHistory = document.getElementById('chatHistory');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    function addMessageToHistory(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${role}-message`;
        
        const avatar = document.createElement('img');
        avatar.src = role === 'ai' ? 'assets/icons/ai-avatar.svg' : 'assets/icons/user-avatar.svg';
        avatar.alt = `${role} avatar`;
        
        const messageContent = document.createElement('p');
        messageContent.textContent = content;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        chatHistory.appendChild(messageDiv);
        
        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessageToHistory('user', message);
        userInput.value = '';
        
        try {
            // Show loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'ai-message loading';
            loadingDiv.innerHTML = `
                <img src="assets/icons/ai-avatar.svg" alt="AI Avatar">
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            chatHistory.appendChild(loadingDiv);
            chatHistory.scrollTop = chatHistory.scrollHeight;
            
            // Get AI response
            const response = await getAIResponse(message);
            
            // Remove loading and add response
            chatHistory.removeChild(loadingDiv);
            addMessageToHistory('ai', response);
        } catch (error) {
            console.error('Error getting AI response:', error);
            addMessageToHistory('ai', 'Sorry, I encountered an error. Please try again.');
        }
    }
    
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Initialize other components
    initializeQuickActions();
});

function initializeQuickActions() {
    // Add any quick action initialization here
    console.log('Quick actions initialized');
}

// This would be implemented in gemini.js
async function getAIResponse(prompt) {
    // Placeholder - actual implementation will use Gemini API
    return "This is a simulated response. In the actual implementation, this will call the Gemini API.";
}
