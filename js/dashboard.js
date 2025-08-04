document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // API Status Check
    async function checkApiStatus() {
        try {
            const status = await ai.getApiStatus();
            
            document.getElementById('openai-status').className = status.openai.enabled ? 'active' : 'inactive';
            document.getElementById('gemini-status').className = status.gemini.enabled ? 'active' : 'inactive';
            document.getElementById('stability-status').className = status.stability.enabled ? 'active' : 'inactive';
            
        } catch (error) {
            console.error('API status check failed:', error);
        }
    }

    // Quick prompt buttons
    const promptButtons = document.querySelectorAll('.prompt-btn');
    promptButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('userInput').value = this.dataset.prompt;
            document.getElementById('userInput').focus();
        });
    });

    // Load history previews
    function loadHistoryPreviews() {
        // Text history
        const textHistory = JSON.parse(localStorage.getItem('wayne-ai_textHistory') || '[]');
        if (textHistory.length > 0) {
            const preview = document.getElementById('text-history-preview');
            preview.textContent = `Recent: ${textHistory[0].prompt.substring(0, 30)}...`;
        }

        // Image history
        const imageHistory = JSON.parse(localStorage.getItem('wayne-ai_imageHistory') || '[]');
        if (imageHistory.length > 0) {
            const preview = document.getElementById('image-history-preview');
            preview.textContent = `Recent: ${imageHistory[0].prompt.substring(0, 30)}...`;
        }

        // Code history
        const codeHistory = JSON.parse(localStorage.getItem('wayne-ai_codeHistory') || '[]');
        if (codeHistory.length > 0) {
            const preview = document.getElementById('code-history-preview');
            preview.textContent = `Recent: ${codeHistory[0].prompt.substring(0, 30)}...`;
        }
    }

    // Initialize chat functionality
    const chatInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const chatHistory = document.getElementById('chatHistory');

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage('user', message);
        chatInput.value = '';

        // Add loading indicator
        const loadingId = 'loading-' + Date.now();
        addMessage('ai', '<div class="loading-spinner"></div>', loadingId);

        try {
            // Get AI response
            const response = await ai.chat(message);
            
            // Remove loading and add response
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) loadingElement.remove();
            
            addMessage('ai', response.content);
            
        } catch (error) {
            console.error('Chat failed:', error);
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) loadingElement.remove();
            
            addMessage('ai', `Error: ${error.message}`);
        }
    }

    function addMessage(role, content, id = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        if (id) messageDiv.id = id;
        
        messageDiv.innerHTML = content;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Initialize
    checkApiStatus();
    loadHistoryPreviews();
});
