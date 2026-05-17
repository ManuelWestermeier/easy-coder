# 🚀 easy-coder

A lightweight, fast web code editor for HTML, CSS, and JavaScript. Create amazing web projects instantly with live preview. All data is stored locally on your device.

## ✨ Features

- **⚡ Fast & Lightweight** - No build tools, runs entirely in your browser
- **💾 Local Storage** - All projects saved locally, 100% private
- **🔍 Live Preview** - See changes instantly as you code
- **🎨 Modern UI** - Clean, intuitive dark mode interface
- **📱 Responsive** - Works on desktop, tablet, and mobile
- **🔄 Auto-save** - Automatic saving every 10 seconds
- **🔍 Search** - Quickly find your projects
- **📥 Import/Export** - Share projects as JSON files
- **⌨️ Keyboard Shortcuts** - Ctrl+1 (HTML), Ctrl+2 (JS), Ctrl+3 (CSS), Ctrl+S (Save)

## 🎯 Getting Started

### Online Demo
Simply open `index.html` in your browser. No server required!

```bash
# On macOS/Linux
open index.html

# On Windows
start index.html
```

### Local Development
You can also use any simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# Ruby
ruby -run -ehttpd . -p8000
```

Then visit `http://localhost:8000` in your browser.

## 📂 Project Structure

```
easy-coder-app/
├── index.html          # Main HTML file with meta tags for SEO
├── styles.css          # All styling (dark mode, responsive)
├── app.js              # Main application entry point
├── storage.js          # LocalStorage management
├── utils.js            # Utility functions
├── editor.js           # Code editor and preview components
├── home.js             # Home page with project listing
├── editor-page.js      # Editor page component
└── README.md           # This file
```

## 🎮 Usage

### Create a New Project
1. Click "New Project" button on home page
2. Enter a project name
3. Start coding!

### Edit a Project
1. Click "Edit" on any project card
2. Switch between HTML, CSS, and JavaScript tabs
3. See live preview on the right
4. Click "Save" or use Ctrl+S

### Delete a Project
1. Click "Delete" button on project card
2. Confirm deletion

### Search Projects
Use the search box in the navbar to find projects by name or content

### Export/Import Projects
1. In editor, click "⋮ More" → "📤 Export Project"
2. Save as JSON file
3. To import: "📥 Import Project" → Select JSON file

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+1 / Cmd+1 | Switch to HTML editor |
| Ctrl+2 / Cmd+2 | Switch to JavaScript editor |
| Ctrl+3 / Cmd+3 | Switch to CSS editor |
| Ctrl+S / Cmd+S | Save project |
| Tab | Indent code |

## 🎨 Features in Detail

### Local Storage
All projects are stored in your browser's localStorage. This means:
- Your data stays on your device
- No accounts needed
- No internet required to edit projects
- Data persists across sessions

### Live Preview
The preview updates automatically as you code. The iframe sandboxes your code safely.

### Auto-Save
Projects are automatically saved every 10 seconds if you have unsaved changes.

### Responsive Design
The editor adapts to your screen size:
- Desktop: Side-by-side editor and preview
- Mobile: Stacked editor and preview

## 🐛 Troubleshooting

### Projects Not Showing
- Check your browser's localStorage (DevTools → Application → Local Storage)
- Clear browser cache if needed
- Try a different browser

### Preview Not Updating
- Check browser console for JavaScript errors
- Make sure HTML, CSS, and JS syntax is correct
- Try refreshing the page

### Keyboard Shortcuts Not Working
- On Mac, use Cmd instead of Ctrl
- Make sure focus is in the editor textarea

## 💡 Tips

1. **Regular Backups** - Export important projects regularly
2. **HTML Best Practices** - Use semantic HTML for better structure
3. **CSS Organization** - Group related styles together
4. **Testing** - Always test in different browsers
5. **Performance** - Avoid heavy JavaScript that could slow down preview

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

Open source - feel free to use and modify!

## 🤝 Contributing

Found a bug or have a feature request? Feel free to improve this project!

### Ideas for Improvements
- Syntax highlighting
- Theme customization
- Project templates
- Code snippets library
- Collaborative editing
- Cloud backup option

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🎉 Enjoy Coding!

Happy coding with easy-coder! If you find it useful, share it with others! ✨
