document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-settings');
    const resetButton = document.getElementById('reset-settings');
    
    // Load saved settings
    loadSettings();
    
    // Save settings
    saveButton.addEventListener('click', () => {
        const settings = {
            openaiKey: document.getElementById('openai-key').value,
            geminiKey: document.getElementById('gemini-key').value,
            stabilityKey: document.getElementById('stability-key').value,
            defaultModel: document.getElementById('default-model').value,
            darkMode: document.getElementById('dark-mode').checked
        };
        
        localStorage.setItem('wayneAISettings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    });
    
    // Reset settings
    resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            localStorage.removeItem('wayneAISettings');
            loadSettings();
            alert('Settings reset to defaults.');
        }
    });
});

function loadSettings() {
    const defaultSettings = {
        openaiKey: '',
        geminiKey: '',
        stabilityKey: '',
        defaultModel: 'gpt-4',
        darkMode: true
    };
    
    const savedSettings = JSON.parse(localStorage.getItem('wayneAISettings')) || defaultSettings;
    
    document.getElementById('openai-key').value = savedSettings.openaiKey;
    document.getElementById('gemini-key').value = savedSettings.geminiKey;
    document.getElementById('stability-key').value = savedSettings.stabilityKey;
    document.getElementById('default-model').value = savedSettings.defaultModel;
    document.getElementById('dark-mode').checked = savedSettings.darkMode;
}
