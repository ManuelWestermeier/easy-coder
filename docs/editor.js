// editor.js - Code-Editor-Komponente

import { createElement, debounce, createPreviewUrl } from './utils.js';

export class CodeEditor {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.activeLanguage = options.defaultLanguage || 'html';
        this.onChange = options.onChange || (() => {});
        this.onLanguageChange = options.onLanguageChange || (() => {});
        
        this.editors = {
            html: '',
            css: '',
            javascript: ''
        };
        
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        
        // Header mit Tabs
        const header = createElement('div', { class: 'editor-header' });
        
        const tabs = createElement('div', { class: 'editor-tabs' });
        
        const languages = [
            { id: 'html', label: 'HTML', icon: '⟨⟩' },
            { id: 'css', label: 'CSS', icon: '🎨' },
            { id: 'javascript', label: 'JavaScript', icon: '⚙' }
        ];
        
        languages.forEach(lang => {
            const btn = createElement('button', {
                class: `tab-btn ${lang.id === this.activeLanguage ? 'active' : ''}`,
                'data-language': lang.id,
                type: 'button'
            }, `${lang.icon} ${lang.label}`);
            
            btn.addEventListener('click', () => this.switchLanguage(lang.id));
            tabs.appendChild(btn);
        });
        
        header.appendChild(tabs);
        this.container.appendChild(header);
        
        // Editor-Bereich
        const editorContent = createElement('div', {
            style: {
                flex: '1',
                display: 'flex',
                overflow: 'hidden'
            }
        });
        
        // Textarea für Code
        this.textarea = createElement('textarea', {
            class: 'code-textarea',
            'data-language': this.activeLanguage,
            spellcheck: 'false',
            style: {
                flex: '1',
                padding: '1rem',
                fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', 'Courier', monospace",
                fontSize: '14px',
                lineHeight: '1.6',
                background: 'var(--darker)',
                color: 'var(--light)',
                border: 'none',
                resize: 'none',
                tab: '4'
            }
        }, '');
        
        // Zeilennummern
        const lineNumbers = createElement('div', {
            class: 'line-numbers',
            style: {
                background: 'var(--dark)',
                borderRight: '1px solid var(--border)',
                padding: '1rem 0.5rem',
                fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace",
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'var(--gray)',
                userSelect: 'none',
                minWidth: '40px',
                textAlign: 'right',
                overflowY: 'hidden'
            }
        });
        
        this.lineNumbers = lineNumbers;
        
        editorContent.appendChild(lineNumbers);
        editorContent.appendChild(this.textarea);
        
        this.container.appendChild(editorContent);
        
        // Event Listener
        this.textarea.addEventListener('input', () => this.handleInput());
        this.textarea.addEventListener('scroll', () => this.syncScroll());
        
        // Tab-Support
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.textarea.selectionStart;
                const end = this.textarea.selectionEnd;
                this.textarea.value = this.textarea.value.substring(0, start) + '\t' + this.textarea.value.substring(end);
                this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
                this.handleInput();
            }
        });
        
        // Tastenkombinationen
        this.textarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === '1') {
                    e.preventDefault();
                    this.switchLanguage('html');
                } else if (e.key === '2') {
                    e.preventDefault();
                    this.switchLanguage('javascript');
                } else if (e.key === '3') {
                    e.preventDefault();
                    this.switchLanguage('css');
                }
            }
        });
        
        this.updateLineNumbers();
    }

    setValue(language, value) {
        this.editors[language] = value || '';
        if (language === this.activeLanguage) {
            this.textarea.value = this.editors[language];
            this.updateLineNumbers();
            this.syncScroll();
        }
    }

    getValue(language = this.activeLanguage) {
        if (language === this.activeLanguage) {
            return this.textarea.value;
        }
        return this.editors[language];
    }

    getAllValues() {
        return {
            html: this.getValue('html'),
            css: this.getValue('css'),
            javascript: this.getValue('javascript')
        };
    }

    switchLanguage(language) {
        // Speichere aktuellen Wert
        this.editors[this.activeLanguage] = this.textarea.value;
        
        // Wechsle Sprache
        this.activeLanguage = language;
        this.textarea.setAttribute('data-language', language);
        this.textarea.value = this.editors[language] || '';
        
        // Update Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-language') === language);
        });
        
        this.updateLineNumbers();
        this.syncScroll();
        this.onLanguageChange(language);
    }

    handleInput() {
        this.editors[this.activeLanguage] = this.textarea.value;
        this.updateLineNumbers();
        
        // Debounce onChange
        debounce(() => {
            this.onChange(this.activeLanguage, this.textarea.value);
        }, 300)();
    }

    updateLineNumbers() {
        const lines = this.textarea.value.split('\n').length;
        let lineNumbers = '';
        for (let i = 1; i <= lines; i++) {
            lineNumbers += i + '\n';
        }
        this.lineNumbers.textContent = lineNumbers;
    }

    syncScroll() {
        this.lineNumbers.scrollTop = this.textarea.scrollTop;
    }

    focus() {
        this.textarea.focus();
    }

    clear() {
        this.editors = { html: '', css: '', javascript: '' };
        this.textarea.value = '';
        this.updateLineNumbers();
    }
}

/**
 * Preview-Komponente für iFrame
 */
export class Preview {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.html = '';
        this.css = '';
        this.js = '';
        
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        
        const header = createElement('div', { class: 'editor-header' });
        const title = createElement('div', {}, 'Preview');
        header.appendChild(title);
        
        this.container.appendChild(header);
        
        this.iframeContainer = createElement('div', {
            style: {
                flex: '1',
                overflow: 'auto',
                background: 'white'
            }
        });
        
        this.iframe = createElement('iframe', {
            style: {
                width: '100%',
                height: '100%',
                border: 'none'
            }
        });
        
        this.iframeContainer.appendChild(this.iframe);
        this.container.appendChild(this.iframeContainer);
    }

    update(html, css, js) {
        this.html = html;
        this.css = css;
        this.js = js;
        
        try {
            const iframeUrl = createPreviewUrl(html, css, js);
            this.iframe.src = iframeUrl;
        } catch (error) {
            console.error('Preview error:', error);
            this.showError('Preview Error: ' + error.message);
        }
    }

    showError(message) {
        const errorHtml = `
            <div style="padding: 2rem; color: #FF6B6B; font-family: monospace;">
                <h3>⚠️ Preview Error</h3>
                <p>${message}</p>
            </div>
        `;
        this.iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(errorHtml);
    }

    clear() {
        this.html = '';
        this.css = '';
        this.js = '';
        this.iframe.src = 'about:blank';
    }
}
