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
   - Reads cached data from `public/data/bitnodes-cache.json` and displays metadata below the globe.
2. **Standalone HTML embed** – `public/node-globe-embed.html`
   - Includes all necessary HTML/CSS/JS and pulls Three.js from a CDN (no build step required).
   - Loads the same cached JSON via `/data/bitnodes-cache.json`. You can override the source without rebuilding by appending `?dataUrl=https://example.com/my-nodes.json` to the IFrame URL.
   - Falls back to a small demo distribution if the cache cannot be loaded.

### Updating the cached node data

Bitnodes limits anonymous API access (~30 requests/day), so the globe ships with a pre-generated snapshot. To refresh it:

```bash
# optional: tweak how many nodes to keep and the throttle delay
MAX_NODES=150 REQUEST_DELAY_MS=2500 npm run fetch:nodes
```

The script (`scripts/update-node-cache.js`) will:

1. Download the latest reachable node snapshot from Bitnodes.
2. Resolve geolocation data for public IPv4 addresses (skipping `.onion` and IPv6 entries).
3. Save the result to `public/data/bitnodes-cache.json` together with metadata (`updatedAt`, `totalNodes`).

Tips:

- Start with small batches (e.g. `MAX_NODES=100`) to stay within the daily limit. If you have a Bitnodes PRO key or run the crawler yourself you can bump both values.
- Commit the updated JSON if you want Vercel deployments to pick it up automatically.
- The standalone embed will read whichever cache the site serves; no extra steps are needed for Wix once you redeploy.

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
- If the cache fails to load, a small demo distribution is rendered.

## Differences vs. original Wix site

- Fonts are approximated using system fonts and a serif/sans-serif combination instead of the exact Wix fonts.
- The education table layout and button styling match the spirit of the design but are slightly simplified for maintainability.
- Knot/Core colouring is derived from the Bitnodes user-agent string (`/Knots` vs `/Satoshi`). Nodes without that hint default to **Core**.


