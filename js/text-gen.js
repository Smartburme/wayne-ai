// Enhanced Text Generation with Multi-API Support
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateTextButton');
    const promptInput = document.getElementById('textTopic');
    const typeSelect = document.getElementById('textType');
    const outputDiv = document.getElementById('textOutput');
    const historyList = document.getElementById('textHistoryList');
    const modelSelector = document.getElementById('textModelSelector');

    // Initialize model selector
    function initModelSelector() {
        const status = ai.getApiStatus();
        
        if (status.openai.enabled) {
            modelSelector.innerHTML += `
                <div class="model-option active" data-model="openai">
                    <div class="model-name">GPT-4</div>
                    <div class="model-status">OpenAI</div>
                </div>
            `;
        }
        
        if (status.gemini.enabled) {
            modelSelector.innerHTML += `
                <div class="model-option" data-model="gemini">
                    <div class="model-name">Gemini Pro</div>
                    <div class="model-status">Google</div>
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

    // Generate text
    async function generateText() {
        const prompt = promptInput.value.trim();
        const type = typeSelect.value;
        
        if (!prompt) {
            alert('Please enter a topic or prompt');
            return;
        }

        const selectedModel = document.querySelector('.model-option.active');
        if (!selectedModel) {
            alert('No AI model selected');
            return;
        }

        try {
            // Update UI
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<div class="loading-spinner"></div> Generating...';
            outputDiv.textContent = 'Generating content...';

            // Create enhanced prompt based on type
            let enhancedPrompt = prompt;
            switch(type) {
                case 'article':
                    enhancedPrompt = `Write a comprehensive article about: ${prompt}\n\nInclude:\n- An introduction\n- Key points\n- Supporting details\n- A conclusion`;
                    break;
                case 'summary':
                    enhancedPrompt = `Create a concise summary of: ${prompt}\n\nInclude only the most important information in bullet points`;
                    break;
                case 'story':
                    enhancedPrompt = `Write a creative story about: ${prompt}\n\nInclude:\n- Interesting characters\n- A clear plot\n- Dialogue\n- A satisfying ending`;
                    break;
                case 'poem':
                    enhancedPrompt = `Compose a poem about: ${prompt}\n\nUse creative language and vivid imagery`;
                    break;
                case 'email':
                    enhancedPrompt = `Write a professional email about: ${prompt}\n\nUse appropriate tone and structure`;
                    break;
            }

            // Generate text
            const text = await ai.generateText(enhancedPrompt, {
                model: selectedModel.dataset.model === 'openai' ? 'gpt-4' : undefined,
                temperature: type === 'summary' ? 0.3 : 0.7
            });

            // Display result
            outputDiv.innerHTML = formatTextOutput(text, type);

            // Save to history
            saveToHistory({
                prompt,
                type,
                text,
                model: selectedModel.dataset.model,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Text generation failed:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Text';
        }
    }

    // Format text output based on type
    function formatTextOutput(text, type) {
        if (type === 'summary' && text.includes('-')) {
            return text.split('\n').map(line => {
                if (line.trim().startsWith('-')) {
                    return `<p>• ${line.trim().substring(1).trim()}</p>`;
                }
                return `<p>${line}</p>`;
            }).join('');
        }
        return `<p>${text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
    }

    // Save to history
    function saveToHistory(item) {
        let history = JSON.parse(localStorage.getItem('wayne-ai_textHistory') || '[]');
        history.unshift(item);
        localStorage.setItem('wayne-ai_textHistory', JSON.stringify(history.slice(0, 50)));
        updateHistoryDisplay();
    }

    // Update history display
    function updateHistoryDisplay() {
        const history = JSON.parse(localStorage.getItem('wayne-ai_textHistory') || '[]');
        historyList.innerHTML = '';
        
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="details">
                    <p><strong>${item.type}</strong>: ${item.prompt.substring(0, 50)}${item.prompt.length > 50 ? '...' : ''}</p>
                    <small>${item.model} • ${new Date(item.timestamp).toLocaleString()}</small>
                </div>
                <button class="delete" data-index="${index}">×</button>
            `;
            
            historyItem.addEventListener('click', () => {
                outputDiv.innerHTML = formatTextOutput(item.text, item.type);
                promptInput.value = item.prompt;
                typeSelect.value = item.type;
                
                // Set the correct model
                document.querySelectorAll('.model-option').forEach(opt => {
                    opt.classList.remove('active');
                    if (opt.dataset.model === item.model) {
                        opt.classList.add('active');
                    }
                });
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
        let history = JSON.parse(localStorage.getItem('wayne-ai_textHistory') || '[]');
        history.splice(index, 1);
        localStorage.setItem('wayne-ai_textHistory', JSON.stringify(history));
        updateHistoryDisplay();
    }

    // Initialize
    initModelSelector();
    updateHistoryDisplay();
    generateBtn.addEventListener('click', generateText);
});
