// Cloudflare worker endpoint (replace with your actual endpoint)
const API_ENDPOINT = 'https://your-worker-subdomain.workers.dev/api';

async function fetchAIResponse(prompt) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: prompt,
            model: 'gpt-4' // Default model, can be changed in settings
        })
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.response;
}

// Other API functions for different services
async function generateImage(prompt) {
    // Implementation for Stability AI
}

async function generateTextWithGemini(prompt) {
    // Implementation for Gemini API
}

export { fetchAIResponse, generateImage, generateTextWithGemini };
