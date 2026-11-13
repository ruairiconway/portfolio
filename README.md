# Nuxt + Sveltia CMS template

A starter for static sites: [Nuxt 4](https://nuxt.com) for the frontend, [Nuxt Content](https://content.nuxt.com) to read Markdown/JSON, [Sveltia CMS](https://github.com/sveltia/sveltia-cms) as a Git-based editing UI, SCSS for styles, and [Netlify](https://www.netlify.com) for hosting.

There's no database or server at runtime. Editors change content in the CMS, the CMS commits it to GitHub, and Netlify rebuilds and redeploys the static site.

## Requirements

- Node.js 22.5+ (24 recommended, see `.nvmrc`). Nuxt Content uses Node's built-in SQLite.
- pnpm 11 (pinned through `packageManager`; run `corepack enable` once).

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm generate     # writes the static site to .output/public (dist/ on Netlify)
pnpm preview      # serves the generated site
pnpm typecheck
pnpm new block Quote  # scaffold a page block (see below)
```

## Project structure

The CMS config (`cms/`) and the styles (`app/assets/scss/`) mirror `app/`. Anything a page or component needs lives at the same path in each tree:

| | CMS fields | Vue | Styles |
|---|---|---|---|
| Layout shell | `cms/app.yml` | `app/app.vue` | `app/assets/scss/app.scss` |
| Pages | `cms/pages/[...slug].yml` | `app/pages/[...slug].vue` | – |
| Blog post | `cms/pages/blog/[slug].yml` | `app/pages/blog/[slug].vue` | – |
| Blog listing | – | `app/pages/blog/index.vue` | `app/assets/scss/pages/blog/index.scss` |
| Header | `cms/components/SiteHeader.yml` | `app/components/SiteHeader.vue` | `app/assets/scss/components/SiteHeader.scss` |
| A page block, e.g. Quote | `cms/components/blocks/Quote.yml` | `app/components/blocks/Quote.vue` | `app/assets/scss/components/blocks/Quote.scss` |
| A partial, e.g. CmsVideo | `cms/components/partials/CmsVideo.yml` | `app/components/partials/CmsVideo.vue` | `app/assets/scss/components/partials/CmsVideo.scss` |

```
cms/                      # Sveltia CMS config, split to mirror app/
  config.yml              # backend, media, sidebar order   (≈ nuxt.config.ts)
  app.yml                 # Site settings + SEO singletons  (≈ app/app.vue)
  pages/                  # one file per page that has CMS fields
  components/             # one file per component that has CMS fields
    blocks/               # one file per page block
    partials/             # shared fields with a matching component (CmsVideo.yml)
  fields/                 # shared fields used by several collections (seo.yml)
app/
  app.vue                 # layout shell, favicon, global SEO defaults
  components/
    AlertBanner.vue, SiteHeader.vue, SiteFooter.vue
    partials/             # reusable pieces, used by name (<CmsImage>, no prefix)
      BlockRenderer.vue   # renders a page's blocks
      CmsImage.vue        # renders any CMS image field (sizes, dimensions, lazy loading)
      CmsVideo.vue        # renders the video field (cms/components/partials/CmsVideo.yml)
    blocks/               # page blocks, e.g. Quote.vue -> <BlockQuote>. Example.vue is a placeholder
  composables/            # usePageSeo, useSiteSettings
  error.vue               # 404 / error page
  pages/
    [...slug].vue         # block-based pages from content/pages/*.md
    blog/index.vue        # post listing
    blog/[slug].vue       # posts from content/posts/*.md
  assets/scss/
    abstracts/            # variables + mixins only (no CSS output); auto-injected
    base/                 # :root tokens, reset
    main.scss             # global foundations
    app.scss              # styles for app.vue
    components/, pages/   # mirror app/components and app/pages
content/
  pages/                  # URL comes from each file's `path` (e.g. path: /about)
  posts/                  # hello-world.md -> /blog/hello-world
  navigation/             # "Navigation" collection in the CMS
    alert-banner.json     # site-wide announcement bar (off by default)
    header.json           # header links
    footer.json           # footer links + copyright text
  settings/               # global settings, each a CMS singleton
    site.json             # site name, logo, favicon
    seo.json              # SEO defaults: title separator, description, social image, noindex
content.config.ts         # Nuxt Content collections: sources here, schemas generated from cms/
modules/
  cms/                    # builds public/admin/config.yml and the #cms types from cms/
  prerender-content.ts    # prerenders every page and post, linked or not
public/
  admin/index.html        # Sveltia CMS app
  admin/config.yml        # GENERATED from cms/ (git-ignored), don't edit
  images/uploads/         # media uploaded through the CMS
netlify.toml              # Netlify build settings
```

### How the CMS config is built

`modules/cms/` builds `public/admin/config.yml` and the `#cms` TypeScript types from the files in `cms/`. It runs every time Nuxt starts (`pnpm dev`, `pnpm generate`, Netlify builds), and again whenever a file in `cms/` changes while `pnpm dev` is running.

- Each file outside `cms/components/blocks/` is part of a normal Sveltia config. They're merged together, starting with `config.yml`.
- Lists of named items (collections, singletons, files, fields) are merged by `name`. That's how three component files add Alert banner, Header and Footer to the one Navigation collection.
- `config.yml` lists the collections and singletons by name only, to set the sidebar order. Each one's fields come from its own file.
- Each file in `cms/components/blocks/` defines one block. The block's name comes from the filename (`PullQuote.yml` → `pull-quote`). The blocks fill any `types: '@blocks'` list.
- Each file in `cms/fields/` defines one shared field. An item like `- '@fields/seo'` in a fields list is replaced with `cms/fields/seo.yml`, so a field used by several collections is defined once. A reference to a file that doesn't exist fails the build.
- Each file in `cms/components/partials/` is also a shared field, one that has a matching component in `app/components/partials/` to render it. `- '@partials/CmsVideo'` is replaced with `cms/components/partials/CmsVideo.yml`, rendered by `<CmsVideo>`.
- If a collection or singleton listed in `config.yml` has no file defining it, the build fails, so a broken CMS config never gets deployed.

### Page URLs

Each page has a **URL path** field in the CMS, e.g. `/about`, `/services/design`, or `/` for the home page. It's saved as `path` in the page's frontmatter, and Nuxt Content uses it as the page's URL.

- The URL comes from the field, not the filename. Sveltia's sidebar Slug panel is turned off, and filenames are only set (from the title) when a page is created.
- The CMS rejects paths that aren't lowercase letters, numbers and hyphens starting with `/`, and paths already used by another page.
- Changing a page's path doesn't redirect the old URL. Update any links to it, such as in Navigation. The build fails if a link points to a page that no longer exists.

### Page and post SEO

Pages and blog posts have a collapsible **SEO** section in the CMS. It's defined once, in `cms/fields/seo.yml`, and saved under `seo:` in each entry's frontmatter. It has:

- **Meta title:** replaces the entry's title in search results and link previews, but not on the page itself. The site name is still added after it.
- **The global SEO fields:** title separator, meta description, social image, X/Twitter handle and "Hide from search engines".

Any field left blank uses the global value from the SEO singleton. For posts, the post's own Description is used before the global one.

"Hide from search engines" hides just that entry. If the global setting is on, every page stays hidden whatever the entry says.

In code, pass the overrides to `usePageSeo({ title, overrides: entry.seo })`.

### Generated types and schemas

Fields are defined once, in `cms/`. Everything else that describes them is generated:

| Generated | From | Used for |
|---|---|---|
| `public/admin/config.yml` | all of `cms/` | the Sveltia CMS |
| `#cms` types (`.nuxt/types/cms.d.ts`) | all of `cms/` | component props and helpers |
| Nuxt Content schemas | `cmsSchema()` in `content.config.ts` | `queryCollection()` results and defaults |

**`#cms` types**, imported with `import type { QuoteBlock } from '#cms'`:

| Type | For | Example |
|---|---|---|
| `<Name>Block` | each file in `cms/components/blocks/`, with `type` set to the block's name | `QuoteBlock` |
| `Block` | any block (a union of all of them) | |
| `<Name>Field` | each shared field in `cms/fields/` and `cms/components/partials/` | `SeoField`, `CmsVideoField` |
| `CmsImage` | every `image` field: `{ src, width, height }` | |
| `<Name>Entry` | one entry of a folder collection | `PagesEntry`, `PostsEntry` |
| `<Collection><File>File` | each file in a files collection | `NavigationHeaderFile` |
| `<Name>Singleton` | each singleton | `SiteSingleton`, `SeoSingleton` |

```ts
import type { QuoteBlock } from '#cms'

defineProps<{ block: QuoteBlock }>()
```

**Content schemas.** In `content.config.ts`, each collection sets its `source`, which says where the files are and how they're routed. Its schema comes from the CMS:

```ts
schema: cmsSchema({ collection: 'posts' }, { omit: ['body'] })
schema: cmsSchema({ collection: 'navigation', file: 'header' })
schema: cmsSchema({ singleton: 'site' })
```

On `type: 'page'` collections, `omit` drops fields Nuxt Content provides itself: `path` (the page URL) and `body` (the Markdown body). The result is that `queryCollection()` data is typed from the same fields the CMS edits, so `page.blocks` is a union of the real block shapes.

**Field types**
- Each field gets the type of the value Sveltia saves, with two exceptions, both transformed at build time (see Performance). A `markdown` field becomes an `MDCRoot` tree, rendered with `<MDCRenderer :body="…">`. An `image` field becomes a `CmsImage` (`{ src, width, height }`), rendered with `<CmsImage>`. For example, `select` becomes a union of its options, an image with `multiple: true` becomes `string[]`, and a list becomes an array of its fields.
- Optional fields are those with `required: false` or a `default`, plus booleans.
- In content schemas, a top-level field's `default` is filled in when a file leaves it out, and top-level lists default to `[]`.
- Labels and hints become doc comments.

**Staying in sync**
- Everything regenerates on `pnpm dev`, `pnpm generate` and `pnpm typecheck`.
- While `pnpm dev` is running, saving a change in `cms/` restarts the dev server to pick it up. A file with an error is reported in the terminal instead, and the server keeps running.
- If you rename or remove a field, `pnpm typecheck` flags every component still using the old name.

### Scaffolding: `pnpm new block`

`pnpm new block Quote` creates a block's three files at mirrored paths:

- `cms/components/blocks/Quote.yml`: its CMS fields, starting with a `heading` field
- `app/components/blocks/Quote.vue`: the component, typed with `QuoteBlock` from `#cms`, with its styles linked
- `app/assets/scss/components/blocks/Quote.scss`: its styles

Add `--dry-run` to list the files without writing them. Existing files are never overwritten. While `pnpm dev` is running it restarts automatically and picks up the new block. Otherwise the block is picked up on the next `pnpm dev` or `pnpm typecheck`.

### Adding a page block

`pnpm new block <Name>` does this for you. By hand, it's three files with the same name:

1. `cms/components/blocks/Quote.yml`: the block's CMS `label` and `fields`.
2. `app/components/blocks/Quote.vue`: takes a `block` prop typed with the generated `QuoteBlock` (`import type { QuoteBlock } from '#cms'`), and loads its styles with `<style lang="scss" scoped src="../../assets/scss/components/blocks/Quote.scss">`.
3. `app/assets/scss/components/blocks/Quote.scss`: its styles.

`Example` is an empty placeholder block: Sveltia won't load a list with no block types, so keep it until you've added a real block, then delete its three files.

The block then appears in the CMS block picker, under each page's **Page content** list, and `<BlockRenderer>` renders it on any page that uses it. Nothing needs registering. A page's blocks are saved as `blocks` in its frontmatter.

### Adding a content type

1. Add a `cms/` file at the path that mirrors its Vue page, e.g. `cms/pages/events/[slug].yml`, defining its fields. Add its `name` to the list in `cms/config.yml` to place it in the sidebar.
2. Add a collection in `content.config.ts` with its `source` and `schema: cmsSchema({ collection: 'events' })`.
3. Add the page under `app/pages/`. Call `usePageSeo({ title, description, image })` for its meta tags. Anything you leave out falls back to the SEO singleton. To give editors per-entry SEO overrides, add `- '@fields/seo'` to its CMS fields and pass `entry.seo` as `overrides`.
4. Add its content folder to `SOURCES` in `modules/prerender-content.ts` so every entry is prerendered, even ones nothing links to. Pages and posts are already covered.

### Styling (SCSS)

- `main.scss` (tokens and reset) and `app.scss` (the layout shell) are global. Each is listed in `css` in `nuxt.config.ts`.
- Every other Vue file keeps its styles at the mirrored path and loads them with `<style lang="scss" scoped src="...">`. Use a relative path: with the `~` alias, Nuxt can't inline the styles into the prerendered HTML.
- Everything in `abstracts/` is auto-injected into each SCSS file a Vue file loads, so `$gutter`, `@include up(md)` and the rest work without an import.
- Partials loaded with `@use` (like `base/`) don't get the injected abstracts (that's how Sass modules work). Begin each one with `@use '../abstracts' as *;`.
- Keep `abstracts/` free of anything that outputs CSS. It's injected into every component, so any CSS there would be duplicated in each one.
- Colours are CSS custom properties in `base/_root.scss` so dark mode can switch them at runtime.

