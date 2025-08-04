/**
 * API Key Configuration
 * This file is .gitignored and should NOT be committed to version control
 * In production, these values are replaced by GitHub Actions using secrets
 */

// API Keys Configuration Object
const API_KEYS = (function() {
    // Default development keys (empty for security)
    const DEFAULT_KEYS = {
        GEMINI: '',
        OPENAI: '',
        STABILITY: ''
    };

    // Check if we're running in a browser environment
    const isBrowser = typeof window !== 'undefined';

    // Function to safely get keys from either environment variables or defaults
    function getKeys() {
        try {
            // In production (GitHub Pages), these are replaced by the build process
            // During development, they can be set in localStorage for testing
            if (isBrowser) {
                // Check if we have keys in localStorage (for development)
                const storedKeys = localStorage.getItem('WAYNE_AI_API_KEYS');
                if (storedKeys) {
                    return JSON.parse(storedKeys);
                }
            }

            // Return default empty keys if nothing else is available
            return DEFAULT_KEYS;
        } catch (error) {
            console.error('Error loading API keys:', error);
            return DEFAULT_KEYS;
        }
    }

    // Function to validate key format (basic validation)
    function isValidKey(key) {
        return typeof key === 'string' && key.length > 30;
    }

    // Get the keys
    const keys = getKeys();

    // Return validated keys
    return {
        GEMINI: isValidKey(keys.GEMINI) ? keys.GEMINI : '',
        OPENAI: isValidKey(keys.OPENAI) ? keys.OPENAI : '',
        STABILITY: isValidKey(keys.STABILITY) ? keys.STABILITY : '',
        
        // Method for development - set keys in localStorage
        // Only available in non-production environments
        setDevKeys: function(keys) {
            if (isBrowser && process.env.NODE_ENV !== 'production') {
                try {
                    localStorage.setItem('WAYNE_AI_API_KEYS', JSON.stringify({
                        GEMINI: keys.GEMINI || '',
                        OPENAI: keys.OPENAI || '',
                        STABILITY: keys.STABILITY || ''
                    }));
                    console.log('Development API keys set in localStorage');
                } catch (error) {
                    console.error('Failed to set dev keys:', error);
                }
            }
        },
        
        // Method to clear dev keys
        clearDevKeys: function() {
            if (isBrowser) {
                localStorage.removeItem('WAYNE_AI_API_KEYS');
                console.log('Development API keys cleared');
            }
        }
    };
})();

// API Configuration Object
const API_CONFIG = {
    // Gemini API
    GEMINI: {
        BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
        KEY: API_KEYS.GEMINI,
        ENABLED: !!API_KEYS.GEMINI,
        MODELS: {
            TEXT: 'gemini-pro',
            MULTIMODAL: 'gemini-pro-vision'
        }
    },
    
    // OpenAI API
    OPENAI: {
        BASE_URL: 'https://api.openai.com/v1',
        KEY: API_KEYS.OPENAI,
        ENABLED: !!API_KEYS.OPENAI,
        MODELS: {
            CHAT: 'gpt-3.5-turbo',
            TEXT: 'text-davinci-003',
            IMAGE: 'dall-e-3'
        }
    },
    
    // Stability AI API
    STABILITY: {
        BASE_URL: 'https://api.stability.ai/v1',
        KEY: API_KEYS.STABILITY,
        ENABLED: !!API_KEYS.STABILITY,
        ENGINES: {
            SDXL: 'stable-diffusion-xl-1024-v1-0',
            SD_1_5: 'stable-diffusion-v1-5',
            SD_2_1: 'stable-diffusion-512-v2-1'
        }
    },
    
    // Utility methods
    getActiveServices: function() {
        return {
            text: this.GEMINI.ENABLED ? 'gemini' : this.OPENAI.ENABLED ? 'openai' : null,
            image: this.STABILITY.ENABLED ? 'stability' : this.OPENAI.ENABLED ? 'openai' : null,
            code: this.OPENAI.ENABLED ? 'openai' : this.GEMINI.ENABLED ? 'gemini' : null
        };
    },
    
    checkAllServices: function() {
        return {
            gemini: this.GEMINI.ENABLED,
            openai: this.OPENAI.ENABLED,
            stability: this.STABILITY.ENABLED
        };
    }
};

// For development purposes only - exposes a safe method to set keys
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    window.WayneAI = window.WayneAI || {};
    window.WayneAI.API = {
        setDevKeys: API_KEYS.setDevKeys,
        clearDevKeys: API_KEYS.clearDevKeys,
        checkStatus: API_CONFIG.checkAllServices
    };
}

// Export for Node.js environment (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_KEYS, API_CONFIG };
}
