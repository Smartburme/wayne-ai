// Enhanced Code Generation with Multi-API Support
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateCodeButton');
    const explainBtn = document.getElementById('explainCodeButton');
    const promptInput = document.getElementById('codePrompt');
    const languageSelect = document.getElementById('codeLanguage');
    const codeOutput = document.getElementById('codeOutput');
    const explanationOutput = document.getElementById('codeExplanation');
    const historyList = document.getElementById('codeHistoryList');
    const modelSelector = document.getElementById('codeModelSelector');

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

    // Generate code
    async function generateCode() {
        const prompt = promptInput.value.trim();
        const language = languageSelect.value;
        
        if (!prompt) {
            alert('Please enter a code description');
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
            codeOutput.textContent = '// Generating code...';

            // Generate code
            const code = await ai.generateCode(prompt, language, {
                model: selectedModel.dataset.model === 'openai' ? 'gpt-4' : undefined,
                temperature: 0.2
            });

            // Display result
            codeOutput.textContent = code;
            explanationOutput.textContent = '';

            // Save to history
            saveToHistory({
                prompt,
                language,
                code,
                explanation: '',
                model: selectedModel.dataset.model,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Code generation failed:', error);
            codeOutput.textContent = `// Error: ${error.message}`;
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Code';
        }
    }

    // Explain code
    async function explainCode() {
        const code = codeOutput.textContent.trim();
        const language = languageSelect.value;
        
        if (!code || code.startsWith('//')) {
            alert('Please generate some code first');
            return;
        }

        const selectedModel = document.querySelector('.model-option.active');
        if (!selectedModel) {
            alert('No AI model selected');
            return;
        }

        try {
            // Update UI
            explainBtn.disabled = true;
            explainBtn.innerHTML = '<div class="loading-spinner"></div> Explaining...';
            explanationOutput.textContent = 'Generating explanation...';

            // Get explanation
            const explanation = await ai.explainCode(code, language, {
                model: selectedModel.dataset.model === 'openai' ? 'gpt-4' : undefined,
                temperature: 0.3
            });

            // Display explanation
            explanationOutput.textContent = explanation;

            // Update history
            updateHistoryWithExplanation(code, explanation);

        } catch (error) {
            console.error('Code explanation failed:', error);
            explanationOutput.textContent = `Error: ${error.message}`;
        } finally {
            explainBtn.disabled = false;
            explainBtn.textContent = 'Explain Code';
        }
    }

    // Save to history
    function saveToHistory(item) {
        let history = JSON.parse(localStorage.getItem('wayne-ai_codeHistory') || '[]');
        history.unshift(item);
        localStorage.setItem('wayne-ai_codeHistory', JSON.stringify(history.slice(0, 50)));
        updateHistoryDisplay();
    }

    // Update history with explanation
    function updateHistoryWithExplanation(code, explanation) {
        let history = JSON.parse(localStorage.getItem('wayne-ai_codeHistory') || '[]');
        const index = history.findIndex(item => item.code === code);
        if (index !== -1) {
            history[index].explanation = explanation;
            localStorage.setItem('wayne-ai_codeHistory', JSON.stringify(history));
            updateHistoryDisplay();
        }
    }

    // Update history display
    function updateHistoryDisplay() {
        const history = JSON.parse(localStorage.getItem('wayne-ai_codeHistory') || '[]');
        historyList.innerHTML = '';
        
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="details">
                    <p><strong>${item.language}</strong>: ${item.prompt.substring(0, 50)}${item.prompt.length > 50 ? '...' : ''}</p>
                    <small>${item.model} • ${new Date(item.timestamp).toLocaleString()}</small>
                </div>
                <button class="delete" data-index="${index}">×</button>
            `;
            
            historyItem.addEventListener('click', () => {
                codeOutput.textContent = item.code;
                explanationOutput.textContent = item.explanation || '';
                promptInput.value = item.prompt;
                languageSelect.value = item.language;
                
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
        let history = JSON.parse(localStorage.getItem('wayne-ai_codeHistory') || '[]');
        history.splice(index, 1);
        localStorage.setItem('wayne-ai_codeHistory', JSON.stringify(history));
        updateHistoryDisplay();
    }

    // Initialize
    initModelSelector();
    updateHistoryDisplay();
    generateBtn.addEventListener('click', generateCode);
    explainBtn.addEventListener('click', explainCode);
});
