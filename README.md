# Regex Playground - Frontend

Angular frontend for Regex Playground - A powerful regex testing and collaboration platform.

## Features

- 🔍 **Real-time regex testing** - Instant results as you type
- 📚 **Pattern library** - Save and organize your patterns
- 👥 **Team collaboration** - Share patterns with your team
- 💻 **Code export** - Generate test code in Java, JavaScript, Python
- 📱 **Responsive design** - Works on desktop, tablet, and mobile
- 🎨 **Beautiful UI** - Modern, clean interface

## Tech Stack

- Angular 18
- TypeScript 5.5
- SCSS for styling
- RxJS for reactive programming
- Standalone components (no NgModules)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser
# http://localhost:4200
```

### Environment Variables

Create `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com'
};
```

## Development

```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── regex-tester/       # Main tester component
│   │   ├── pattern-library/    # Pattern library
│   │   └── pricing/            # Pricing page
│   ├── services/
│   │   └── regex.service.ts    # API service
│   ├── models/                 # TypeScript interfaces
│   ├── guards/                 # Route guards
│   ├── app.component.ts        # Root component
│   ├── app.config.ts           # App configuration
│   └── app.routes.ts           # Routing configuration
├── assets/                     # Static assets
├── environments/               # Environment configs
└── styles.scss                # Global styles
```

## Key Features

### Real-time Testing
- Debounced input for performance
- Syntax highlighting
- Match visualization
- Error explanations

### Pattern Library (Pro/Team)
- Save unlimited patterns
- Organize in folders
- Share with team
- Version history

### Code Export (Pro/Team)
- Java test code
- JavaScript test code
- Python test code
- Customizable templates

## Deployment

### Build

```bash
npm run build
```

Output will be in `dist/regex-playground-frontend`

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/regex-playground-frontend/browser
```

## SEO Optimization

The app is optimized for search engines:

- Meta tags for each page
- Semantic HTML
- Fast loading times
- Mobile-responsive

Target keywords:
- "regex tester online"
- "regular expression validator"
- "regex playground"
- "test regex pattern"

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details
