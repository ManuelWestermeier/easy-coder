// home.js - Home-Seite mit Projekten-Anzeige

import { storage } from './storage.js';
import { createElement, formatDate, createProjectCardHTML, showNotification, openModal } from './utils.js';

export class HomePage {
    constructor(onNavigate) {
        this.onNavigate = onNavigate;
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = '';

        const container = createElement('div', { class: 'container' });

        // Navbar
        container.appendChild(this.createNavbar());

        // Content
        const content = createElement('div', { class: 'content' });
        const home = createElement('div', { class: 'home' });

        // Hero Section
        home.appendChild(this.createHero());

        // Projects Section
        home.appendChild(this.createProjectsSection());

        // Features Section
        home.appendChild(this.createFeatures());

        content.appendChild(home);
        container.appendChild(content);

        app.appendChild(container);

        this.attachEventListeners();
    }

    createNavbar() {
        const navbar = createElement('div', { class: 'navbar' });

        const left = createElement('div', { class: 'navbar-left' });

        const logo = createElement('button', {
            class: 'logo',
            type: 'button'
        }, '&lt;/&gt; easy-coder');

        logo.addEventListener('click', () => this.render());
        left.appendChild(logo);

        const navLinks = createElement('div', { class: 'nav-links' });

        const homeBtn = createElement('button', {
            class: 'nav-btn active',
            type: 'button'
        }, '🏠 Home');
        homeBtn.addEventListener('click', () => this.render());
        navLinks.appendChild(homeBtn);

        const newBtn = createElement('button', {
            class: 'nav-btn',
            type: 'button',
            'data-action': 'new-project'
        }, '+ New Project');
        navLinks.appendChild(newBtn);

        left.appendChild(navLinks);
        navbar.appendChild(left);

        // Search
        const searchBox = createElement('input', {
            class: 'search-box',
            type: 'text',
            placeholder: '🔍 Search projects...',
            'data-action': 'search'
        });

        navbar.appendChild(searchBox);

        return navbar;
    }

    createHero() {
        const hero = createElement('div', { class: 'hero' });

        const h1 = createElement('h1', {}, '✨ Welcome to easy-coder');
        const p = createElement('p', {},
            'A lightweight, fast code editor for HTML, CSS, and JavaScript. Create amazing web projects instantly with live preview. All your projects are saved locally on your device.'
        );

        const buttons = createElement('div', { class: 'hero-buttons' });

        const newBtn = createElement('button', {
            class: 'btn btn-primary',
            type: 'button',
            'data-action': 'new-project'
        }, '🚀 Start New Project');

        const docsBtn = createElement('button', {
            class: 'btn btn-secondary',
            type: 'button'
        }, '📖 Documentation');

        docsBtn.addEventListener('click', () => {
            alert(`easy-coder v1.0\n\nFeatures:\n✓ Real-time Preview\n✓ Local Storage\n✓ Create/Edit/Delete Projects\n✓ Search Projects\n✓ Responsive Design\n\nKeyboard Shortcuts:\nCtrl+1: HTML\nCtrl+2: JavaScript\nCtrl+3: CSS`);
        });

        buttons.appendChild(newBtn);
        buttons.appendChild(docsBtn);

        hero.appendChild(h1);
        hero.appendChild(p);
        hero.appendChild(buttons);

        return hero;
    }

    createFeatures() {
        const features = createElement('div', { class: 'features' });

        const title = createElement('h2', { class: 'section-title' }, '✨ Features');
        features.appendChild(title);

        const grid = createElement('div', { class: 'features-grid' });

        const featureList = [
            {
                icon: '⚡',
                title: 'Fast & Light',
                description: 'No build tools required. Runs entirely in your browser with instant previews.'
            },
            {
                icon: '💾',
                title: 'Local Storage',
                description: 'All your projects are saved locally on your device. No cloud needed, 100% privacy.'
            },
            {
                icon: '🔍',
                title: 'Live Preview',
                description: 'See your HTML, CSS, and JavaScript changes instantly as you type.'
            },
            {
                icon: '🎨',
                title: 'Modern Editor',
                description: 'Clean, intuitive interface with syntax highlighting and keyboard shortcuts.'
            },
            {
                icon: '📱',
                title: 'Responsive',
                description: 'Works on desktop, tablet, and mobile devices. Code anywhere, anytime.'
            },
            {
                icon: '🚀',
                title: 'No Setup',
                description: 'Zero configuration required. Start coding immediately without any setup.'
            }
        ];

        featureList.forEach(feature => {
            const card = createElement('div', { class: 'feature-card' });

            const icon = createElement('div', { class: 'feature-icon' }, feature.icon);
            const h3 = createElement('h3', {}, feature.title);
            const p = createElement('p', {}, feature.description);

            card.appendChild(icon);
            card.appendChild(h3);
            card.appendChild(p);
            grid.appendChild(card);
        });

        features.appendChild(grid);
        return features;
    }

