// Enhanced Multi-API Handler with Error Fallbacks
class AIHandler {
    constructor() {
        this.apis = {
            gemini: {
                name: 'Gemini',
                baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
                key: API_CONFIG.GEMINI.KEY,
                enabled: API_CONFIG.GEMINI.ENABLED,
                models: API_CONFIG.GEMINI.MODELS,
                priority: 1
            },
            openai: {
                name: 'OpenAI',
                baseUrl: 'https://api.openai.com/v1',
                key: API_CONFIG.OPENAI.KEY,
                enabled: API_CONFIG.OPENAI.ENABLED,
                models: API_CONFIG.OPENAI.MODELS,
                priority: 2
            },
            stability: {
                name: 'Stability AI',
                baseUrl: 'https://api.stability.ai/v1',
                key: API_CONFIG.STABILITY.KEY,
                enabled: API_CONFIG.STABILITY.ENABLED,
                engines: API_CONFIG.STABILITY.ENGINES,
                priority: 1
            }
        };
        
        this.requestQueue = [];
        this.isProcessingQueue = false;
    }

    // Get available APIs sorted by priority
    _getAvailableApis(type) {
        return Object.values(this.apis)
            .filter(api => api.enabled)
            .filter(api => {
                if (type === 'text') return api.models?.text;
                if (type === 'image') return api.models?.image || api.engines;
                if (type === 'code') return api.models?.text;
                return true;
            })
            .sort((a, b) => a.priority - b.priority);
    }

