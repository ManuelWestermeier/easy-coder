// editor-page.js - Editor-Seite mit Code-Editor

import { storage } from './storage.js';
import { CodeEditor, Preview } from './editor.js';
import { createElement, showNotification, openModal, debounce } from './utils.js';

export class EditorPage {
    constructor(projectId, onNavigate) {
        this.projectId = projectId;
        this.onNavigate = onNavigate;
        this.project = storage.getProjectById(projectId);
        this.isDirty = false;

        if (!this.project) {
            showNotification('Project not found', 'error');
            onNavigate('home');
            return;
        }
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = '';

        const container = createElement('div', { class: 'container' });

        // Navbar
        container.appendChild(this.createNavbar());

        // Editor Layout
        const content = createElement('div', { class: 'content' });
        const layout = createElement('div', { class: 'editor-layout' });

        // Editor Panel
        const editorPanel = createElement('div', { class: 'editor-panel' });
        editorPanel.id = 'editor-panel';
        layout.appendChild(editorPanel);

        // Preview Panel
        const previewPanel = createElement('div', { class: 'preview-panel' });
        previewPanel.id = 'preview-panel';
        layout.appendChild(previewPanel);

        content.appendChild(layout);
        container.appendChild(content);

        app.appendChild(container);

        // Initialisiere Editoren
        this.initEditors();
        this.attachEventListeners();
    }

    createNavbar() {
        const navbar = createElement('div', { class: 'navbar' });

        const left = createElement('div', { class: 'navbar-left' });

        const backBtn = createElement('button', {
            class: 'logo',
            type: 'button'
        }, '← Back');

        backBtn.addEventListener('click', () => {
            if (this.isDirty) {
                openModal(
                    'Unsaved Changes',
                    '<p>You have unsaved changes. Leave anyway?</p>',
                    [
                        { text: 'Keep Editing', className: 'btn-secondary' },
                        {
                            text: 'Leave',
                            className: 'btn-danger',
                            onClick: () => this.onNavigate('home')
                        }
                    ]
                );
            } else {
                this.onNavigate('home');
            }
        });

        left.appendChild(backBtn);

        const projectName = createElement('div', {
            style: {
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--light)'
            }
        }, this.project.name);

        left.appendChild(projectName);

        navbar.appendChild(left);

        // Actions
        const actions = createElement('div', { class: 'footer-actions' });

        const saveBtn = createElement('button', {
            class: 'btn btn-success btn-small',
            type: 'button',
            'data-action': 'save'
        }, '💾 Save');

        const editNameBtn = createElement('button', {
            class: 'btn btn-secondary btn-small',
            type: 'button',
            'data-action': 'rename'
        }, '✎ Rename');

        const moreBtn = createElement('button', {
            class: 'btn btn-secondary btn-small',
            type: 'button',
            'data-action': 'more'
        }, '⋮ More');

        actions.appendChild(saveBtn);
        actions.appendChild(editNameBtn);
        actions.appendChild(moreBtn);

        navbar.appendChild(actions);

