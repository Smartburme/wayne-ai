document.addEventListener('DOMContentLoaded', function() {
    const imagePrompt = document.getElementById('imagePrompt');
    const generateBtn = document.getElementById('generateImageBtn');
    const clearBtn = document.getElementById('clearImageBtn');
    const downloadBtn = document.getElementById('downloadImageBtn');
    const resultArea = document.getElementById('imageResult');
    const modelSelector = document.getElementById('modelSelect');
    
    // Initialize
    let currentImageUrl = null;
    
    // Event Listeners
    generateBtn.addEventListener('click', generateImage);
    clearBtn.addEventListener('click', clearImage);
    downloadBtn.addEventListener('click', downloadImage);
    
    // Functions
    async function generateImage() {
        const prompt = imagePrompt.value.trim();
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }
        
        // Show loading state
        resultArea.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Generating image... This may take 10-20 seconds</p>
            </div>
        `;
        
        try {
            const model = modelSelector.value;
            const imageUrl = await WayneAI.generateImage(prompt, model);
            
            if (imageUrl) {
                currentImageUrl = imageUrl;
                resultArea.innerHTML = `
                    <div class="image-container">
                        <img src="${imageUrl}" alt="Generated image from prompt: ${prompt}">
                        <div class="image-meta">
                            <p><strong>Prompt:</strong> ${prompt}</p>
                            <p><strong>Model:</strong> ${model.toUpperCase()}</p>
                        </div>
                    </div>
                `;
            } else {
                throw new Error('No image URL returned');
            }
        } catch (error) {
            console.error('Image generation error:', error);
            resultArea.innerHTML = `
                <div class="error-message">
                    <p>Failed to generate image: ${error.message}</p>
                    <p>Please try again or check your API key.</p>
                </div>
            `;
        }
    }
    
    function clearImage() {
        imagePrompt.value = '';
        resultArea.innerHTML = '<p class="placeholder">Your generated image will appear here</p>';
        currentImageUrl = null;
    }
    
    async function downloadImage() {
        if (!currentImageUrl) {
            alert('No image to download');
            return;
        }
        
        try {
            const response = await fetch(currentImageUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `wayne-ai-image-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download image');
        }
    }
});
