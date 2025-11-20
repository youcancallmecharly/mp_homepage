# Money Penny Website (Next.js + 3D Node Globe)

This repository contains the code-based implementation of the **Money Penny** site, migrated from Wix to a modern **Next.js** / **Vercel** stack plus a reusable 3D Bitcoin node globe.

## Tech stack

- Next.js (Pages Router)
- React
- TypeScript
- Three.js (for the 3D node globe)

## Project structure

- `pages/` – top-level pages:
  - `index.tsx` – Base / Touch Base (Bitcoin overview + price chart)
  - `education.tsx` – What is money section
  - `youtube.tsx` – YouTube playlists
  - `tools.tsx` – Exchanges, markets, news, apps, hardware wallets
  - `links.tsx` – Curated info links
  - `nodes.tsx` – 3D Bitcoin node globe
- `components/`
  - `Layout.tsx` – shared layout, header, navigation and page ribbon
  - `BitcoinNodeGlobe.tsx` – React component wrapping a Three.js globe
- `public/`
  - `node-globe-embed.html` – standalone HTML version of the globe for Wix embed
- `styles/`
  - `globals.css` – global layout, typography, buttons and responsive rules

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build & production

```bash
npm run build
npm start
```

## Deployment (Vercel)

1. Create a **GitHub repository** and push this project:
   - `git init`
   - `git add .`
   - `git commit -m "Initial Money Penny Next.js site"`
   - Create an empty GitHub repo and then:
     - `git remote add origin https://github.com/<user>/<repo>.git`
     - `git push -u origin main`
2. Go to [Vercel](https://vercel.com) and click **New Project**.
3. Import the GitHub repository.
4. Vercel will auto-detect **Next.js**:
   - Build command: `next build`
   - Output: `.next`
5. Deploy – your site will be live on a Vercel URL and optionally a custom domain (e.g. `moneypenny.li`).

### Environment variables

The current implementation only uses public APIs and does not require environment variables.  
If you later decide to use APIs that need keys, add them in:

- Vercel project → **Settings → Environment Variables**.

## 3D Bitcoin Node Globe

The globe is implemented in two ways:

1. **Next.js React component** – used on the `/nodes` page:
   - File: `components/BitcoinNodeGlobe.tsx`
   - Loaded client-side with `next/dynamic` (SSR disabled).
2. **Standalone HTML embed** – `public/node-globe-embed.html`
   - Includes all necessary HTML/CSS/JS and pulls Three.js from a CDN.
   - Tries to load live node positions from the Bitnodes API:
     - `https://bitnodes.io/api/v1/snapshots/latest/`
   - If the request fails (e.g. CORS, rate limit), it falls back to a small demo set of nodes.

### Using the embed in Wix

There are two common options:

#### Option A – IFrame to your Vercel deployment

1. Deploy this project to Vercel.
2. Find the public URL of the globe HTML file, for example:
   - `https://<your-vercel-project>.vercel.app/node-globe-embed`
3. In Wix:
   - Add → **Embed** → **Embed a site** (or Custom Embed / IFrame).
   - Paste the URL from step 2.
   - Adjust size so the globe is clearly visible (e.g. 600–800px height on desktop).

#### Option B – Upload HTML elsewhere and embed

If you prefer, you can host `node-globe-embed.html` on any static host (S3, GitHub Pages, etc.) and use the resulting URL in an Wix IFrame.

### Controls & behaviour

- Auto-rotation of the globe, which pauses while the user interacts and resumes afterwards.
- Mouse / touch drag to rotate.
- Mouse wheel / pinch to zoom (clamped to a sensible distance).
- Orange points: **Knots** nodes (visualised).
- Red points: **Core** nodes (visualised).
- If live data is not available, a fixed demo distribution is rendered.

## Differences vs. original Wix site

- Fonts are approximated using system fonts and a serif/sans-serif combination instead of the exact Wix fonts.
- The education table layout and button styling match the spirit of the design but are slightly simplified for maintainability.
- The node globe assigns node types (Core / Knots) randomly when using live data, because the upstream API does not distinguish them.