        return navbar;
    }

    initEditors() {
        this.codeEditor = new CodeEditor('editor-panel', {
            defaultLanguage: 'html',
            onChange: (lang, value) => {
                this.project[lang === 'javascript' ? 'js' : lang] = value;
                this.isDirty = true;

                // Update Preview
                if (this.preview) {
                    this.preview.update(
                        this.project.html,
                        this.project.css,
                        this.project.js
                    );
                }
            },
            onLanguageChange: (lang) => {
                // Optional: Language-spezifische Aktionen
            }
        });

        // Set initial values
        this.codeEditor.setValue('html', this.project.html);
        this.codeEditor.setValue('css', this.project.css);
        this.codeEditor.setValue('javascript', this.project.js);

        // Preview
        this.preview = new Preview('preview-panel');
        this.preview.update(
            this.project.html,
            this.project.css,
            this.project.js
        );
    }

    attachEventListeners() {
        // Save
        const saveBtn = document.querySelector('[data-action="save"]');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveProject());
        }

        // Rename
        const renameBtn = document.querySelector('[data-action="rename"]');
        if (renameBtn) {
            renameBtn.addEventListener('click', () => this.showRenameModal());
        }

        // More Options
        const moreBtn = document.querySelector('[data-action="more"]');
        if (moreBtn) {
            moreBtn.addEventListener('click', () => this.showMoreOptions());
        }

        // Auto-save every 1 seconds if dirty
        setInterval(() => {
            if (this.isDirty) {
                this.autoSave();
            }
        }, 1000);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveProject();
            }
        });
    }

    saveProject() {
        const values = this.codeEditor.getAllValues();

        this.project.html = values.html;
        this.project.css = values.css;
        this.project.js = values.javascript;

        if (storage.saveProject(this.project)) {
            this.isDirty = false;
            showNotification('Project saved!', 'success');

            // Update preview
            this.preview.update(
                this.project.html,
                this.project.css,
                this.project.js
            );
        } else {
            showNotification('Error saving project', 'error');
        }
    }

    autoSave() {
        const values = this.codeEditor.getAllValues();

        this.project.html = values.html;
        this.project.css = values.css;
        this.project.js = values.javascript;

        storage.saveProject(this.project);
        console.log('Auto-saved at', new Date().toLocaleTimeString());
    }

    showRenameModal() {
        const input = createElement('input', {
            class: 'modal-input',
            type: 'text',
            value: this.project.name,
            maxlength: '100'
        });

        setTimeout(() => {
            input.focus();
            input.select();
        }, 0);

        openModal(
            'Rename Project',
            input,
            [
                { text: 'Cancel', className: 'btn-secondary' },
                {
                    text: 'Rename',
                    className: 'btn-primary',
                    onClick: () => {
                        const newName = input.value.trim();
                        if (!newName) {
                            showNotification('Project name cannot be empty', 'error');
                            return;
                        }

                        this.project.name = newName;
                        if (storage.saveProject(this.project)) {
                            showNotification('Project renamed!', 'success');
                            document.querySelector('.navbar-left > div:nth-child(2)').textContent = newName;
                        }
                    }
                }
            ]
        );
    }

    showMoreOptions() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        const menu = document.createElement('div');
        menu.className = 'modal';
        menu.style.maxWidth = '300px';

        const title = document.createElement('h2');
        title.textContent = 'More Options';
        menu.appendChild(title);

        const options = [
            {
                label: '📥 Import Project',
                action: () => this.importProject()
            },
            {
                label: '📤 Export Project',
                action: () => this.exportProject()
            },
            {
                label: '📋 Duplicate',
                action: () => this.duplicateProject()
            },
            {
                label: '🗑 Delete Project',
                action: () => this.deleteProject()
            }
        ];

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary';
            btn.style.width = '100%';
            btn.style.marginBottom = '0.5rem';
            btn.textContent = opt.label;

            btn.addEventListener('click', () => {
                modal.remove();
                opt.action();
            });

            menu.appendChild(btn);
        });

        modal.appendChild(menu);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.body.appendChild(modal);
    }

    exportProject() {
        const data = JSON.stringify({
            name: this.project.name,
            html: this.codeEditor.getValue('html'),
            css: this.codeEditor.getValue('css'),
            js: this.codeEditor.getValue('javascript')
        }, null, 2);

        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.project.name.replace(/\s+/g, '-').toLowerCase()}.json`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        showNotification('Project exported!', 'success');
    }

    importProject() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);

                    if (!imported.html || !imported.css || !imported.js) {
                        showNotification('Invalid project format', 'error');
                        return;
                    }

                    const newProject = {
                        id: Date.now(),
                        name: imported.name || 'Imported Project',
                        html: imported.html,
                        css: imported.css,
                        js: imported.js,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    storage.saveProject(newProject);
                    showNotification('Project imported!', 'success');
                    this.onNavigate('editor', newProject.id);
                } catch (error) {
                    showNotification('Error importing project', 'error');
                }
            };

            reader.readAsText(file);
        });

        input.click();
    }

    duplicateProject() {
        const duplicate = storage.duplicateProject(this.projectId);
        if (duplicate) {
            showNotification('Project duplicated!', 'success');
            this.onNavigate('editor', duplicate.id);
        }
    }

    deleteProject() {
        openModal(
            'Delete Project',
            `<p>Are you sure you want to delete "<strong>${this.project.name}</strong>"?</p><p>This action cannot be undone.</p>`,
            [
                { text: 'Cancel', className: 'btn-secondary' },
                {
                    text: 'Delete',
                    className: 'btn-danger',
                    onClick: () => {
                        if (storage.deleteProject(this.projectId)) {
                            showNotification('Project deleted', 'success');
                            this.onNavigate('home');
                        }
                    }
                }
            ]
        );
    }
}
