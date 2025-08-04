const WayneAI = {
    // API Configuration
    apis: {
        gemini: {
            apiKey: '',
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
        },
        openai: {
            apiKey: '',
            endpoint: 'https://api.openai.com/v1/chat/completions'
        }
    },
    
    // Initialize with API keys
    init: function(geminiKey, openaiKey) {
        this.apis.gemini.apiKey = geminiKey;
        this.apis.openai.apiKey = openaiKey;
    },
    
    // Text Generation
    generateText: async function(prompt, provider = 'gemini') {
        if (!this.apis[provider]) {
            throw new Error('Invalid provider');
        }
        
        const api = this.apis[provider];
        
        try {
            let response;
            
            if (provider === 'gemini') {
                const requestBody = {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                };
                
                response = await fetch(`${api.endpoint}?key=${api.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });
            } else if (provider === 'openai') {
                response = await fetch(api.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${api.apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7
                    })
                });
            }
            
            const data = await response.json();
            return this.parseResponse(data, provider);
        } catch (error) {
            console.error('Error generating text:', error);
            return 'Sorry, there was an error processing your request.';
        }
    },
    
    // Parse API response
    parseResponse: function(data, provider) {
        if (provider === 'gemini') {
            return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
        } else if (provider === 'openai') {
            return data.choices?.[0]?.message?.content || 'No response from OpenAI';
        }
        return 'Unknown provider response';
    }
};

// Example usage:
// WayneAI.init('your-gemini-key', 'your-openai-key');
// WayneAI.generateText('Hello, how are you?', 'gemini').then(response => console.log(response));
