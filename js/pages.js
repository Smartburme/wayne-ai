import aiService from './api.js';
import { ENV } from './env.js';

class ContentGenerator {
    constructor(type) {
        this.type = type;
        this.initElements();
        this.setupEventListeners();
    }

    initElements() {
        this.inputElement = document.getElementById(`${this.type}-prompt`);
        this.generateButton = document.getElementById(`generate-${this.type}-btn`);
        this.outputElement = document.getElementById(`${this.type}-output`);
        
        // Special elements for specific types
        if (this.type === 'image') {
            this.styleSelect = document.getElementById('image-style');
            this.sizeSelect = document.getElementById('image-size');
        } else if (this.type === 'code') {
            this.languageSelect = document.getElementById('language-select');
            this.copyButton = document.querySelector('.copy-code-btn');
            this.explainButton = document.querySelector('.explain-code-btn');
        }
    }

    setupEventListeners() {
        this.generateButton.addEventListener('click', () => this.generate());
        
        if (this.type === 'code') {
            this.copyButton.addEventListener('click', () => this.copyCode());
            this.explainButton.addEventListener('click', () => this.explainCode());
        }
    }

    async generate() {
        const prompt = this.inputElement.value.trim();
        if (!prompt) return;

        this.setLoadingState(true);
        
        try {
            const options = {};
            
            // Type-specific options
            if (this.type === 'image') {
                options.style = this.styleSelect.value;
                options.size = this.sizeSelect.value;
            } else if (this.type === 'code') {
                options.language = this.languageSelect.value;
            }
            
            const response = await aiService.generateContent(prompt, this.type, options);
            this.displayOutput(response);
        } catch (error) {
            this.displayError(error);
        } finally {
            this.setLoadingState(false);
        }
    }

    displayOutput(response) {
        switch (this.type) {
            case 'text':
                this.outputElement.innerHTML = `<div class="text-output">${response.text}</div>`;
                break;
            case 'image':
                this.outputElement.innerHTML = `
                    <img src="${response.url}" alt="Generated image from prompt" class="generated-image">
                    <div class="image-actions">
                        <button class="download-btn">Download</button>
                        <button class="variation-btn">Create Variation</button>
                    </div>
                `;
                break;
            case 'code':
                this.outputElement.innerHTML = `<pre><code>${response.code}</code></pre>`;
                Prism.highlightAll(); // Assuming Prism.js is loaded for syntax highlighting
                break;
        }
    }

    displayError(error) {
        this.outputElement.innerHTML = `
            <div class="error-message">
                <p>Error: ${error.message}</p>
                <button class="retry-btn">Try Again</button>
            </div>
        `;
        
        document.querySelector('.retry-btn').addEventListener('click', () => this.generate());
    }

    setLoadingState(isLoading) {
        this.generateButton.disabled = isLoading;
        this.generateButton.innerHTML = isLoading ? 
            '<span class="spinner"></span> Generating...' : 
            `<img src="../assets/images/gen-icon.png" alt="Generate"> <span>Generate ${this.type.charAt(0).toUpperCase() + this.type.slice(1)}</span>`;
    }

    copyCode() {
        const code = this.outputElement.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = this.copyButton.textContent;
            this.copyButton.textContent = 'Copied!';
            setTimeout(() => {
                this.copyButton.textContent = originalText;
            }, 2000);
        });
    }

    async explainCode() {
        const code = this.outputElement.querySelector('code').textContent;
        this.inputElement.value = `Explain this ${this.languageSelect.value} code:\n\n${code}`;
        await this.generate();
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('text-gen.html')) {
        new ContentGenerator('text');
    } else if (path.includes('image-gen.html')) {
        new ContentGenerator('image');
    } else if (path.includes('code-gen.html')) {
        new ContentGenerator('code');
    }
    
    // Apply theme
    document.body.classList.add(`${ENV.THEME}-theme`);
});
