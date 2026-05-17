// app.js - Hauptanwendung mit Navigation

import { HomePage } from './home.js';
import { EditorPage } from './editor-page.js';

class EasyCoderApp {
    constructor() {
        this.currentPage = 'home';
        this.currentProjectId = null;
        
        this.homePage = new HomePage((page, id) => this.navigate(page, id));
        
        this.init();
    }

    init() {
        // Setze SEO Meta-Tags
        this.updateMetaTags();
        
        // Lade die Home-Seite
        this.navigate('home');
        
        // Vermeide Reload auf bestimmte Tastenkombinationen
        document.addEventListener('keydown', (e) => {
            // Verhindere Ctrl+W wenn Projekte geöffnet sind
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                if (this.currentPage === 'editor') {
                    e.preventDefault();
                }
            }
        });
    }

    navigate(page, projectId = null) {
        console.log(`Navigating to: ${page}${projectId ? ` (ID: ${projectId})` : ''}`);
        
        this.currentPage = page;
        this.currentProjectId = projectId;
        
        if (page === 'home') {
            this.homePage.render();
        } else if (page === 'editor' && projectId) {
            const editorPage = new EditorPage(projectId, (p, id) => this.navigate(p, id));
            editorPage.render();
        }
        
        // Update Browser History
        window.history.replaceState(
            { page, projectId },
            document.title,
            window.location.pathname
        );
    }

    updateMetaTags() {
        // Diese Funktion könnte dynamische Titel je nach Seite setzen
        // Für jetzt sind die Meta-Tags in der HTML-Datei definiert
    }
}

// Starte die Anwendung wenn DOM bereit ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new EasyCoderApp();
    });
} else {
    new EasyCoderApp();
}
