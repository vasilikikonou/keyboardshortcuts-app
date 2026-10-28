# Keysmith

Keysmith is an open-source, browser-based field guide to keyboard shortcuts. It covers Windows, macOS, Linux, browsers, code editors, Microsoft 365, and Vim. Search by action, application, or key combination; filter by category and skill level; save favorites; practice; and print a filtered list.

The app is a static website. It has no Keysmith server, database, sign-in, API key, or Manus runtime dependency. Favorites, recently viewed shortcuts, and the selected platform stay in the visitor's own browser storage.

## Run it locally

Install **Node.js 20.9 or newer** and npm. From the project directory, install the lockfile dependencies and start Next.js:

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server supports hot reload.

Useful project commands:

```sh
npm test          # run the shortcut and navigation tests
npm run check     # run strict TypeScript checking
npm run build     # create the static site in ./out
npm run preview   # serve ./out locally at http://localhost:3000
```

Run `npm run build` before `npm run preview`. The preview command serves the production export, not the live development server.

## Run it with Docker

Docker Compose builds the site, then serves it with Nginx on port 8080:

```sh
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080). Stop the container with `Ctrl+C`; if it was started detached, run `docker compose down`.

To build and run the image without Compose:

```sh
docker build -t keysmith .
docker run --rm -p 8080:80 keysmith
```

The multi-stage Dockerfile installs the exact npm lockfile with `npm ci`, runs `next build`, and copies Next.js's `out/` static export into the Nginx image. This follows the same Node-builder-to-Nginx shape as the supplied Dockerfile, but the Next.js configuration now deliberately emits the `out/` folder that Nginx serves. No Node process is required in the production container.

You can also host the contents of `out/` on any static web server. The included Nginx configuration serves `/` and the exported assets; it does not depend on a platform-specific proxy.

## How it renders: SSG plus client hydration, not CSR-only

The project uses the **Next.js App Router**. `app/page.tsx` is a Server Component and identifies the home route. At build time, Next.js statically renders that route into HTML and writes it, its JavaScript, styles, fonts, and images to `out/`. The export can therefore show page content before browser JavaScript has loaded.

The interactive workspace in `src/components/KeysmithApp.tsx` is a React **Client Component** (`"use client"`). Next.js also prerenders Client Components to HTML during the build. In the browser, React hydrates that HTML; after hydration, searching, filtering, keyboard navigation, the quiz, and favorites run in the browser. This is not a blank-page, CSR-only SPA, and it does not use request-time server rendering in production. Nginx serves only static files.

All shortcut data is imported from checked-in JSON files and included at build time. There are no runtime data requests. The local-storage hook waits until after hydration to read browser-only APIs, avoiding `window`/`localStorage` access during the build and avoiding markup mismatches. Google fonts are downloaded by `next/font` at build time and bundled with the export; the app does not request them from Google at runtime.

Because the production output is static, adding features that require request-specific server code—such as user accounts, a live database, server actions, or personalized API responses—would require switching from `output: "export"` to a Next.js server deployment. The current shortcut library does not need those features.

## Project layout

```text
app/
  globals.css           Neo-brutalist design system and responsive layout
  layout.tsx            Document metadata, bundled fonts, global CSS
  page.tsx              Static home route
src/
  components/            Interactive workspace, dialogs, cards, keycaps, quiz
  data/                  Nine source-linked shortcut JSON collections + loader
  hooks/                 Hydration-safe local-storage hook
  lib/                   Shortcut types, search, ranking, and tests
public/
  favicon.svg
  manus-routes.json      Optional hosted-preview route metadata; ignored by app code
  THIRD_PARTY_NOTICES.md Font license notice copied into the static export
  images/                Exact original hero/practice WebP illustrations, kept local
Dockerfile               Node build stage + Nginx static runtime
nginx.conf                Static-file and cache rules
app.config.ts            Optional project-logo metadata; not imported by Next.js
```

The route manifest and `app.config.ts` serve hosted preview/branding only. They are not application dependencies and can be omitted when copying the project to an unrelated static host or repository.

## Add or update shortcuts

Edit the JSON file for the appropriate group in `src/data/` (`windows.json`, `macos.json`, `browsers.json`, `vscode.json`, and so on). A record includes its stable `id`, `title`, plain-language `description`, `category`, `app`, `level`, `task`, per-platform `keys`, and official `source` URL. Set `sequence: true` only when the keys are pressed in order rather than together. `src/data/index.ts` imports the collections explicitly; add any new collection there as well.

Run `npm test`, `npm run check`, and `npm run build` after changing data or components.

## License

The project is released under the MIT License; see [`LICENSE`](./LICENSE). Space Grotesk and IBM Plex Mono fonts keep their SIL Open Font License 1.1 terms; see [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md), which is also included in the static export. Shortcut details retain links to their cited documentation sources.

## Official Next.js documentation

- [Static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Installation and system requirements](https://nextjs.org/docs/app/getting-started/installation)
