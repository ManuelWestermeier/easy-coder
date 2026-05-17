// Storage.js - Lokale Speicherverwaltung mit localStorage

class ProjectStorage {
    constructor() {
        this.storageKey = 'easyCoderProjects';
        this.initializeDefaults();
    }

    initializeDefaults() {
        const existing = this.getAllProjects();
        if (existing.length === 0) {
            // Erstelle Standard-Projekt
            const defaultProject = {
                id: Date.now(),
                name: 'Welcome',
                html: `<h1>👋 Welcome to easy-coder!</h1>
<p>Start coding HTML, CSS, and JavaScript here.</p>
<button id="btn">Click me!</button>`,
                css: `body {
    font-family: -apple-system, sans-serif;
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

button {
    background: white;
    color: #667eea;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}`,
                js: `document.getElementById('btn').addEventListener('click', () => {
    alert('Hello from easy-coder! 🎉');
});`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.saveProject(defaultProject);
        }
    }

    getAllProjects() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading projects:', error);
            return [];
        }
    }

    getProjectById(id) {
        const projects = this.getAllProjects();
        return projects.find(p => p.id == id);
    }

    saveProject(project) {
        const projects = this.getAllProjects();
        const existing = projects.findIndex(p => p.id == project.id);
        
        project.updatedAt = new Date().toISOString();
        
        if (existing !== -1) {
            projects[existing] = project;
        } else {
            projects.push(project);
        }
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
            return true;
        } catch (error) {
            console.error('Error saving project:', error);
            return false;
        }
    }

    deleteProject(id) {
        const projects = this.getAllProjects();
        const filtered = projects.filter(p => p.id != id);
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting project:', error);
            return false;
        }
    }

    searchProjects(query) {
        if (!query.trim()) return this.getAllProjects();
        
        const projects = this.getAllProjects();
        const lower = query.toLowerCase();
        
        return projects.filter(p => 
            p.name.toLowerCase().includes(lower) ||
            p.html.toLowerCase().includes(lower) ||
            p.css.toLowerCase().includes(lower) ||
            p.js.toLowerCase().includes(lower)
        );
    }

    duplicateProject(id) {
        const original = this.getProjectById(id);
        if (!original) return null;
        
        const duplicate = {
            ...original,
            id: Date.now(),
            name: `${original.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.saveProject(duplicate);
        return duplicate;
    }

    exportProject(id) {
        const project = this.getProjectById(id);
        if (!project) return null;
        
        return JSON.stringify(project, null, 2);
    }

    importProject(jsonString) {
        try {
            const project = JSON.parse(jsonString);
            if (!project.html || !project.css || !project.js || !project.name) {
                throw new Error('Invalid project format');
            }
            
            project.id = Date.now();
            project.createdAt = new Date().toISOString();
            project.updatedAt = new Date().toISOString();
            
            this.saveProject(project);
            return project;
        } catch (error) {
            console.error('Error importing project:', error);
            return null;
        }
    }

    clearAllProjects() {
        localStorage.removeItem(this.storageKey);
    }

    getStats() {
        const projects = this.getAllProjects();
        return {
            total: projects.length,
            lastModified: projects.length > 0 
                ? new Date(Math.max(...projects.map(p => new Date(p.updatedAt))))
                : null
        };
    }
}

// Globale Instanz
export const storage = new ProjectStorage();
