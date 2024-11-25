# TFeed - Web Telegram Channel Viewer

TFeed is a web application that allows users to browse and read public Telegram channels directly in their browser. No downloads, installations, or authentication required - just open and start reading.

## Features

- Browse public Telegram channels seamlessly
- Clean and intuitive user interface powered by VK UI
- Responsive design that works across devices
- No registration or Telegram account required
- Real-time channel updates
- Multi-language support via i18next

## Tech Stack

### Core
- [React](https://react.dev/) - UI library
- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management

### UI/Styling
- [VK UI](https://vkcom.github.io/VKUI) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide React](https://lucide.dev/) - Icon library

### Data Fetching/State
- [Axios](https://axios-http.com/) - HTTP client
- [SWR](https://swr.vercel.app/) - Data fetching
- [React Redux](https://react-redux.js.org/) - Redux bindings

### Utilities
- [dayjs](https://day.js.org/) - Date handling
- [i18next](https://www.i18next.com/) - Internationalization
- [lodash](https://lodash.com/) - Utility functions

### Infrastructure
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting and deployment

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `dev` - Run development server
- `dev:https` - Run development server with HTTPS
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint
- `pages:build` - For test build in Cloudflare's env
- `deploy` - Build and deploy to production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[TFeed License](LICENSE.md)