    // Enhanced request handler with retry logic
    async _makeRequest(url, options, apiName) {
        const startTime = Date.now();
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `${apiName} API error: ${response.status} - ${errorData.error?.message || response.statusText}`
                );
            }
            
            return await response.json();
        } catch (error) {
            console.error(`API request failed (${Date.now() - startTime}ms):`, error);
            throw error;
        }
    }

    // Text generation with automatic fallback
    async generateText(prompt, options = {}) {
        const availableApis = this._getAvailableApis('text');
        
        for (const api of availableApis) {
            try {
                if (api.name === 'Gemini') {
                    return await this._generateWithGemini(prompt, options, api);
                } else if (api.name === 'OpenAI') {
                    return await this._generateWithOpenAI(prompt, options, api);
                }
            } catch (error) {
                console.warn(`${api.name} failed, trying next API...`);
                continue;
            }
        }
        
        throw new Error('No available text generation API succeeded');
    }

    async _generateWithGemini(prompt, options, api) {
        const endpoint = `${api.baseUrl}/models/${api.models.text}:generateContent?key=${api.key}`;
        
        const requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                maxOutputTokens: options.maxTokens || 2048
            }
        };
        
        const response = await this._makeRequest(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }, api.name);
        
        return response.candidates[0].content.parts[0].text;
    }

    async _generateWithOpenAI(prompt, options, api) {
        const endpoint = `${api.baseUrl}/chat/completions`;
        
        const requestBody = {
            model: options.model || api.models.chat,
            messages: [{ role: "user", content: prompt }],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 2048
        };
        
        const response = await this._makeRequest(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api.key}`
            },
            body: JSON.stringify(requestBody)
        }, api.name);
        
        return response.choices[0].message.content;
    }

    // Image generation with multiple providers
    async generateImage(prompt, options = {}) {
        const availableApis = this._getAvailableApis('image');
        
        for (const api of availableApis) {
            try {
                if (api.name === 'Stability AI') {
                    return await this._generateWithStability(prompt, options, api);
                } else if (api.name === 'OpenAI') {
                    return await this._generateWithDalle(prompt, options, api);
                }
            } catch (error) {
                console.warn(`${api.name} failed, trying next API...`);
                continue;
            }
        }
        
        throw new Error('No available image generation API succeeded');
    }

    async _generateWithStability(prompt, options, api) {
        const engineId = options.engine || api.engines.SDXL;
        const endpoint = `${api.baseUrl}/generation/${engineId}/text-to-image`;
        
        const requestBody = {
            text_prompts: [{ text: prompt, weight: 1 }],
            cfg_scale: options.cfgScale || 7,
            height: options.height || 1024,
            width: options.width || 1024,
            steps: options.steps || 30,
            samples: 1
        };
        
        const response = await this._makeRequest(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api.key}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }, api.name);
        
        return {
            url: `data:image/png;base64,${response.artifacts[0].base64}`,
            api: 'stability',
            model: engineId
        };
    }

    async _generateWithDalle(prompt, options, api) {
        const endpoint = `${api.baseUrl}/images/generations`;
        
        const requestBody = {
            prompt: prompt,
            n: 1,
            size: options.size || "1024x1024",
            response_format: "b64_json"
        };
        
        const response = await this._makeRequest(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api.key}`
            },
            body: JSON.stringify(requestBody)
        }, api.name);
        
        return {
            url: `data:image/png;base64,${response.data[0].b64_json}`,
            api: 'openai',
            model: api.models.image
        };
    }

    // Code generation with formatting
    async generateCode(prompt, language, options = {}) {
        const availableApis = this._getAvailableApis('code');
        
        const enhancedPrompt = `Write ${language} code that: ${prompt}\n\nRequirements:
- Return only the code
- Include appropriate comments
- Use best practices for ${language}
- Format the code properly`;

        for (const api of availableApis) {
            try {
                if (api.name === 'Gemini') {
                    return await this._generateCodeWithGemini(enhancedPrompt, options, api);
                } else if (api.name === 'OpenAI') {
                    return await this._generateCodeWithOpenAI(enhancedPrompt, language, options, api);
                }
            } catch (error) {
                console.warn(`${api.name} failed, trying next API...`);
                continue;
            }
        }
        
        throw new Error('No available code generation API succeeded');
    }

    async _generateCodeWithGemini(prompt, options, api) {
        const endpoint = `${api.baseUrl}/models/${api.models.text}:generateContent?key=${api.key}`;
        
        const requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.2,
                maxOutputTokens: options.maxTokens || 2048
            }
        };
        
        const response = await this._makeRequest(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }, api.name);
        
        return response.candidates[0].content.parts[0].text;
    }

    async _generateCodeWithOpenAI(prompt, language, options, api) {
        const endpoint = `${api.baseUrl}/chat/completions`;
        
        const requestBody = {
            model: options.model || api.models.chat,
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: options.temperature || 0.2,
            max_tokens: options.maxTokens || 2048
        };
        
        const response = await this._makeRequest(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api.key}`
            },
            body: JSON.stringify(requestBody)
        }, api.name);
        
        return response.choices[0].message.content;
    }

    // Explain code with context
    async explainCode(code, language, options = {}) {
        const availableApis = this._getAvailableApis('text');
        
        const prompt = `Explain this ${language} code:\n\n${code}\n\nExplanation should:
- Describe what the code does
- Explain key functions or methods
- Note any important algorithms or patterns
- Be concise but comprehensive`;

        for (const api of availableApis) {
            try {
                if (api.name === 'Gemini') {
                    return await this._generateWithGemini(prompt, options, api);
                } else if (api.name === 'OpenAI') {
                    return await this._generateWithOpenAI(prompt, options, api);
                }
            } catch (error) {
                console.warn(`${api.name} failed, trying next API...`);
                continue;
            }
        }
        
        throw new Error('No available API succeeded for code explanation');
    }

    // Chat with conversation history
    async chat(message, history = [], options = {}) {
        const availableApis = this._getAvailableApis('text');
        
        for (const api of availableApis) {
            try {
                if (api.name === 'Gemini') {
                    return await this._chatWithGemini(message, history, options, api);
                } else if (api.name === 'OpenAI') {
                    return await this._chatWithOpenAI(message, history, options, api);
                }
            } catch (error) {
                console.warn(`${api.name} failed, trying next API...`);
                continue;
            }
        }
        
        throw new Error('No available chat API succeeded');
    }

    async _chatWithGemini(message, history, options, api) {
        const endpoint = `${api.baseUrl}/models/${api.models.text}:generateContent?key=${api.key}`;
        
        const requestBody = {
            contents: [
                ...history.map(item => ({
                    role: item.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: item.content }]
                })),
                {
                    role: "user",
                    parts: [{ text: message }]
                }
            ],
            generationConfig: {
                temperature: options.temperature || 0.7,
                maxOutputTokens: options.maxTokens || 2048
            }
        };
        
        const response = await this._makeRequest(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }, api.name);
        
        return {
            content: response.candidates[0].content.parts[0].text,
            api: 'gemini'
        };
    }

    async _chatWithOpenAI(message, history, options, api) {
        const endpoint = `${api.baseUrl}/chat/completions`;
        
        const requestBody = {
            model: options.model || api.models.chat,
            messages: [
                ...history.map(item => ({
                    role: item.role === 'ai' ? 'assistant' : 'user',
                    content: item.content
                })),
                { role: "user", content: message }
            ],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 2048
        };
        
        const response = await this._makeRequest(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api.key}`
            },
            body: JSON.stringify(requestBody)
        }, api.name);
        
        return {
            content: response.choices[0].message.content,
            api: 'openai'
        };
    }

    // Get API status
    getApiStatus() {
        return {
            gemini: {
                enabled: this.apis.gemini.enabled,
                name: this.apis.gemini.name
            },
            openai: {
                enabled: this.apis.openai.enabled,
                name: this.apis.openai.name
            },
            stability: {
                enabled: this.apis.stability.enabled,
                name: this.apis.stability.name
            }
        };
    }
}

// Initialize AI Handler
const ai = new AIHandler();

// Display API status in console
console.log('API Status:', ai.getApiStatus());

// Expose to window for debugging
if (typeof window !== 'undefined') {
    window.WayneAI = window.WayneAI || {};
    window.WayneAI.API = ai;
}
