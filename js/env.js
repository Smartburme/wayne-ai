// This file will be generated during build process
const ENV = {
    // These values will be injected by GitHub Actions
    GEMINI_API_KEY: window.__GEMINI_API_KEY || '',
    OPENAI_API_KEY: window.__OPENAI_API_KEY || '',
    STABILITY_API_KEY: window.__STABILITY_API_KEY || '',
    
    // Other configuration
    API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
    OPENAI_BASE_URL: 'https://api.openai.com/v1',
    STABILITY_BASE_URL: 'https://api.stability.ai/v1',
    DEFAULT_PROVIDER: 'gemini',
    THEME: localStorage.getItem('wayne-ai-theme') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'nero' : 'guardian'),
    ENABLE_CACHE: true
};

export default ENV;
