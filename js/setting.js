document.addEventListener('DOMContentLoaded', function() {
    const apiKeyForm = document.getElementById('apiKeyForm');
    const themeToggle = document.getElementById('themeToggle');
    const clearDataBtn = document.getElementById('clearDataBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    
    // Load saved settings
    loadSettings();
    
    // Event Listeners
    apiKeyForm.addEventListener('submit', saveSettings);
    themeToggle.addEventListener('change', toggleTheme);
    clearDataBtn.addEventListener('click', clearAppData);
    exportDataBtn.addEventListener('click', exportAppData);
    saveBtn.addEventListener('click', saveSettings);
    
    // Functions
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('wayneAISettings')) || {};
        
        // Set form values
        document.getElementById('geminiKey').value = settings.geminiKey || '';
        document.getElementById('openaiKey').value = settings.openaiKey || '';
        document.getElementById('defaultModel').value = settings.defaultModel || 'gemini';
        themeToggle.checked = settings.theme === 'dark';
        
        // Apply theme
        applyTheme(settings.theme || 'light');
    }
    
    function saveSettings(e) {
        if (e) e.preventDefault();
        
        const settings = {
            geminiKey: document.getElementById('geminiKey').value.trim(),
            openaiKey: document.getElementById('openaiKey').value.trim(),
            defaultModel: document.getElementById('defaultModel').value,
            theme: themeToggle.checked ? 'dark' : 'light'
        };
        
        localStorage.setItem('wayneAISettings', JSON.stringify(settings));
        
        // Update WayneAI configuration
        if (typeof WayneAI !== 'undefined') {
            WayneAI.currentModel = settings.defaultModel;
        }
        
        // Show confirmation
        showToast('Settings saved successfully!');
    }
    
    function toggleTheme() {
        const theme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(theme);
    }
    
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    function clearAppData() {
        if (confirm('Are you sure you want to clear ALL app data? This cannot be undone.')) {
            localStorage.removeItem('wayneAIChats');
            localStorage.removeItem('wayneAIGenerations');
            showToast('All app data has been cleared');
        }
    }
    
    async function exportAppData() {
        const chats = JSON.parse(localStorage.getItem('wayneAIChats')) || [];
        const generations = JSON.parse(localStorage.getItem('wayneAIGenerations')) || [];
        const settings = JSON.parse(localStorage.getItem('wayneAISettings')) || {};
        
        const data = {
            meta: {
                exportedAt: new Date().toISOString(),
                version: '1.0'
            },
            settings,
            chats,
            generations
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `wayne-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }, 100);
    }
});
