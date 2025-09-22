## Desktop App – Getting Started

A modern Electron + React (Vite) desktop application with Tailwind CSS and Supabase auth.

### Prerequisites
- **Node.js**: v18+ (recommended LTS)
- **npm**: v9+
- macOS, Windows, or Linux

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables (Supabase)
Create a file at `renderer/.env.local` with your Supabase project values:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Notes:
- These variables are required by `renderer/src/lib/supabase.ts` and the app will error if missing.
- Do not commit secrets. `.env.local` is intended to be local-only.

### 3) Run the app in development
Starts Vite dev server and launches Electron pointing to it.
```bash
npm run dev
```

Dev URLs/Ports:
- Vite dev server: `http://localhost:5173` (auto-started)

### 4) Build for production
Type-checks and builds the renderer bundle.
```bash
npm run build
```

### 5) Package or make installers
Create a packaged app (no installer):
```bash
npm run package
```

Create platform-specific installers/artifacts via Electron Forge:
```bash
npm run make
```

Outputs are written to `out/` (e.g., `out/desktop-app-darwin-arm64/`).

### Scripts reference (from package.json)
- `dev`: run Vite and Electron together for local development
- `build`: compile TypeScript and build the renderer with Vite
- `start`: run Electron Forge in dev mode (alternative to `npm run dev`)
- `package`: generate a packaged app
- `make`: generate distributables/installers

### Project structure (high-level)
```
renderer/
  src/
    App.tsx                # React entry
    main.tsx               # Vite/React bootstrap
    lib/supabase.ts        # Supabase client setup (uses VITE_ envs)
    components/            # UI components
    hooks/, stores/        # State, hooks
    styles.css             # Tailwind CSS
  vite.config.ts           # Vite config
  tailwind.config.ts       # Tailwind config

main.js                    # Electron main process entry
forge.config.js            # Electron Forge config
AUTH_SETUP.md              # Auth flows & setup details
```

### Styling
- Tailwind CSS v4 is configured. Edit `renderer/styles.css` and utility classes in components.
- UI should be responsive across screen sizes; prefer mobile-first styles.

### Supabase notes
- Auth uses the public anon key on the client. For any privileged operations, implement a backend or Edge Functions.
- Ensure email auth/providers are enabled in your Supabase project if using the included auth screens.

### Troubleshooting
- Missing Supabase envs: ensure `renderer/.env.local` contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Port conflicts on 5173: stop other Vite apps or set `VITE_PORT` and update Vite config if needed.
- macOS Gatekeeper blocking app: right-click → Open the first time, or notarize/sign for distribution.

### License
ISC (see `LICENSE`).


