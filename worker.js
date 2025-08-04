addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    if (request.method === 'POST' && request.url.endsWith('/api')) {
        return handleAPIRequest(request);
    }
    
    return new Response('Not Found', { status: 404 });
}

async function handleAPIRequest(request) {
    try {
        const { prompt, model } = await request.json();
        
        let response;
        switch (model) {
            case 'gpt-3.5-turbo':
            case 'gpt-4':
                response = await callOpenAI(prompt, model);
                break;
            case 'gemini-pro':
                response = await callGemini(prompt);
                break;
            default:
                response = await callOpenAI(prompt, 'gpt-4');
        }
        
        return new Response(JSON.stringify({ response }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function callOpenAI(prompt, model) {
    const OPENAI_API_KEY = OPENAI_API_KEY; // Set in Cloudflare Workers environment variables
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callGemini(prompt) {
    const GEMINI_API_KEY = GEMINI_API_KEY; // Set in Cloudflare Workers environment variables
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
