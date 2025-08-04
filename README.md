```markdown
# Wayne-AI - Your Personal AI Assistant

![Wayne-AI Logo](./assets/images/ai-logo.png)

Wayne-AI is a multi-functional AI assistant web application that provides chat, text generation, image generation, and code generation capabilities using various AI providers.

## Features ✨

- **AI Chatbot** with conversation history
- **Text Generation** for creative writing and content
- **Image Generation** from text prompts
- **Code Generation** in multiple programming languages
- **Multi-provider Support** (Gemini, OpenAI, Stability AI)
- **Customizable UI** with Nero (Dark) and Guardian (Light) themes
- **Responsive Design** works on all devices
- **Offline Capabilities** with service worker

## Technologies Used 🛠️

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: Gemini API, OpenAI API, Stability API
- **Tools**: GitHub Pages, GitHub Actions
- **Design**: Custom UI with adaptive themes

## Setup and Installation 🚀

### Prerequisites
- GitHub account
- API keys for:
  - Gemini API
  - OpenAI API
  - Stability API

### Deployment Instructions

1. **Fork the repository**
   ```bash
   git clone https://github.com/Smartburme/wayne-ai.git
   cd wayne-ai
   ```

2. **Set up API keys in GitHub Secrets**
   - Go to Repository Settings → Secrets → Actions
   - Add these secrets:
     - `GEMINI_API_KEY`
     - `OPENAI_API_KEY`
     - `STABILITY_API_KEY`

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Select "Deploy from branch" and choose `main` branch
   - Select `/ (root)` folder

4. **The site will automatically deploy**
   - After pushing to main branch, GitHub Actions will build and deploy

## Project Structure 📂

```
wayne-ai/
├── index.html              # Loading screen
├── pages/                  # Application pages
│   ├── main.html           # Dashboard
│   ├── chat-bot.html       # AI Chat interface
│   ├── text-gen.html       # Text generation
│   ├── image-gen.html      # Image generation
│   ├── code-gen.html       # Code generation
│   ├── setting.html        # Settings
│   ├── about.html          # About page
│   └── future.html         # Roadmap
├── css/                    # Stylesheets
│   ├── main.css            # Main styles
│   ├── chat-bot.css        # Chat interface styles
│   └── ...                 # Other page styles
├── js/                     # JavaScript files
│   ├── api.js              # API service
│   ├── chat-bot.js         # Chat functionality
│   └── ...                 # Other functionality
├── assets/                 # Media assets
└── .github/workflows/      # GitHub Actions config
```

## How to Use 📖

1. **Access the application** at your GitHub Pages URL
2. **Start chatting** with the AI assistant
3. **Generate content** using the different tools:
   - Text for articles, stories, etc.
   - Images from text descriptions
   - Code in various programming languages
4. **Customize settings**:
   - Switch between dark/light theme
   - Select preferred AI provider

## Development 🧑‍💻

### Running locally
1. Install Live Server extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"
3. For testing API calls, create a `js/config.local.js` file:
   ```javascript
   window.__GEMINI_API_KEY = 'your-api-key';
   window.__OPENAI_API_KEY = 'your-api-key';
   window.__STABILITY_API_KEY = 'your-api-key';
   ```

### Build process
- GitHub Actions automatically:
  - Injects API keys during build
  - Minifies assets
  - Deploys to GitHub Pages

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📜

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact 📧

For questions or support, please contact:
- [Project Maintainer](mailto:maintainer@example.com)
- [GitHub Issues](https://github.com/Smartburme/wayne-ai/issues)

```

This README.md includes:

1. **Project Overview** - Clear description of what Wayne-AI does
2. **Key Features** - Highlighted with emojis for visual scanning
3. **Technology Stack** - All major technologies used
4. **Setup Instructions** - Detailed deployment steps
5. **Project Structure** - Clean directory breakdown
6. **Usage Guide** - How to use the application
7. **Development Info** - Local setup and build process
8. **Contribution Guidelines** - Standard open-source template
9. **License and Contact** - Important legal and support info

The document uses proper Markdown formatting with:
- Consistent heading levels
- Code blocks for commands/configs
- Directory tree visualization
- Emojis for visual organization
- Clear section separation
