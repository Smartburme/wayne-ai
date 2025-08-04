// Code Generation Logic
document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generateCodeButton');
    const explainButton = document.getElementById('explainCodeButton');
    const codePrompt = document.getElementById('codePrompt');
    const codeLanguage = document.getElementById('codeLanguage');
    const codeOutput = document.getElementById('codeOutput');
    const codeExplanation = document.getElementById('codeExplanation');
    
    if (generateButton) {
        generateButton.addEventListener('click', generateCode);
    }
    
    if (explainButton) {
        explainButton.addEventListener('click', explainCode);
    }
    
    async function generateCode() {
        const prompt = codePrompt.value.trim();
        const language = codeLanguage.value;
        
        if (!prompt) {
            alert('Please enter a code description');
            return;
        }
        
        try {
            generateButton.disabled = true;
            generateButton.textContent = 'Generating...';
            
            // In a real implementation, this would call the Gemini API
            // const generatedCode = await gemini.generateCode(prompt, language);
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulated response
            const generatedCode = `// ${prompt}\nfunction ${prompt.toLowerCase().replace(/\s+/g, '_')}() {\n  // Implementation goes here\n  return "Hello, World!";\n}`;
            
            // Display the code
            codeOutput.textContent = generatedCode;
            
            // Save to history
            saveCodeToHistory(prompt, generatedCode, language, null);
            
        } catch (error) {
            console.error('Error generating code:', error);
            alert('Failed to generate code. Please try again.');
        } finally {
            generateButton.disabled = false;
            generateButton.textContent = 'Generate';
        }
    }
    
    async function explainCode() {
        const code = codeOutput.textContent.trim();
        
        if (!code) {
            alert('Please generate some code first');
            return;
        }
        
        try {
            explainButton.disabled = true;
            explainButton.textContent = 'Explaining...';
            
            // In a real implementation, this would call the Gemini API
            // const explanation = await gemini.chat(`Explain this ${codeLanguage.value} code:\n${code}`);
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulated response
            const explanation = "This code appears to be a function that returns 'Hello, World!'. It takes the prompt you provided and converts it to a function name by replacing spaces with underscores and making it lowercase.";
            
            // Display the explanation
            codeExplanation.textContent = explanation;
            
            // Save to history
            const prompt = codePrompt.value.trim();
            const language = codeLanguage.value;
            saveCodeToHistory(prompt, code, language, explanation);
            
        } catch (error) {
            console.error('Error explaining code:', error);
            alert('Failed to explain code. Please try again.');
        } finally {
            explainButton.disabled = false;
            explainButton.textContent = 'Explain';
        }
    }
    
    function saveCodeToHistory(prompt, code, language, explanation) {
        const historyItem = {
            prompt,
            code,
            language,
            explanation,
            timestamp: new Date().toISOString()
        };
        
        // Get existing history
        let history = loadFromLocalStorage('codeHistory') || [];
        
        // Add new item
        history.unshift(historyItem);
        
        // Save (limit to 50 items)
        saveToLocalStorage('codeHistory', history.slice(0, 50));
        
        // Update history display
        updateCodeHistoryDisplay();
    }
    
    function updateCodeHistoryDisplay() {
        const historyList = document.getElementById('codeHistoryList');
        if (!historyList) return;
        
        const history = loadFromLocalStorage('codeHistory') || [];
        
        historyList.innerHTML = '';
        
        history.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('history-item');
            itemElement.innerHTML = `
                <p><strong>${item.prompt.substring(0, 50)}${item.prompt.length > 50 ? '...' : ''}</strong></p>
                <small>${item.language} • ${new Date(item.timestamp).toLocaleString()}</small>
            `;
            
            itemElement.addEventListener('click', () => {
                // When clicked, show this code in the main area
                codeOutput.textContent = item.code;
                codeExplanation.textContent = item.explanation || '';
                
                // Update the inputs
                codePrompt.value = item.prompt;
                codeLanguage.value = item.language;
            });
            
            historyList.appendChild(itemElement);
        });
    }
    
    // Load history on page load
    updateCodeHistoryDisplay();
});
