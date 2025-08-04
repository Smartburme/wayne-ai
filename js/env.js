// API Configuration
const ai = {
    apiKeys: {
        openai: import.meta.env.VITE_OPENAI_API_KEY || '',
        gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
        stability: import.meta.env.VITE_STABILITY_API_KEY || ''
    },

    getApiStatus() {
        return {
            openai: { enabled: !!this.apiKeys.openai },
            gemini: { enabled: !!this.apiKeys.gemini },
            stability: { enabled: !!this.apiKeys.stability }
        };
    },

    async chat(prompt, history = [], options = {}) {
        const status = this.getApiStatus();
        
        // Try Gemini first if available
        if (status.gemini.enabled) {
            try {
                const response = await geminiChat(prompt, history, options);
                return { content: response, api: 'gemini' };
            } catch (error) {
                console.warn('Gemini failed, falling back:', error);
            }
        }
        
        // Fallback to OpenAI
        if (status.openai.enabled) {
            try {
                const response = await openaiChat(prompt, history, options);
                return { content: response, api: 'openai' };
            } catch (error) {
                console.error('All API attempts failed:', error);
                throw error;
            }
        }
        
        throw new Error('No available AI APIs');
    }
};

// Initialize with environment variables
if (typeof process !== 'undefined' && process.env) {
    ai.apiKeys = {
        openai: process.env.OPENAI_API_KEY || '',
        gemini: process.env.GEMINI_API_KEY || '',
        stability: process.env.STABILITY_API_KEY || ''
    };
}
