# MediNova Healthcare

> Smart Healthcare. Simple. Secure.

A premium, dark-luxury healthcare web application built with **vanilla JavaScript (ES Modules)** — no frameworks, no build step. It ships with a full **user panel**, an **admin panel**, a global **error console**, and **PWA** support, and deploys to **GitHub Pages**.

## Highlights

- **Dark Luxury UI** — `#070a14` base, violet `#8b5cf6` accents, glass panels, Sora + Inter type, Font Awesome icons.
- **Hash router** with layouts, guards, 404 fallback and `mn-*` light-DOM custom elements.
- **Demo mode** — all data lives under `app/data/mock/` and is seeded into `localStorage`. Swap to a real API by pointing `ApiService` at a backend (`MOCK_MODE`).
- **Global error console** — every uncaught error is captured (`ErrorManager`), rendered as toasts, and reviewable in the admin *Error Console* (search, filter, JSON/CSV export, clear).
- **PWA** — web manifest, service worker (network-first shell), generated app icons.
- **Theme** — dark/light with accent picker, persisted.
- **Zero dependencies in the app** — the only dev dependency is `happy-dom` for boot smoke tests.

## Demo Accounts

| Role    | Email                  | Password   |
| ------- | ---------------------- | ---------- |
| Patient | `patient@medinova.app` | `Patient@123` |
| Doctor  | `doctor@medinova.app`  | `Doctor@123`  |
| Admin   | `admin@medinova.app`   | `Admin@123`   |

## Run Locally

Any static file server works — no build step.

```bash
npx serve .
```

Then open `http://localhost:3000`.

## Testing

```bash
npm install   # dev dependency: happy-dom
npm test      # syntax + imports + data integrity + boot smoke test
```

- `npm run test:syntax` — real ESM parse of every `app/**` file.
- `npm run test:imports` — verifies every static import resolves.
- `npm run test:data` — mock seed-data integrity checks.
- `node tests/boot.mjs` — happy-dom integration smoke test (seed, login, routes, error capture).

## Project Structure

```
├── app/
│   ├── main.js              # boot entry
│   ├── config/              # app config
│   ├── core/                # router, element base, events, state
│   ├── errors/              # ErrorManager, ErrorStore, toasts
│   ├── services/            # ApiService, AuthService, cart, theme, data services
│   ├── data/                # db.js, seed.js, mock/ fixtures
│   ├── routes/              # public, user, admin route tables
│   └── views/               # public, user, admin, shared views
├── assets/                  # logo SVGs + generated PNG icons
├── styles/                  # tokenized CSS
├── scripts/                 # validation + icon generation
└── tests/                   # node test suites
```

## Deployment (GitHub Pages)

1. Push this repo to GitHub (`https://github.com/<user>/medinova-healthcare`).
2. The included workflow `.github/workflows/pages.yml` builds, tests, and deploys automatically on `push` to `main`/`master`.
3. In **Settings → Pages**, the site is published from GitHub Actions. Live URL:
   `https://<user>.github.io/medinova-healthcare/`

> Because the app uses a **hash router** (`#/...`), no server rewrite rules are needed — it works from any static host or subpath.

## Regenerating Icons

App icons are generated with a pure-Node script (no image tools required):

```bash
node scripts/gen-icons.mjs
```

## License

MIT — see [LICENSE](LICENSE).
