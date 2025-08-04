document.addEventListener('DOMContentLoaded', function() {
    // Text Generation
    const textPrompt = document.getElementById('textPrompt');
    const generateTextBtn = document.getElementById('generateTextBtn');
    const clearTextBtn = document.getElementById('clearTextBtn');
    const downloadTextBtn = document.getElementById('downloadTextBtn');
    const textResult = document.getElementById('textResult');
    
    if (generateTextBtn) {
        generateTextBtn.addEventListener('click', generateText);
        clearTextBtn.addEventListener('click', clearText);
        downloadTextBtn.addEventListener('click', downloadText);
    }
    
    // Image Generation
    const imagePrompt = document.getElementById('imagePrompt');
    const generateImageBtn = document.getElementById('generateImageBtn');
    const clearImageBtn = document.getElementById('clearImageBtn');
    const downloadImageBtn = document.getElementById('downloadImageBtn');
    const imageResult = document.getElementById('imageResult');
    
    if (generateImageBtn) {
        generateImageBtn.addEventListener('click', generateImage);
        clearImageBtn.addEventListener('click', clearImage);
        downloadImageBtn.addEventListener('click', downloadImage);
    }
    
    // Code Generation
    const codePrompt = document.getElementById('codePrompt');
    const generateCodeBtn = document.getElementById('generateCodeBtn');
    const clearCodeBtn = document.getElementById('clearCodeBtn');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const generatedCode = document.getElementById('generatedCode');
    const languageSelect = document.getElementById('languageSelect');
    
    if (generateCodeBtn) {
        generateCodeBtn.addEventListener('click', generateCode);
        clearCodeBtn.addEventListener('click', clearCode);
        copyCodeBtn.addEventListener('click', copyCode);
        languageSelect.addEventListener('change', updateCodeLanguage);
    }
    
    // Functions
    function generateText() {
        const prompt = textPrompt.value.trim();
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }
        
        textResult.innerHTML = '<p class="loading">Generating text... <div class="spinner"></div></p>';
        
        // Simulate API call
        setTimeout(() => {
            textResult.innerHTML = `
                <h3>Generated Text</h3>
                <p>${prompt.repeat(3)} This is a simulated response based on your prompt: "${prompt}". In a real implementation, this would come from the AI API.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
            `;
        }, 1500);
    }
    
    function clearText() {
        textPrompt.value = '';
        textResult.innerHTML = '';
    }
    
    function downloadText() {
        if (!textResult.textContent.trim()) {
            alert('No text to download');
            return;
        }
        
        const blob = new Blob([textResult.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wayne-ai-generated-text.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    function generateImage() {
        const prompt = imagePrompt.value.trim();
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }
        
        imageResult.innerHTML = '<p class="loading">Generating image... <div class="spinner"></div></p>';
        
        // Simulate API call
        setTimeout(() => {
            imageResult.innerHTML = `
                <h3>Generated Images</h3>
                <div class="image-grid">
                    <div class="image-placeholder" style="background-color: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                        <p>Image based on: "${prompt}"</p>
                    </div>
                    <div class="image-placeholder" style="background-color: #e0e0e0; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                        <p>Alternative version</p>
                    </div>
                </div>
            `;
        }, 2000);
    }
    
    function clearImage() {
        imagePrompt.value = '';
        imageResult.innerHTML = '<p class="placeholder-text">Your generated images will appear here</p>';
    }
    
    function downloadImage() {
        alert('In a real implementation, this would download the generated image');
    }
    
    function generateCode() {
        const prompt = codePrompt.value.trim();
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }
        
        const language = languageSelect.value;
        generatedCode.className = `language-${language}`;
        generatedCode.textContent = `// Generating ${language} code...`;
        
        // Simulate API call
        setTimeout(() => {
            const sampleCode = getSampleCode(language, prompt);
            generatedCode.textContent = sampleCode;
            hljs.highlightElement(generatedCode);
        }, 1500);
    }
    
    function clearCode() {
        codePrompt.value = '';
        generatedCode.textContent = '// Your generated code will appear here';
    }
    
    function copyCode() {
        navigator.clipboard.writeText(generatedCode.textContent)
            .then(() => alert('Code copied to clipboard!'))
            .catch(err => console.error('Failed to copy: ', err));
    }
    
    function updateCodeLanguage() {
        generatedCode.className = `language-${languageSelect.value}`;
    }
    
    function getSampleCode(language, prompt) {
        const samples = {
            python: `# ${prompt}\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`,
            javascript: `// ${prompt}\nfunction main() {\n  console.log("Hello, World!");\n}\n\nmain();`,
            html: `<!-- ${prompt} -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Sample</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>`,
            css: `/* ${prompt} */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n}`
        };
        
        return samples[language] || `// No sample available for ${language}`;
    }
});
