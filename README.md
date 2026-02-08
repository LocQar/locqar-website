# LocQar Website

> **Your Phone Number is Your Address** — Smart locker delivery platform for Ghana.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel
```bash
npx vercel
```

### Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### Cloudflare Pages
Upload the `dist/` folder via the Cloudflare dashboard, or use Wrangler:
```bash
npx wrangler pages deploy dist
```

### Manual / Any Static Host
Run `npm run build` and upload the contents of the `dist/` folder.

## Project Structure

```
locqar-vite/
├── index.html        # Complete website (single-file)
├── package.json      # Dependencies & scripts
├── vite.config.js    # Vite build configuration
├── public/
│   └── favicon.svg   # Site favicon
├── .gitignore
└── README.md
```

## Tech Stack

- **Vite 5** — Lightning-fast build tool
- **Vanilla HTML/CSS/JS** — Zero framework dependencies
- **Google Fonts** — Sora, DM Sans, JetBrains Mono

## License

© 2026 LocQar Technologies Ltd. All rights reserved.
