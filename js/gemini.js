// Gemini API Handler
class GeminiAPI {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
        this.loadAPIKey();
    }
    
    async loadAPIKey() {
        // Load from env.js or environment variables
        if (typeof GEMINI_API_KEY !== 'undefined') {
            this.apiKey = GEMINI_API_KEY;
        } else {
            console.error('GEMINI_API_KEY is not defined');
        }
    }
    
    async generateText(prompt, options = {}) {
        if (!this.apiKey) {
            throw new Error('API key not loaded');
        }
        
        const endpoint = `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxTokens || 2048
            }
        };
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error generating text:', error);
            throw error;
        }
    }
    
    async generateImage(prompt, options = {}) {
        // Similar implementation for image generation
        console.log('Image generation would happen here');
        return 'https://example.com/generated-image.jpg';
    }
    
    async generateCode(prompt, language, options = {}) {
        // Similar implementation for code generation
        console.log('Code generation would happen here');
        return '// Generated code would appear here';
    }
    
    async chat(message, history = []) {
        if (!this.apiKey) {
            throw new Error('API key not loaded');
        }
        
        const endpoint = `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`;
        
        const requestBody = {
            contents: [
                ...history,
                {
                    role: "user",
                    parts: [{
                        text: message
                    }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048
            }
        };
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error in chat:', error);
            throw error;
        }
    }
}

// Initialize Gemini API
const gemini = new GeminiAPI();

// Expose to window for debugging
window.gemini = gemini;