### Smooth scrolling (Lenis)

[Lenis](https://github.com/darkroomengineering/lenis) smooths page scrolling across the whole site. It's set up through its Nuxt module (`lenis/nuxt` in `nuxt.config.ts`), with one root instance in `app/app.vue`.

- **Options:** `lenisOptions` in `app.vue`. `lerp` sets the smoothing (lower is smoother, `1` turns it off). Anchor links scroll smoothly, and scroll momentum stops when a link to another page is clicked.
- **Reduced motion:** visitors with "reduce motion" turned on get normal, unsmoothed scrolling.
- **Nested scrolling:** add `data-lenis-prevent` to any element with its own scrolling (a modal, a code block, a dropdown) so it scrolls normally.
- **In code:** use `useLenis()` in any component to get the instance or react to scroll, e.g. `useLenis((lenis) => console.log(lenis.scroll))`, or `lenis.value?.scrollTo('#contact')`.

### Animation (anime.js)

[anime.js](https://animejs.com) v4 handles animation inside components. The auto-imported `useAnime()` composable (`app/composables/useAnime.ts`) gives each component its own anime.js scope:

```vue
<script setup lang="ts">
import { animate, stagger } from 'animejs'

const root = useTemplateRef('root')
const scope = useAnime(root, (scope) => {
  if (scope.matches.reduceMotion) return
  animate('.card', { opacity: [0, 1], y: { from: '1rem' }, delay: stagger(80) })

  // Callable later, e.g. @click="scope?.methods.pulse()"
  scope.add('pulse', () => animate('.card', { scale: [1, 1.05, 1] }))
})
</script>

<template>
  <div ref="root">…</div>
</template>
```

- **Scoped:** selectors only match inside the component's root element, so `.card` won't hit another component's cards.
- **Reduced motion:** `scope.matches.reduceMotion` is true when the visitor prefers reduced motion. The setup re-runs automatically if that setting changes.
- **Cleanup:** animations stop and their inline styles are removed when the component unmounts.
- **SSR:** the setup runs only in the browser, after the component mounts.
- **Avoiding a flash:** content that animates in from hidden is visible in the prerendered HTML until the animation starts. To prevent that, hide it in the component's SCSS with `html.js` (added before first paint in `app.vue`) inside a `prefers-reduced-motion: no-preference` media query, and animate with explicit start and end values, e.g. `opacity: [0, 1]`. Without JavaScript or with reduced motion, it just shows.
- **Page transitions:** pages fade between each other using anime.js. The old page fades out, then the new one fades in while rising slightly. With reduced motion, pages swap instantly. It's defined in `app/utils/pageTransition.ts` and applied with `<NuxtPage :transition="pageTransition">` in `app.vue`. To use a different transition on one page, set `definePageMeta({ pageTransition: … })` in that page.
- **Scroll-linked animation:** anime.js's `onScroll()` should work alongside Lenis, because Lenis moves the page's normal scroll position rather than faking it.

### Images and video

**Uploads are processed in the browser.** `media_libraries` in `cms/config.yml` makes Sveltia process every upload before it's committed:
- JPEG, PNG and HEIC are converted to WebP at quality 82, at most 2560 px on the long side.
- SVGs are optimized.
- Uploads over 20 MB are rejected.
- Files get unique names (`photo-a1b2c3.webp`), so replacing an image never reuses a cached URL.

**Images are resized when they're served.** Render every CMS image field with `<CmsImage>`:

```vue
<CmsImage :image="block.image" :alt="block.imageAlt ?? ''" sizes="sm:100vw md:400px" priority />
```

- **Resizing:** [`@nuxt/image`](https://image.nuxt.com) offers each image in the widths `sizes` asks for, as WebP. On Netlify that's [Netlify Image CDN](https://docs.netlify.com/image-cdn/overview/), which resizes when an image is requested, so build time doesn't grow with the number of images. Locally, `pnpm dev` uses IPX and `pnpm generate` writes the variants into the output.
- **`sizes`:** the rendered width from each breakpoint up. Always prefix each size with a breakpoint (`sm:100vw`, not `100vw`), or `@nuxt/image` adds useless 1 px variants. The layout is at most about 704 px wide.
- **No layout shift:** image dimensions are read from the files at build time (`modules/cms/transform.ts`), so every image gets real `width` and `height` attributes and nothing moves as it loads.
- **`priority`:** use it for the main image at the top of the page, like a hero image or a post's cover. It loads eagerly at high priority. Everything else lazy-loads.
- **Alt text:** images that carry meaning have a description field next to them (`imageAlt`). An empty description marks an image as decorative.
- **SVGs** are used as-is.

**Video is hosted elsewhere, never uploaded.** Video files in git stay in its history permanently, and they can't stream at the right quality for each viewer. `cms/components/partials/CmsVideo.yml` is a shared field that takes:
- a YouTube or Vimeo link, or the embed URL from Mux, Cloudflare Stream or Bunny Stream
- a title for screen readers
- an optional poster image
- a shape (16:9, 4:3, 1:1 or 9:16)
- a caption

To add it to a block, put `- '@partials/CmsVideo'` in its fields, then render it:

```vue
<CmsVideo v-if="block.video?.url?.startsWith('https://')" :video="block.video" />
```

- **Click to play:** it shows the poster (or the YouTube thumbnail) with a play button, and loads the player only when it's pressed. Players are often 500 KB–1 MB of scripts.
- **Privacy:** YouTube is embedded from `youtube-nocookie.com`.

### Fonts

Fonts come only from your own files. [`@nuxt/fonts`](https://fonts.nuxt.com) is set up with every online provider switched off, so a font name never quietly loads from Google or anywhere else.

1. Put `.woff2` files in `app/assets/fonts/`, named `<Family>-<Weight>[-Italic].woff2`:
   ```
   BrandSans-Regular.woff2
   BrandSans-Bold.woff2
   BrandSans-BoldItalic.woff2
   BrandSans-Variable.woff2     # a variable font: one file for every weight
   ```
2. Use the family in SCSS. The site-wide font is `$font-sans` in `app/assets/scss/abstracts/_variables.scss`:
   ```scss
   $font-sans: 'BrandSans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
   ```

That's all. From the filenames, `@nuxt/fonts` writes the `@font-face` rules (with `font-display: swap`), preloads the main font, and adds fallback fonts adjusted to the same size, so text doesn't move when the font loads. The files are built into `/_nuxt/fonts/` with hashed names, so they're cached for a year.

- **Format:** WOFF2 only. Every browser supports it and it's the smallest.
- **Subset** fonts to the characters you need (e.g. Latin) with `pyftsubset` or `glyphhanger`. It often cuts the size by more than half.
- **Weights:** by default, weights 400 to 700 are loaded. To load others, set `fonts.defaults.weights` in `nuxt.config.ts`, e.g. `['300', '400', '700']` or `['100 900']` for a variable font's full range.
- **A missing file fails quietly:** text falls back to the system font, with no build error. If a font isn't showing, check that the filename starts with the family name you used in SCSS.

### Performance

The template is set up so the static site ships little JavaScript and the dev server avoids extra reloads.

**Static site**
- **Markdown is parsed at build time.** `modules/cms/transform.ts` parses every `markdown` field defined in `cms/` (in blocks, lists, objects or singletons) when Nuxt Content reads the file. Components render the result with `<MDCRenderer :body="…">`, so no Markdown parser ships to the browser. That's about 200 KB of gzipped JavaScript. Don't use `<MDC :value="…">` in components: it parses at runtime and brings the parser back.
- **Pages load prerendered data.** Every page is prerendered with its data in a `_payload.json`. Client-side navigation fetches only that file (1–5 KB), never Nuxt Content's in-browser SQLite database.
- **Caching:** hashed assets in `/_nuxt/` are served with a one-year immutable cache header (`netlify.toml`).
- **Images:** see [Images and video](#images-and-video).

**Dev**
- **Pre-bundled dependencies:** client dependencies that Vite would only discover on the first page load (currently `animejs`) are pre-bundled in `vite.optimizeDeps.include` in `nuxt.config.ts`. Otherwise the first visit after a cold start re-bundles and fully reloads the page. If the terminal ever shows "Vite discovered new dependencies at runtime", add the listed package there.
- **Stale content cache:** Nuxt Content caches parsed files in `.data/`. If content ever looks out of date after changing the build (for example, Markdown showing up unparsed), stop the dev server and delete `.data/`.

## Using the CMS

### Locally

1. Run `pnpm dev` and open http://localhost:3000/admin/.
2. Choose **Work with Local Repository** and select this project folder. This needs a Chromium-based browser.
3. Edits are written straight to `content/` on disk. Commit them as usual.

### In production

The CMS is at `https://<your-site>/admin/`. Editors log in with GitHub and need write access to the repo.

## Deploying to Netlify

1. Create a GitHub repo from this template, then update `cms/config.yml`:
   - `backend.repo` → `your-org/your-repo`
   - `site_url` / `display_url` → your Netlify URL
2. On Netlify, choose **Add new site → Import an existing project**, then pick the repo. Build settings come from `netlify.toml`:
   - Build command: `pnpm run generate`
   - Publish directory: `dist`. On Netlify, Nuxt writes the static site there instead of `.output/public`.
   - Node version: 24
   - No environment variables are needed. The site URL comes from Netlify's `URL` variable. To override it, set `NUXT_PUBLIC_SITE_URL`.
3. Set up CMS login through Netlify's GitHub OAuth provider:
   1. On GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**.
      - Homepage URL: your site URL
      - Authorization callback URL: `https://api.netlify.com/auth/done`
   2. On Netlify, go to **Project configuration → Access & security → OAuth → Install provider**. Choose GitHub and paste the Client ID and Secret.
4. Open `https://<your-site>/admin/` and log in with GitHub.

> Sveltia CMS doesn't support Netlify Identity or Git Gateway. Use the GitHub OAuth flow above, or a [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) worker with `backend.base_url` set to it.

Each CMS save is a commit to `main`, and each commit triggers a Netlify build. Builds take a few seconds to a minute.

## Notes

- pnpm is the only supported package manager. A `preinstall` check makes `npm install` and `yarn` fail with a message, so a second lockfile never gets created.
- `pnpm-workspace.yaml` allows build scripts for `esbuild` and `@parcel/watcher`. pnpm blocks dependency build scripts by default.
- TypeScript is pinned to 5.x because `vue-tsc` doesn't support TypeScript 7 yet.
- `public/admin/index.html` loads the latest Sveltia CMS from unpkg, which is what the Sveltia docs recommend. To pin a version, use `@sveltia/cms@<version>`.
