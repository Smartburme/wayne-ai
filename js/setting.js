document.addEventListener('DOMContentLoaded', function() {
    const geminiKeyInput = document.getElementById('geminiKey');
    const openaiKeyInput = document.getElementById('openaiKey');
    const themeSelect = document.getElementById('themeSelect');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    
    // Load saved settings
    loadSettings();
    
    // Event listeners
    saveSettingsBtn.addEventListener('click', saveSettings);
    clearHistoryBtn.addEventListener('click', clearHistory);
    exportDataBtn.addEventListener('click', exportData);
    
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('wayneAISettings')) || {};
        
        if (settings.geminiKey) {
            geminiKeyInput.value = settings.geminiKey;
        }
        
        if (settings.openaiKey) {
            openaiKeyInput.value = settings.openaiKey;
        }
        
        if (settings.theme) {
            themeSelect.value = settings.theme;
            applyTheme(settings.theme);
        }
    }
    
    function saveSettings() {
        const settings = {
            geminiKey: geminiKeyInput.value,
            openaiKey: openaiKeyInput.value,
            theme: themeSelect.value
        };
        
        localStorage.setItem('wayneAISettings', JSON.stringify(settings));
        applyTheme(themeSelect.value);
        
        // Initialize API with new keys
        if (typeof WayneAI !== 'undefined') {
            WayneAI.init(settings.geminiKey, settings.openaiKey);
        }
        
        alert('Settings saved successfully!');
    }
    
    function applyTheme(theme) {
        document.body.className = theme;
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
            localStorage.removeItem('wayneAIChatHistory');
            alert('Chat history cleared!');
        }
    }
    
    function exportData() {
        const settings = JSON.parse(localStorage.getItem('wayneAISettings')) || {};
        const chatHistory = JSON.parse(localStorage.getItem('wayneAIChatHistory')) || [];
        
        const data = {
            settings: settings,
            chatHistory: chatHistory,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wayne-ai-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
});
