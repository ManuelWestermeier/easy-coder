// utils.js - Hilfsfunktionen

/**
 * Erstellt einen iFrame-URL für die Preview mit HTML, CSS, und JS
 */
export function createPreviewUrl(html, css, js) {
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                ${css}
            </style>
        </head>
        <body>
            ${html}
            <script>
                ${js}
            </script>
        </body>
        </html>
    `;
    
    return 'data:text/html;charset=utf-8,' + encodeURIComponent(fullHtml);
}

/**
 * Formatiert ein Datum zu einem lesbaren Format
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

/**
 * Erstellt ein DOM-Element mit Attributen
 */
export function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') {
            element.className = value;
        } else if (key === 'style') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on')) {
            const eventName = key.substring(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (content) {
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (content instanceof Node) {
            element.appendChild(content);
        } else if (Array.isArray(content)) {
            content.forEach(c => {
                if (typeof c === 'string') {
                    element.innerHTML += c;
                } else if (c instanceof Node) {
                    element.appendChild(c);
                }
            });
        }
    }
    
    return element;
}

/**
 * Zeigt eine einfache Benachrichtigung
 */
export function showNotification(message, type = 'info') {
    const notification = createElement('div', {
        class: `notification notification-${type}`,
        style: {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: type === 'success' ? '#51CF66' : type === 'error' ? '#FF6B6B' : '#4ECDC4',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            zIndex: '9999',
            animation: 'fadeIn 0.3s ease-out',
            maxWidth: '300px',
            fontSize: '0.95rem'
        }
    }, message);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Exportiert Daten als JSON-Datei
 */
export function downloadJSON(data, filename) {
    const json = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = createElement('a', {
        href: url,
        download: filename
    });
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
}

/**
 * Kopiert Text in die Zwischenablage
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
        return true;
    } catch (error) {
        console.error('Copy failed:', error);
        showNotification('Copy failed', 'error');
        return false;
    }
}

/**
 * Debounce-Funktion
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Generiert einen HTML-String für die Projekt-Vorschau-Karte
 */
export function createProjectCardHTML(project) {
    const previewUrl = createPreviewUrl(project.html, project.css, project.js);
    
    return `
        <div class="project-card fade-in">
            <div class="project-preview">
                <iframe src="${previewUrl}"></iframe>
            </div>
            <div class="project-info">
                <div class="project-name">${escapeHtml(project.name)}</div>
                <div class="project-date">${formatDate(project.updatedAt)}</div>
                <div class="project-actions">
                    <button class="btn btn-small btn-success" data-action="edit" data-id="${project.id}">✎ Edit</button>
                    <button class="btn btn-small btn-danger" data-action="delete" data-id="${project.id}">🗑 Delete</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Escaped HTML-Zeichen
 */
export function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Generiert eine eindeutige ID
 */
export function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

/**
 * Öffnet einen Modal-Dialog
 */
export function openModal(title, content, buttons) {
    const overlay = createElement('div', { class: 'modal-overlay' });
    
    const modal = createElement('div', { class: 'modal' });
    
    const titleEl = createElement('h2', {}, title);
    modal.appendChild(titleEl);
    
    if (typeof content === 'string') {
        modal.innerHTML += content;
    } else if (content instanceof Node) {
        modal.appendChild(content);
    }
    
    if (buttons && buttons.length > 0) {
        const actionsDiv = createElement('div', { class: 'modal-actions' });
        
        buttons.forEach(btn => {
            const btnEl = createElement('button', {
                class: `btn ${btn.className || 'btn-secondary'}`,
            }, btn.text);
            
            btnEl.addEventListener('click', () => {
                if (btn.onClick) btn.onClick();
                overlay.remove();
            });
            
            actionsDiv.appendChild(btnEl);
        });
        
        modal.appendChild(actionsDiv);
    }
    
    overlay.appendChild(modal);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
    
    document.body.appendChild(overlay);
    
    return overlay;
}

/**
 * Validiert ein Projekt-Objekt
 */
export function validateProject(project) {
    const errors = [];
    
    if (!project.name || project.name.trim() === '') {
        errors.push('Project name is required');
    }
    
    if (project.name && project.name.length > 100) {
        errors.push('Project name must be less than 100 characters');
    }
    
    if (!project.html || typeof project.html !== 'string') {
        errors.push('HTML content is required');
    }
    
    if (!project.css || typeof project.css !== 'string') {
        errors.push('CSS content is required');
    }
    
    if (!project.js || typeof project.js !== 'string') {
        errors.push('JavaScript content is required');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}
