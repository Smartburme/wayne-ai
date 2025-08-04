import ENV from './env.js';

class ApiService {
    constructor() {
        this.cache = new Map();
        this.requestQueue = [];
        this.isProcessingQueue = false;
    }

    async _fetchWithAuth(endpoint, provider, body, options = {}) {
        if (!this._validateApiKey(provider)) {
            throw new Error(`Missing or invalid API key for ${provider}`);
        }

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this._getAuthHeader(provider)
            },
            body: JSON.stringify(body),
            ...options
        };

        const baseUrl = this._getBaseUrl(provider);
        const response = await fetch(`${baseUrl}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }

        return response.json();
    }

    _getBaseUrl(provider) {
        switch (provider) {
            case 'gemini': return ENV.API_BASE_URL;
            case 'openai': return ENV.OPENAI_BASE_URL;
            case 'stability': return ENV.STABILITY_BASE_URL;
            default: throw new Error(`Unknown provider: ${provider}`);
        }
    }

    _getAuthHeader(provider) {
        switch (provider) {
            case 'gemini':
                return { 'Authorization': `Bearer ${ENV.GEMINI_API_KEY}` };
            case 'openai':
                return { 'Authorization': `Bearer ${ENV.OPENAI_API_KEY}` };
            case 'stability':
                return { 'Authorization': `Bearer ${ENV.STABILITY_API_KEY}` };
            default:
                return {};
        }
    }

    _validateApiKey(provider) {
        const key = ENV[`${provider.toUpperCase()}_API_KEY`];
        return key && key.length > 30; // Basic validation
    }

    async generateContent(prompt, type = 'text', options = {}) {
        const provider = options.provider || ENV.DEFAULT_PROVIDER;
        const cacheKey = `${provider}-${type}-${JSON.stringify(prompt)}`;

        // Check cache first if enabled
        if (ENV.ENABLE_CACHE && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            let endpoint, requestBody;
            
            switch (provider) {
                case 'gemini':
                    endpoint = `/models/gemini-pro:generateContent`;
                    requestBody = {
                        contents: [{
                            parts: [{ text: prompt }]
                        }]
                    };
                    break;
                    
                case 'openai':
                    if (type === 'image') {
                        endpoint = '/images/generations';
                        requestBody = {
                            prompt,
                            n: 1,
                            size: options.size || '512x512'
                        };
                    } else {
                        endpoint = '/chat/completions';
                        requestBody = {
                            model: 'gpt-3.5-turbo',
                            messages: [{ role: 'user', content: prompt }],
                            max_tokens: 1000
                        };
                    }
                    break;
                    
                case 'stability':
                    endpoint = '/generation/stable-diffusion-xl-1024-v1-0/text-to-image';
                    requestBody = {
                        text_prompts: [{ text: prompt }],
                        cfg_scale: 7,
                        height: parseInt(options.size?.split('x')[1]) || 1024,
                        width: parseInt(options.size?.split('x')[0]) || 1024,
                        steps: 30
                    };
                    break;
                    
                default:
                    throw new Error(`Unsupported provider: ${provider}`);
            }

            const response = await this._fetchWithAuth(endpoint, provider, requestBody);
            const result = this._formatResponse(response, provider, type);
            
            // Cache the result
            if (ENV.ENABLE_CACHE) {
                this.cache.set(cacheKey, result);
            }
            
            return result;
            
        } catch (error) {
            console.error(`Error with ${provider} API:`, error);
            throw error;
        }
    }

    _formatResponse(response, provider, type) {
        switch (provider) {
            case 'gemini':
                return {
                    text: response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated',
                    provider: 'gemini'
                };
                
            case 'openai':
                if (type === 'image') {
                    return {
                        url: response.data?.[0]?.url || '',
                        provider: 'openai'
                    };
                }
                return {
                    text: response.choices?.[0]?.message?.content || 'No response generated',
                    provider: 'openai'
                };
                
            case 'stability':
                return {
                    url: `data:image/png;base64,${response.artifacts?.[0]?.base64}`,
                    provider: 'stability'
                };
                
            default:
                return response;
        }
    }
}

// Singleton instance
const apiService = new ApiService();
export default apiService;
