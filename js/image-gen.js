// Enhanced Image Generation with Model Selection
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateImageButton');
    const promptInput = document.getElementById('imagePrompt');
    const styleSelect = document.getElementById('imageStyle');
    const sizeSelect = document.getElementById('imageSize');
    const modelSelector = document.getElementById('modelSelector');
    const imageOutput = document.getElementById('imageOutput');
    const historyList = document.getElementById('imageHistoryList');
    
    // Initialize model selector
    function initModelSelector() {
        const status = ai.getApiStatus();
        
        if (status.stability.enabled) {
            modelSelector.innerHTML += `
                <div class="model-option" data-model="stability" data-engine="stable-diffusion-xl-1024-v1-0">
                    <div class="model-name">Stable Diffusion XL</div>
                    <div class="model-status">Stability AI</div>
                </div>
            `;
        }
        
        if (status.openai.enabled) {
            modelSelector.innerHTML += `
                <div class="model-option" data-model="openai" data-engine="dall-e-3">
                    <div class="model-name">DALL-E 3</div>
                    <div class="model-status">OpenAI</div>
                </div>
            `;
        }
        
        // Set first available model as active
        const firstModel = document.querySelector('.model-option');
        if (firstModel) {
            firstModel.classList.add('active');
        }
    }
    
    // Handle model selection
    modelSelector.addEventListener('click', function(e) {
        const modelOption = e.target.closest('.model-option');
        if (modelOption) {
            document.querySelectorAll('.model-option').forEach(opt => {
                opt.classList.remove('active');
            });
            modelOption.classList.add('active');
        }
    });
    
    // Generate image
    async function generateImage() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter an image description');
            return;
        }
        
        const style = styleSelect.value;
        const size = sizeSelect.value;
        const selectedModel = document.querySelector('.model-option.active');
        
        if (!selectedModel) {
            alert('No AI model selected');
            return;
        }
        
        const model = selectedModel.dataset.model;
        const engine = selectedModel.dataset.engine;
        
        try {
            // Update UI for generation
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<div class="loading-spinner"></div> Generating...';
            imageOutput.innerHTML = '<div class="loading-spinner"></div>';
            
            // Generate with selected model
            const options = {
                style,
                size,
                engine
            };
            
            const result = await ai.generateImage(prompt, options);
            
            // Display result
            const img = document.createElement('img');
            img.src = result.url;
            img.alt = prompt;
            img.className = 'generated-image';
            
            imageOutput.innerHTML = '';
            imageOutput.appendChild(img);
            
            // Save to history
            saveToHistory({
                prompt,
                imageUrl: result.url,
                style,
                size,
                model,
                engine,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Image generation failed:', error);
            imageOutput.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Image';
        }
    }
    
    // Save to history
    function saveToHistory(item) {
        let history = JSON.parse(localStorage.getItem('wayne-ai_imageHistory') || '[]');
        history.unshift(item);
        localStorage.setItem('wayne-ai_imageHistory', JSON.stringify(history.slice(0, 50)));
        updateHistoryDisplay();
    }
    
    // Update history display
    function updateHistoryDisplay() {
        const history = JSON.parse(localStorage.getItem('wayne-ai_imageHistory') || '[]');
        historyList.innerHTML = '';
        
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="preview">
                    <img src="${item.imageUrl}" alt="${item.prompt.substring(0, 30)}" loading="lazy">
                </div>
                <div class="details">
                    <p>${item.prompt.substring(0, 50)}${item.prompt.length > 50 ? '...' : ''}</p>
                    <small>${item.model} • ${new Date(item.timestamp).toLocaleString()}</small>
                </div>
                <button class="delete" data-index="${index}">×</button>
            `;
            
            historyItem.addEventListener('click', () => {
                imageOutput.innerHTML = `<img src="${item.imageUrl}" class="generated-image" alt="${item.prompt}">`;
                promptInput.value = item.prompt;
                styleSelect.value = item.style;
                sizeSelect.value = item.size;
            });
            
            historyList.appendChild(historyItem);
        });
        
        // Add delete handlers
        document.querySelectorAll('.history-item .delete').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteHistoryItem(parseInt(this.dataset.index));
            });
        });
    }
    
    // Delete history item
    function deleteHistoryItem(index) {
        let history = JSON.parse(localStorage.getItem('wayne-ai_imageHistory') || '[]');
        history.splice(index, 1);
        localStorage.setItem('wayne-ai_imageHistory', JSON.stringify(history));
        updateHistoryDisplay();
    }
    
    // Initialize
    initModelSelector();
    updateHistoryDisplay();
    generateBtn.addEventListener('click', generateImage);
});
