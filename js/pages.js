// Common Navigation Function
function navigateTo(page) {
    window.location.href = `${page}.html`;
}

// Text Generator Functionality
if (document.getElementById('text-prompt')) {
    const textPrompt = document.getElementById('text-prompt');
    const textOutput = document.getElementById('text-output');
    const generateTextBtn = document.getElementById('generate-text');
    const clearTextBtn = document.getElementById('clear-text');
    const copyTextBtn = document.getElementById('copy-text');
    const textModel = document.getElementById('text-model');
    const modelStatus = document.getElementById('model-status');
    const tokenCount = document.getElementById('token-count');

    generateTextBtn.addEventListener('click', async () => {
        if (!textPrompt.value.trim()) {
            alert('Please enter a prompt');
            return;
        }

        textOutput.innerHTML = '<div class="loading-animation"></div>';
        generateTextBtn.disabled = true;
        modelStatus.textContent = 'Generating...';
        
        try {
            const response = await generateText(textPrompt.value, textModel.value);
            textOutput.innerHTML = response;
            
            // Update token count (mock for now)
            const tokens = Math.floor(textPrompt.value.length / 4) + Math.floor(response.length / 4);
            tokenCount.textContent = `${tokens} tokens`;
            modelStatus.textContent = 'Ready';
        } catch (error) {
            textOutput.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            modelStatus.textContent = 'Error';
        } finally {
            generateTextBtn.disabled = false;
        }
    });

    clearTextBtn.addEventListener('click', () => {
        textPrompt.value = '';
        textOutput.innerHTML = '';
        tokenCount.textContent = '0 tokens';
    });

    copyTextBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(textOutput.textContent)
            .then(() => {
                const originalText = copyTextBtn.innerHTML;
                copyTextBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyTextBtn.innerHTML = originalText;
                }, 2000);
            });
    });
}

// Image Generator Functionality
if (document.getElementById('image-prompt')) {
    const imagePrompt = document.getElementById('image-prompt');
    const imageOutput = document.getElementById('image-output');
    const generateImageBtn = document.getElementById('generate-image');
    const clearImageBtn = document.getElementById('clear-image');
    const downloadImageBtn = document.getElementById('download-image');
    const imageModel = document.getElementById('image-model');
    const imageStyle = document.getElementById('image-style');
    const imageQuality = document.getElementById('image-quality');
    const modelStatus = document.getElementById('model-status');
    const creditsRemaining = document.getElementById('credits-remaining');

    generateImageBtn.addEventListener('click', async () => {
        if (!imagePrompt.value.trim()) {
            alert('Please enter a prompt');
            return;
        }

        imageOutput.innerHTML = '<div class="loading-animation"></div>';
        generateImageBtn.disabled = true;
        modelStatus.textContent = 'Generating...';
        
        try {
            const response = await generateImage(
                imagePrompt.value, 
                imageModel.value,
                {
                    style: imageStyle.value,
                    quality: imageQuality.value
                }
            );
            
            imageOutput.innerHTML = `<img src="${response.url}" alt="Generated Image" class="generated-image">`;
            
            // Update credits (mock for now)
            const credits = Math.floor(Math.random() * 90) + 10;
            creditsRemaining.textContent = `${credits} credits`;
            modelStatus.textContent = 'Ready';
            
            // Enable download button
            downloadImageBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = response.url;
                link.download = `wayne-ai-image-${Date.now()}.jpg`;
                link.click();
            };
        } catch (error) {
            imageOutput.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            modelStatus.textContent = 'Error';
        } finally {
            generateImageBtn.disabled = false;
        }
    });

    clearImageBtn.addEventListener('click', () => {
        imagePrompt.value = '';
        imageOutput.innerHTML = `
            <div class="image-placeholder">
                <i class="fas fa-image"></i>
                <p>Your generated image will appear here</p>
            </div>
        `;
    });
}

// Code Generator Functionality
if (document.getElementById('code-prompt')) {
    const codePrompt = document.getElementById('code-prompt');
    const codeOutput = document.getElementById('code-output');
    const generateCodeBtn = document.getElementById('generate-code');
    const clearCodeBtn = document.getElementById('clear-code');
    const copyCodeBtn = document.getElementById('copy-code');
    const downloadCodeBtn = document.getElementById('download-code');
    const codeModel = document.getElementById('code-model');
    const codeLanguage = document.getElementById('code-language');
    const codeFramework = document.getElementById('code-framework');
    const modelStatus = document.getElementById('model-status');
    const tokenCount = document.getElementById('token-count');

    generateCodeBtn.addEventListener('click', async () => {
        if (!codePrompt.value.trim()) {
            alert('Please enter a prompt');
            return;
        }

        codeOutput.innerHTML = '<div class="loading-animation"></div>';
        generateCodeBtn.disabled = true;
        modelStatus.textContent = 'Generating...';
        
        try {
            const response = await generateCode(
                codePrompt.value, 
                codeModel.value,
                {
                    language: codeLanguage.value,
                    framework: codeFramework.value
                }
            );
            
            codeOutput.innerHTML = `<code class="language-${codeLanguage.value}">${response}</code>`;
            Prism.highlightElement(codeOutput.querySelector('code'));
            
            // Update token count (mock for now)
            const tokens = Math.floor(codePrompt.value.length / 4) + Math.floor(response.length / 4);
            tokenCount.textContent = `${tokens} tokens`;
            modelStatus.textContent = 'Ready';
        } catch (error) {
            codeOutput.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            modelStatus.textContent = 'Error';
        } finally {
            generateCodeBtn.disabled = false;
        }
    });

    clearCodeBtn.addEventListener('click', () => {
        codePrompt.value = '';
        codeOutput.innerHTML = `<code class="language-javascript">// Your generated code will appear here</code>`;
        tokenCount.textContent = '0 tokens';
    });

    copyCodeBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeOutput.textContent)
            .then(() => {
                const originalText = copyCodeBtn.innerHTML;
                copyCodeBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyCodeBtn.innerHTML = originalText;
                }, 2000);
            });
    });

    downloadCodeBtn.addEventListener('click', () => {
        const blob = new Blob([codeOutput.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wayne-ai-code-${Date.now()}.${codeLanguage.value}`;
        link.click();
        URL.revokeObjectURL(url);
    });
}

// API Functions (to be implemented in api.js)
async function generateText(prompt, model) {
    // This will be implemented in api.js
    return "This is a simulated text response from the AI. In the actual implementation, this will call the real API.\n\nHere's a more detailed response based on your prompt. The AI can generate creative content, answer questions, summarize text, and much more. The quality and length of the response will depend on the model you selected and the complexity of your prompt.";
}

async function generateImage(prompt, model, options) {
    // This will be implemented in api.js
    return {
        url: "https://via.placeholder.com/512x512.png?text=Generated+Image+Placeholder",
        model: model,
        options: options
    };
}

async function generateCode(prompt, model, options) {
    // This will be implemented in api.js
    return `// Sample generated code in ${options.language}
function ${options.framework !== 'none' ? options.framework.toLowerCase() + 'Example' : 'example'}() {
    // This is a simulated code response
    console.log("Hello, World!");
    
    // The actual implementation would generate proper code
    // based on the language and framework selected
    return "Code generation complete";
}`;
      }
