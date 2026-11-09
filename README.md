# Keysmith

Keysmith is an open-source, browser-based field guide to keyboard shortcuts. It covers Windows, macOS, Linux, browsers, code editors, Microsoft 365, and Vim. Search by action, application, or key combination; filter by category and skill level; save favorites; practice; and print a filtered list.

The app is a static website. It has no Keysmith server, database, sign-in, API key runtime dependency. Favorites, recently viewed shortcuts, and the selected platform stay in the visitor's own browser storage.

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