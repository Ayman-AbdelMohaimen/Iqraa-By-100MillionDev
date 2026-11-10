# Iqraa By 100MillionDev

Custom Salla store theme for **منصة اقرأ (Iqraa Platform)** — e-ink reading devices (BOOX) storefront.

> Based on the official open-source starter theme [SallaApp/theme-raed](https://github.com/SallaApp/theme-raed) (v1.358.0 baseline).

## Stack

- Salla Twilight Theme Engine (Twig templates + web components)
- Tailwind CSS 3 (mobile-first, RTL-first with logical properties)
- SCSS layered per project structure (`src/assets/styles/`)
- Webpack 5 build, pnpm workspaces
- Node ^22.18 || >=24.11

## Development

```bash
pnpm install          # install dependencies
salla theme preview   # build + deploy to temporary preview URL (hot reload)
```

## Release

```bash
salla theme publish   # submit theme for review/publishing approval
```

## Structure

```text
twilight.json              # theme metadata + settings schema
src/views/layouts/         # master layout
src/views/pages/           # pages (index, product, blog, ...)
src/views/components/      # reusable partials (header, footer, home widgets)
src/assets/js/             # client scripts + Salla event listeners
src/assets/styles/         # SCSS entry (01-settings → 05-utilities)
src/locales/               # ar.json / en.json
```

## Guidelines

- Never break core Twilight web components (`salla-product-card`, `salla-cart-summary`, `salla-checkout`, ...).
- Mobile-first: base styles target 375px; breakpoints at `sm 640 / md 768 / lg 1024 / xl 1280`.
- RTL-first: use logical properties (`ms-`, `me-`, `start-`, `end-`).
- One task per commit (`feat(header): ...`), always verified on preview before commit.
