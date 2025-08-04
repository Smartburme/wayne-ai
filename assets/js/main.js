document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const attachButton = document.getElementById('attach-button');
    const menuItems = document.querySelectorAll('.menu-item');

    // Handle navigation
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            if (page === 'chat') return; // Already on chat page
            
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Navigate to selected page
            window.location.href = `${page}.html`;
        });
    });

    // Handle sending messages
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';

        // Call AI API
        callAIAPI(message);
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Initial greeting
    setTimeout(() => {
        addMessage("Hello! I'm WAYNE AI. How can I assist you today?", 'ai');
    }, 1000);
});

// Call AI API through Cloudflare worker
async function callAIAPI(message) {
    try {
        const response = await fetchAIResponse(message);
        addMessage(response, 'ai');
    } catch (error) {
        addMessage("Sorry, I'm having trouble connecting to the AI service. Please try again later.", 'ai');
        console.error('API Error:', error);
    }
}