    createProjectsSection() {
        const section = createElement('div', { class: 'projects-section' });

        const title = createElement('h2', { class: 'section-title' }, '📂 Your Projects');
        section.appendChild(title);

        const projects = storage.getAllProjects();

        if (projects.length === 0) {
            const empty = createElement('div', { class: 'text-center mt-2' });
            empty.innerHTML = `
                <p style="color: var(--gray); font-size: 1.1rem; margin-bottom: 1rem;">
                    No projects yet. Create one to get started!
                </p>
            `;
            section.appendChild(empty);
        } else {
            const grid = createElement('div', { class: 'projects-grid' });

            projects.forEach(project => {
                const card = document.createElement('div');
                card.innerHTML = createProjectCardHTML(project);
                grid.appendChild(card.firstElementChild);
            });

            section.appendChild(grid);
        }

        return section;
    }

    attachEventListeners() {
        // New Project Button
        document.querySelectorAll('[data-action="new-project"]').forEach(btn => {
            btn.addEventListener('click', () => this.showNewProjectModal());
        });

        // Search
        const searchBox = document.querySelector('[data-action="search"]');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Project Cards - Edit/Delete
        document.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = parseInt(e.target.getAttribute('data-id'));
                this.onNavigate('editor', projectId);
            });
        });

        document.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = parseInt(e.target.getAttribute('data-id'));
                const project = storage.getProjectById(projectId);

                openModal(
                    'Delete Project',
                    `<p>Are you sure you want to delete "<strong>${project.name}</strong>"? This cannot be undone.</p>`,
                    [
                        {
                            text: 'Cancel',
                            className: 'btn-secondary'
                        },
                        {
                            text: 'Delete',
                            className: 'btn-danger',
                            onClick: () => {
                                if (storage.deleteProject(projectId)) {
                                    showNotification('Project deleted', 'success');
                                    this.render();
                                } else {
                                    showNotification('Error deleting project', 'error');
                                }
                            }
                        }
                    ]
                );
            });
        });
    }

    showNewProjectModal() {
        const input = createElement('input', {
            class: 'modal-input',
            type: 'text',
            placeholder: 'Project name...',
            maxlength: '100'
        });

        setTimeout(() => input.focus(), 0);

        const modal = openModal(
            'New Project',
            input,
            [
                {
                    text: 'Cancel',
                    className: 'btn-secondary'
                },
                {
                    text: 'Create',
                    className: 'btn-primary',
                    onClick: () => {
                        const name = input.value.trim();
                        if (!name) {
                            showNotification('Please enter a project name', 'error');
                            return;
                        }

                        const newProject = {
                            id: Date.now(),
                            name: name,
                            html: '<h1>Hello World</h1>',
                            css: 'body { font-family: sans-serif; }',
                            js: '// Your JavaScript code here',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };

                        if (storage.saveProject(newProject)) {
                            showNotification('Project created!', 'success');
                            this.onNavigate('editor', newProject.id);
                        } else {
                            showNotification('Error creating project', 'error');
                        }
                    }
                }
            ]
        );
    }

    handleSearch(query) {
        const projects = storage.searchProjects(query);
        const grid = document.querySelector('.projects-grid');

        if (!grid) return;

        grid.innerHTML = '';

        if (projects.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--gray);">No projects found</div>';
        } else {
            projects.forEach(project => {
                const card = document.createElement('div');
                card.innerHTML = createProjectCardHTML(project);
                grid.appendChild(card.firstElementChild);
            });

            // Re-attach event listeners
            this.attachEventListeners();
        }
    }
}
