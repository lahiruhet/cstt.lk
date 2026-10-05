# CS Tours and Transport Service landing page

A responsive, single-page website for **CS Tours and Transport Service**, focused on long-term vehicle hire, driver coordination and project/tender supply in Sri Lanka.

## Run locally

Requires Node.js 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
```

Build and check the production output:

```sh
npm run build
npm run verify
npm run preview
```

`npm run verify` checks the built site in headless Microsoft Edge on Windows. On other systems, install the test browser once with `npx playwright install chromium`. Set `BROWSER_CHANNEL` if you want to use a different installed Chromium browser channel. Verification includes responsive widths, navigation, fleet selection, form validation, automated WCAG A/AA checks and local screenshots in the ignored `work/` directory. Run `npm run format` to format source files.

The output is a static `dist/` directory. No application server, database, environment variables or API keys are required. Fonts and images are hosted locally. Vite is the build tool; the page itself is HTML, CSS and a small amount of JavaScript.

## Hosting

Push this repository to your Git provider, then connect it to your chosen host.

| Host               | Build command   | Output directory | Notes                                                                                         |
| ------------------ | --------------- | ---------------- | --------------------------------------------------------------------------------------------- |
| Cloudflare Pages   | `npm run build` | `dist`           | Use the Vite preset or no framework preset.                                                   |
| Vercel             | `npm run build` | `dist`           | Included `vercel.json` supplies these settings.                                               |
| Cloudflare Workers | `npm run build` | `dist`           | Included `wrangler.jsonc` configures static assets. Use `npx wrangler deploy` after building. |

Use Node 24 in the hosting project settings. The canonical URL, sitemap and sharing metadata use `https://cstt.lk/`. Connect the custom domain in your hosting dashboard when you are ready to replace the old site. Nothing has been published or pushed by this project setup.

References: [Vite deployment guide](https://vite.dev/guide/static-deploy), [Cloudflare static assets configuration](https://developers.cloudflare.com/workers/static-assets/binding/).

## Content and enquiries

- Main content, contact details and structured metadata: `index.html`.
- Brand colours, typography and responsive layouts: `src/style.css`.
- Navigation, fleet selection and enquiry email helper: `src/main.js`.
- Contact details supplied by the owner: **+94 112 337 887**, **info@cstt.lk**, **Level 5, East Tower, World Trade Center, Colombo 1**. Changes should also update the JSON-LD and email helper.
- Dialog, SLT and Mobitel are shown as clients based on the owner's brief, using their logos in `public/images/clients/`. These are copied from the CSTT supplier proposals, including the pre-2020 SLT and Mobitel marks (both now trade as SLTMobitel). RDA and NWSDB are not presented as existing clients.
- The enquiry form opens a prefilled email draft. It does **not** send or store enquiries. The visitor must send the draft in their email application. Phone and direct email links are also provided. If you later want automatic delivery, add a server-side endpoint or form provider.
- Fleet imagery is AI-generated and labelled illustrative; no specific vehicle model or availability is promised.

## Branding and imagery

Generated with the built-in **imagegen** tool. Original generated source files are retained for future reuse.

| Asset                       | Source / final file                                              |
| --------------------------- | ---------------------------------------------------------------- |
| Original logo reference     | `design/original-logo.png`                                       |
| Modernized transparent logo | `design/cstt-mark-source.png` → `public/images/cstt-mark.png`    |
| Fleet photograph            | `design/fleet-hero-source.png` → `public/images/fleet-hero.webp` |
| Favicon                     | `public/images/favicon.png`                                      |
| Social sharing card         | `public/og.png`                                                  |

Original generation prompts are recorded in `design/prompts.md`; the full-company-name update to the sharing card is recorded in `design/brand-update-prompt.md`. To regenerate optimized website exports from the saved source images:

```sh
node scripts/prepare-assets.mjs
```

Generated branding is a raster asset. The accompanying wordmark uses live text for clarity on the website. Lucide icons are ISC licensed; Manrope and DM Sans fonts use the SIL Open Font License, included in their installed packages.
