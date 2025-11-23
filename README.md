# React HTML Builder 🚀

A simple, self-contained React application built with Vite that compiles to a single HTML file. Perfect for demos, prototypes, or when you need a portable React app without external dependencies.

## ✨ Features

- **Single File Output**: Builds to one self-contained HTML file
- **No CORS Issues**: Works when opened directly in browsers
- **Offline Capable**: No external dependencies or network requests
- **Modern React**: Built with React 18 and modern hooks
- **Fast Development**: Powered by Vite with Hot Module Replacement (HMR)
- **Auto Browser Opening**: Development server opens browser automatically

## 🛠️ Built With

- [React 18](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next generation frontend build tool
- [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) - Plugin to inline all assets into a single HTML file

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sendilb191/react-html-builder.git
cd react-html-builder
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:5173/`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the app for production (creates single HTML file)
- `npm run preview` - Preview the built app locally

## 📁 Project Structure

```
react-html-builder/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx          # Main App component
│   ├── App.css          # App styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🎯 Key Configuration

The project uses `vite-plugin-singlefile` to create a single, self-contained HTML file:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: {
    open: true,
  },
  base: './',
});
```

## 🚢 Deployment

After running `npm run build`, you'll get a single HTML file in the `dist/` folder that contains:

- All JavaScript code (React, your components, etc.)
- All CSS styles
- No external dependencies

You can:

1. **Share the file directly** - Just send the HTML file to anyone
2. **Host anywhere** - Upload to any web server or file hosting service
3. **Open locally** - Double-click the file to open in any browser
4. **Embed easily** - Use in presentations, documentation, or other projects

## 🎨 Customization

### Adding New Components

Create new components in the `src/` folder and import them into `App.jsx`:

```jsx
import MyComponent from './MyComponent';

function App() {
  return (
    <div>
      <MyComponent />
    </div>
  );
}
```

### Styling

- Edit `src/App.css` for component-specific styles
- Edit `src/index.css` for global styles
- The build process will automatically inline all CSS

### State Management

The project includes a simple counter example using React hooks:

```jsx
const [count, setCount] = useState(0);
```

Add more state and functionality as needed for your use case.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- React team for the amazing library
- Vite team for the blazing fast build tool
- Richard Tallent for the vite-plugin-singlefile plugin

## 📞 Support

If you have any questions or run into issues, please [open an issue](https://github.com/sendilb191/react-html-builder/issues) on GitHub.

---

**Happy coding!** 🎉
