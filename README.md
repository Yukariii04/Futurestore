# FutureStore

Minimalist, future-forward ecommerce experience built with React and Vite. The site blends glassmorphic UI, GSAP motion, and curated product data pulled from Fake Store API and DummyJSON, featuring a custom inline product inspector and holographic hero accent (powered by the Teto dancing GIF).

## Features
- **GSAP Enhanced Hero** with orbit card animation/GIF swap that respects reduced-motion settings.
- **Dynamic Featured Capsule** that fetches products at runtime from multiple sources (Fake Store API, DummyJSON), highlights a subset, and shows inline details with add-to-cart/wishlist controls via the shared store context.
- **Global Glassmorphic Styling** driven by **Tailwind CSS 4** utilities plus custom neon/holo helpers.
- **Persistent Cart + Wishlist** stored in `localStorage` through `StoreContext`.
- **Vite Dev/Build Pipeline** for fast HMR locally and a lightweight static deploy target (`dist/`).

## Tech Stack
- **Core**: React 18, React Router 6, Vite 5
- **Styling**: Tailwind CSS 4 (@tailwindcss/vite), Native CSS Variables (Theming/Glassmorphism)
- **Animation**: GSAP (GreenSock), Native CSS Keyframes
- **State Management**: React Context API + useReducer, LocalStorage Persistence
- **Data**: Fake Store API, DummyJSON (Multi-source aggregation)

## Getting Started
```bash
# Install dependencies
npm install

# Run locally with HMR
npm run dev

# Type-check and bundle for production
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure
```
FutureStore/
├─ src/
│  ├─ components/      # Navbar, Footer, shared UI
│  ├─ context/         # StoreContext (cart, wishlist, orders)
│  ├─ lib/api.js       # Data fetching adapters (Fake Store API, DummyJSON)
│  ├─ pages/           # Route-level views (Home, Products, etc.)
│  ├─ index.jsx        # App bootstrap
│  └─ index.css        # Tailwind imports + custom CSS variables
├─ public/ (implicit)  # Vite serves root-level assets like index.html
├─ teto/teto.gif       # Teto animation used inside the Home hero orbit card
├─ dist/               # Generated after `npm run build` (deploy this)
├─ package.json
└─ vite.config.js
```

## Deployment
1. Run `npm run build`; Vite outputs the production-ready site to `dist/`.
2. Upload the entire `dist/` folder to your static host (Vercel, Netlify, GitHub Pages, S3, etc.).
3. Ensure the host serves `index.html` for unknown routes if you rely on client-side routing.

## Notes
- The API layer (`src/lib/api.js`) aggregates data from multiple public APIs. Rate limits on these services may apply.
- If you swap the hero GIF, update the import in `src/pages/Home.jsx` and keep the file under `teto/` or `public/`.
- The build artifact hashes filenames each build; always deploy the fresh `dist/` to avoid stale assets.
