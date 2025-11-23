# No Sleep React App 🚀

A self-contained React application that prevents your screen from going to sleep. Built with Vite and compiles to a single HTML file for easy sharing and deployment.

## ✨ Features

- **Wake Lock Support**: Uses Wake Lock API with video fallback for older browsers
- **Smart Routing**: Automatic BrowserRouter/HashRouter switching for clean URLs
- **Easy Launcher**: One-click launcher scripts for clean local URLs
- **Single File Output**: Builds to one self-contained HTML file
- **No CORS Issues**: Works when opened directly in browsers
- **Offline Capable**: No external dependencies or network requests
- **Cross-Browser Compatible**: Supports Chrome, Firefox, Safari, and Edge
- **Modern React**: Built with React 18, React Router, and modern hooks
- **Fast Development**: Powered by Vite with Hot Module Replacement (HMR)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

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

3. **Quick Launch** (Recommended):

```bash
npm run launch
# or simply
npm start
```

**Or for development:**

```bash
npm run dev
```

The launcher provides clean URLs like `http://localhost:3333/settings` instead of ugly hash URLs!

## 📜 Available Scripts

### 🚀 **Launchers** (Clean URLs)

- `npm run launch` / `npm start` - **Launch with clean URLs** ⭐
- `./launch.bat` - Windows launcher script
- `./launch.sh` - Unix/Mac launcher script

### 🔧 **Development**

- `npm run dev` - Start development server with hot reload

### 📦 **Building**

- `npm run build` - Build the app for production (creates single HTML file)
- `npm run build:production` - Enhanced build with additional optimizations

### 🌐 **Preview/Testing**

- `npm run preview` - Preview the built app via Vite's preview server
- `npm run serve:dist` - Serve built app with simple Node.js server

### 🎨 **Code Quality**

- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📁 Project Structure

```
no-sleep-react/
├── public/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navigation.jsx
│   │   └── shared/
│   │       └── ToggleButton.jsx
│   ├── contexts/        # React contexts
│   │   └── WakeLockContext.jsx
│   ├── pages/          # Route components
│   │   ├── MainPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── AboutPage.jsx
│   ├── styles/         # Shared styles
│   │   ├── buttons.less
│   │   ├── forms.less
│   │   └── page.less
│   ├── utils/          # Utility functions
│   │   ├── browser.js  # Browser feature detection
│   │   ├── routing.js  # Routing utilities
│   │   └── index.js    # Exports
│   ├── App.jsx         # Main App component
│   ├── App.less        # App styles
│   ├── main.jsx        # Entry point
│   └── root.css        # Global styles
├── scripts/            # Build scripts
│   └── build.js        # Enhanced build script
├── docs/              # Documentation
│   └── ROUTING.md     # Routing documentation
├── index.html         # HTML template
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite configuration
└── README.md         # This file
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
