// API Configuration
const API_CONFIG = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    STABILITY_API_KEY: process.env.STABILITY_API_KEY || '',
    
    // API Endpoints
    GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    OPENAI_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
    STABILITY_ENDPOINT: 'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image',
    
    // Default settings
    DEFAULT_MODEL: 'gemini-pro',
    DEFAULT_TEMPERATURE: 0.7,
    DEFAULT_MAX_TOKENS: 1000
};

// Validate API keys on startup
function validateApiKeys() {
    if (!API_CONFIG.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY is not set. Some features may not work.');
    }
    if (!API_CONFIG.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY is not set. OpenAI features will be disabled.');
    }
    if (!API_CONFIG.STABILITY_API_KEY) {
        console.warn('STABILITY_API_KEY is not set. Image generation will be disabled.');
    }
}

// Initialize API configuration
validateApiKeys();

// Export configuration
export default API_CONFIG;
