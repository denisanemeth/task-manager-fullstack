const THEME_STORAGE_KEY = 'taskManagerTheme';
const CONTROL_COUNTER_KEY = 'taskManagerControlCounts';

function loadThemeSettings() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    try {
        return saved ? JSON.parse(saved) : { background: '#f0f2f5', text: '#333333' };
    } catch (err) {
        return { background: '#f0f2f5', text: '#333333' };
    }
}

function applyThemeSettings(theme) {
    const root = document.documentElement;
    root.style.setProperty('--app-bg', theme.background || '#f0f2f5');
    root.style.setProperty('--app-text', theme.text || '#333333');
    root.style.setProperty('--card-bg', theme.cardBackground || '#ffffff');
    root.style.setProperty('--primary-color', theme.primary || '#3498db');
}

function saveThemeSettings(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    applyThemeSettings(theme);
}

function initThemeFromStorage() {
    applyThemeSettings(loadThemeSettings());
}

function getControlCounts() {
    try {
        return JSON.parse(localStorage.getItem(CONTROL_COUNTER_KEY) || '{}');
    } catch (err) {
        return {};
    }
}

function incrementControlCount(controlId) {
    if (!controlId) return;
    const counts = getControlCounts();
    counts[controlId] = (counts[controlId] || 0) + 1;
    localStorage.setItem(CONTROL_COUNTER_KEY, JSON.stringify(counts));
}

function attachControlTracking(controlIds) {
    controlIds.forEach(id => {
        const element = document.getElementById(id);
        if (!element) return;
        const track = () => incrementControlCount(id);
        element.addEventListener('focus', track);
        element.addEventListener('click', track);
    });
}

function reorderFormFields(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const groups = Array.from(container.querySelectorAll('.form-group, .task-title, .task-description, .task-status, .task-dueDate'));
    const counts = getControlCounts();
    groups.sort((a, b) => {
        const aId = a.querySelector('input, select')?.id || '';
        const bId = b.querySelector('input, select')?.id || '';
        return (counts[bId] || 0) - (counts[aId] || 0);
    });
    groups.forEach(group => container.appendChild(group));
}

function reorderTaskFormFields() {
    reorderFormFields('.task-form');
}

function resetControlCounters() {
    localStorage.removeItem(CONTROL_COUNTER_KEY);
    const list = document.getElementById('counterList');
    if (list) {
        list.textContent = 'Contorizările au fost resetate.';
    }
}

function renderControlUsage(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const counts = getControlCounts();
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
        container.innerHTML = '<p>Nu există încă accesări contorizate.</p>';
        return;
    }
    const list = document.createElement('ul');
    list.className = 'counter-list';
    entries.forEach(([id, count]) => {
        const item = document.createElement('li');
        item.textContent = `${id}: ${count} accesări`;
        list.appendChild(item);
    });
    container.innerHTML = '';
    container.appendChild(list);
}

window.initThemeFromStorage = initThemeFromStorage;
window.loadThemeSettings = loadThemeSettings;
window.saveThemeSettings = saveThemeSettings;
window.attachControlTracking = attachControlTracking;
window.reorderFormFields = reorderFormFields;
window.reorderTaskFormFields = reorderTaskFormFields;
window.resetControlCounters = resetControlCounters;
window.renderControlUsage = renderControlUsage;
