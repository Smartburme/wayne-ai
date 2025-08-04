// Image Generation Logic
document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generateImageButton');
    const imagePrompt = document.getElementById('imagePrompt');
    const imageStyle = document.getElementById('imageStyle');
    const imageOutput = document.getElementById('imageOutput');
    
    if (generateButton) {
        generateButton.addEventListener('click', generateImage);
    }
    
    async function generateImage() {
        const prompt = imagePrompt.value.trim();
        const style = imageStyle.value;
        
        if (!prompt) {
            alert('Please enter an image description');
            return;
        }
        
        const fullPrompt = `${prompt} (${style} style)`;
        
        try {
            generateButton.disabled = true;
            generateButton.textContent = 'Generating...';
            
            // In a real implementation, this would call the Gemini API
            // const imageUrl = await gemini.generateImage(fullPrompt);
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulated response
            const imageUrl = `https://placehold.co/600x400/2A2A2A/FFFFFF?text=${encodeURIComponent(prompt)}`;
            
            // Display the image
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = prompt;
            img.classList.add('generated-image');
            
            imageOutput.prepend(img);
            
            // Save to history
            saveImageToHistory(prompt, imageUrl, style);
            
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            generateButton.disabled = false;
            generateButton.textContent = 'Generate';
        }
    }
    
    function saveImageToHistory(prompt, imageUrl, style) {
        const historyItem = {
            prompt,
            imageUrl,
            style,
            timestamp: new Date().toISOString()
        };
        
        // Get existing history
        let history = loadFromLocalStorage('imageHistory') || [];
        
        // Add new item
        history.unshift(historyItem);
        
        // Save (limit to 50 items)
        saveToLocalStorage('imageHistory', history.slice(0, 50));
        
        // Update history display
        updateImageHistoryDisplay();
    }
    
    function updateImageHistoryDisplay() {
        const historyList = document.getElementById('imageHistoryList');
        if (!historyList) return;
        
        const history = loadFromLocalStorage('imageHistory') || [];
        
        historyList.innerHTML = '';
        
        history.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('history-item');
            itemElement.innerHTML = `
                <p><strong>${item.prompt.substring(0, 50)}${item.prompt.length > 50 ? '...' : ''}</strong></p>
                <small>${new Date(item.timestamp).toLocaleString()}</small>
            `;
            
            itemElement.addEventListener('click', () => {
                // When clicked, show this image in the main area
                imageOutput.innerHTML = '';
                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.alt = item.prompt;
                img.classList.add('generated-image');
                imageOutput.appendChild(img);
                
                // Update the prompt input
                imagePrompt.value = item.prompt;
                imageStyle.value = item.style;
            });
            
            historyList.appendChild(itemElement);
        });
    }
    
    // Load history on page load
    updateImageHistoryDisplay();
});
