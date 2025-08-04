import API_CONFIG from './env.js';

class GeminiHandler {
    constructor() {
        this.apiKey = API_CONFIG.GEMINI_API_KEY;
        this.endpoint = API_CONFIG.GEMINI_ENDPOINT;
        this.model = API_CONFIG.DEFAULT_MODEL;
    }
    
    async generateContent(prompt) {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }
        
        try {
            const url = `${this.endpoint}?key=${this.apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error in Gemini API call:', error);
            throw error;
        }
    }
}

// Singleton instance
const geminiInstance = new GeminiHandler();

// Export functions
export async function getAIResponse(prompt) {
    return await geminiInstance.generateContent(prompt);
}

export default geminiInstance;
