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
| Layout shell | `cms/app.ts` | `app/app.vue` | `app/assets/scss/app.scss` |
| Pages | `cms/pages/[...slug].ts` | `app/pages/[...slug].vue` | – |
| Header | `cms/components/SiteHeader.ts` | `app/components/SiteHeader.vue` | `app/assets/scss/components/SiteHeader.scss` |
| A page block, e.g. Quote | `cms/components/blocks/Quote.ts` | `app/components/blocks/Quote.vue` | `app/assets/scss/components/blocks/Quote.scss` |
| A partial, e.g. CmsVideo | `cms/components/partials/CmsVideo.ts` | `app/components/partials/CmsVideo.vue` | `app/assets/scss/components/partials/CmsVideo.scss` |

```
cms/                      # Sveltia CMS config, split to mirror app/
  config.ts               # backend, media, sidebar order   (≈ nuxt.config.ts)
  app.ts                  # Site settings + SEO singletons  (≈ app/app.vue)
  pages/                  # one file per page that has CMS fields
  components/             # one file per component that has CMS fields
    blocks/               # one file per page block
    partials/             # shared fields and rich text embeds, each with a matching component
  fields/                 # shared fields used by several collections (seo.ts)
app/
  app.vue                 # layout shell, favicon, global SEO defaults
  components/
    AlertBanner.vue, SiteHeader.vue, SiteFooter.vue
    partials/             # reusable pieces, used by name (<CmsImage>, no prefix)
      BlockRenderer.vue   # renders a page's blocks
      CmsImage.vue        # renders any CMS image field (sizes, dimensions, lazy loading)
      CmsRichText.vue     # renders rich text / Markdown fields, with text styles
      CmsVideo.vue        # renders the video field (cms/components/partials/CmsVideo.ts)
    blocks/               # page blocks, e.g. Quote.vue -> <BlockQuote>. Example.vue is a placeholder
  composables/            # usePageSeo, useSiteSettings
  error.vue               # 404 / error page
  pages/
    [...slug].vue         # block-based pages from content/pages/*.md
  assets/scss/
    abstracts/            # variables, mixins, functions (no CSS output); auto-injected
    base/                 # :root tokens, reset
    main.scss             # global foundations
    app.scss              # styles for app.vue
    components/, pages/   # mirror app/components and app/pages
content/
  pages/                  # URL comes from each file's `path` (e.g. path: /about)
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
    define.ts             # defineCms, defineBlock, defineField, defineEmbed: typed helpers for cms/ files
    embeds.ts             # rich text embeds: the Sveltia editor components and how they render
  prerender-content.ts    # prerenders every page and post, linked or not
public/
  admin/index.html        # Sveltia CMS app
  admin/config.yml        # GENERATED from cms/ (git-ignored), don't edit
  admin/editor-components.js  # GENERATED rich text embeds for Sveltia (git-ignored)
  images/uploads/         # media uploaded through the CMS
netlify.toml              # Netlify build settings
```

### How the CMS config is built

`modules/cms/` builds `public/admin/config.yml` and the `#cms` TypeScript types from the files in `cms/`. It runs every time Nuxt starts (`pnpm dev`, `pnpm generate`, Netlify builds), and again whenever a file in `cms/` changes while `pnpm dev` is running.

Each file in `cms/` is TypeScript and default-exports its part of the config through a typed helper from `modules/cms/define.ts`:

```ts
// cms/components/blocks/Quote.ts
import { defineBlock } from '../../../modules/cms/define'

export default defineBlock({
  label: 'Quote',
  fields: [
    { name: 'text', label: 'Quote', widget: 'text' },
    { name: 'author', label: 'Author', widget: 'string', required: false },
  ],
})
```

| Helper | Used in | Defines |
|---|---|---|
| `defineCms()` | `config.ts`, `app.ts`, `pages/…`, `components/SiteHeader.ts`… | a piece of the Sveltia config |
| `defineBlock()` | `components/blocks/<Name>.ts` | a page block |
| `defineField()` | `fields/<name>.ts`, `components/partials/<Name>.ts` | a shared field |
| `blocks` | a list field's `types` | every page block |

- **Checked as you type:** options are checked against Sveltia's own types, from `@sveltia/cms`. A misspelt option, an unknown widget or a wrong value type is underlined in your editor and fails `pnpm typecheck`, at any depth: fields inside objects, lists and blocks too. Only Sveltia's built-in widgets are allowed.
- **Merging:** the files that aren't blocks or shared fields are merged together, starting with `config.ts`. Lists of named items (collections, singletons, files, fields) are merged by `name`. That's how three component files add Alert banner, Header and Footer to the one Navigation collection.
- **Sidebar order:** `config.ts` lists the collections and singletons by name only. Each one's fields come from its own file.
- **Blocks:** each file in `cms/components/blocks/` defines one block. Its name comes from the filename (`PullQuote.ts` → `pull-quote`). Every block fills any list with `types: blocks`.
- **Shared fields:** each file in `cms/fields/` defines a field used in several places. Import it and put it in a fields list, e.g. `import seo from '../fields/seo'` then `fields: [..., seo]`. Files in `cms/components/partials/` are shared fields too, each with a matching component in `app/components/partials/` to render it (`CmsVideo.ts` → `<CmsVideo>`). Their generated types are named after the file (`SeoField`, `CmsVideoField`).
- **Plain data only:** each file must export plain data (no functions), because the result is written out as YAML for Sveltia.
- **Broken configs fail the build:** if a collection or singleton listed in `config.ts` has no file defining it, or a file can't be loaded, the build fails with the file's name. A broken CMS config never gets deployed.

### Page URLs

Each page has a **URL path** field in the CMS, e.g. `/about`, `/services/design`, or `/` for the home page. It's saved as `path` in the page's frontmatter, and Nuxt Content uses it as the page's URL.

- The URL comes from the field, not the filename. Sveltia's sidebar Slug panel is turned off, and filenames are only set (from the title) when a page is created.
- The CMS rejects paths that aren't lowercase letters, numbers and hyphens starting with `/`, and paths already used by another page.
- Changing a page's path doesn't redirect the old URL. Update any links to it, such as in Navigation. The build fails if a link points to a page that no longer exists.

### Page SEO

Pages have a collapsible **SEO** section in the CMS. It's defined once, in `cms/fields/seo.ts`, and saved under `seo:` in each entry's frontmatter. It has:

- **Meta title:** replaces the entry's title in search results and link previews, but not on the page itself. The site name is still added after it.
- **The global SEO fields:** title separator, meta description, social image, X/Twitter handle and "Hide from search engines".

Any field left blank uses the global value from the SEO singleton.

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
| `<Name>Field` | each shared field in `cms/fields/` and `cms/components/partials/` | `SeoField`, `CmsImageField`, `CmsVideoField`, `CmsButtonField` |
| `CmsImage` | every `image` field: `{ src, width, height }` | |
| `<Name>Entry` | one entry of a folder collection | `PagesEntry` |
| `<Collection><File>File` | each file in a files collection | `NavigationHeaderFile` |
| `<Name>Singleton` | each singleton | `SiteSingleton`, `SeoSingleton` |

```ts
import type { QuoteBlock } from '#cms'

defineProps<{ block: QuoteBlock }>()
```

**Content schemas.** In `content.config.ts`, each collection sets its `source`, which says where the files are and how they're routed. Its schema comes from the CMS:

```ts
schema: cmsSchema({ collection: 'pages' }, { omit: ['path'] })
schema: cmsSchema({ collection: 'navigation', file: 'header' })
schema: cmsSchema({ singleton: 'site' })
```

On `type: 'page'` collections, `omit` drops fields Nuxt Content provides itself: `path` (the page URL) and `body` (the Markdown body). The result is that `queryCollection()` data is typed from the same fields the CMS edits, so `page.blocks` is a union of the real block shapes.

**Field types**
- Each field gets the type of the value Sveltia saves, with two exceptions, both transformed at build time (see Performance). A `markdown` or `richtext` field becomes an `MDCRoot` tree, rendered with `<CmsRichText :body="…">`. An `image` field becomes a `CmsImage` (`{ src, width, height }`), rendered with `<CmsImage>`. For example, `select` becomes a union of its options, an image with `multiple: true` becomes `string[]`, and a list becomes an array of its fields.
- Optional fields are those with `required: false` or a `default`, plus booleans.
- In content schemas, a top-level field's `default` is filled in when a file leaves it out, and top-level lists default to `[]`.
- Labels and hints become doc comments.

**Staying in sync**
- Everything regenerates on `pnpm dev`, `pnpm generate` and `pnpm typecheck`.
- While `pnpm dev` is running, saving a change in `cms/` restarts the dev server to pick it up. A file with an error is reported in the terminal instead, and the server keeps running.
- If you rename or remove a field, `pnpm typecheck` flags every component still using the old name.

### Scaffolding: `pnpm new block`

`pnpm new block Quote` creates a block's three files at mirrored paths:

- `cms/components/blocks/Quote.ts`: its CMS fields, starting with a `heading` field
- `app/components/blocks/Quote.vue`: the component, typed with `QuoteBlock` from `#cms`, with its styles linked
- `app/assets/scss/components/blocks/Quote.scss`: its styles

Add `--dry-run` to list the files without writing them. Existing files are never overwritten. While `pnpm dev` is running it restarts automatically and picks up the new block. Otherwise the block is picked up on the next `pnpm dev` or `pnpm typecheck`.

### Adding a page block

`pnpm new block <Name>` does this for you. By hand, it's three files with the same name:

1. `cms/components/blocks/Quote.ts`: the block's CMS `label` and `fields`, with `export default defineBlock({ … })`.
2. `app/components/blocks/Quote.vue`: takes a `block` prop typed with the generated `QuoteBlock` (`import type { QuoteBlock } from '#cms'`), and loads its styles with `<style lang="scss" scoped src="../../assets/scss/components/blocks/Quote.scss">`.
3. `app/assets/scss/components/blocks/Quote.scss`: its styles.

`Example` is an empty placeholder block: Sveltia won't load a list with no block types, so keep it until you've added a real block, then delete its three files.

The block then appears in the CMS block picker, under each page's **Page content** list, and `<BlockRenderer>` renders it on any page that uses it. Nothing needs registering. A page's blocks are saved as `blocks` in its frontmatter.

**Anchor IDs.** Every block automatically gets an optional **Anchor ID** field (`cms/fields/anchorId.ts`, typed `anchorId?: string`). `<BlockRenderer>` sets it as the `id` of the block's root element, so `/about#team` scrolls to that block, and a button's **Anchor** can point at it. Give each block a single root element (like the `<section>` that `pnpm new block` creates) so the `id` has somewhere to go. To add other fields to every block, list their files in `BLOCK_FIELDS` in `modules/cms/build.ts`.

### Adding a content type

1. Add a `cms/` file at the path that mirrors its Vue page, e.g. `cms/pages/events/[slug].ts`, exporting `defineCms({ collections: [...] })`. Add its `name` to the list in `cms/config.ts` to place it in the sidebar.
2. Add a collection in `content.config.ts` with its `source` and `schema: cmsSchema({ collection: 'events' })`.
3. Add the page under `app/pages/`. Call `usePageSeo({ title, description, image })` for its meta tags. Anything you leave out falls back to the SEO singleton. To give editors per-entry SEO overrides, import `cms/fields/seo.ts` and add it to its CMS fields and pass `entry.seo` as `overrides`.
4. Add its content folder to `SOURCES` in `modules/prerender-content.ts` so every entry is prerendered, even ones nothing links to. Pages are already covered.

### Styling (SCSS)

- `main.scss` (tokens and reset) and `app.scss` (the layout shell) are global. Each is listed in `css` in `nuxt.config.ts`.
- Every other Vue file keeps its styles at the mirrored path and loads them with `<style lang="scss" scoped src="...">`. Use a relative path: with the `~` alias, Nuxt can't inline the styles into the prerendered HTML.
- Everything in `abstracts/` is auto-injected into each SCSS file a Vue file loads, so `$grid-gutter`, `@include mq(tablet)` and the rest work without an import.
- Partials loaded with `@use` (like `base/`) don't get the injected abstracts (that's how Sass modules work). Begin each one with `@use '../abstracts' as *;`.
- Keep `abstracts/` free of anything that outputs CSS. It's injected into every component, so any CSS there would be duplicated in each one.
- **Colours** are defined in `$colors` in `abstracts/_variables.scss`, with dark mode values in `$colors-dark`. Use them with `clr(name, opacity)`, where the opacity is optional (0–1 or a percentage):
  ```scss
  color: clr(fg);
  background: clr(black, 0.6);
  ```
  Each colour becomes a CSS custom property (`--color-fg`), so dark mode switches it in the browser, and `clr()` returns that property. With an opacity, it uses `color-mix()`, so see-through colours switch in dark mode too. An unknown colour name fails the build and lists the valid ones.

**Layout grid.** The grid's settings are in `abstracts/_variables.scss`: `$grid-columns` (8), `$grid-columns-mobile` (4, below `$grid-breakpoint`), `$grid-gutter` and `$grid-outer-gutter`. Breakpoints are `phone` (480px), `tablet` (768px), `desktop` (1024px) and `max` (1800px), in `$breakpoints`. `@nuxt/image` uses the same names in `sizes` (`image.screens` in `nuxt.config.ts`). Size things to the grid with `width($columns, $grid-gutters, $outer-gutters: 0)`:

```scss
.card {
  width: width(3, 2); // 3 columns and the 2 gutters between them
  margin-left: width(1, 1, 1); // start at column 2: the page edge, one column and a gutter
}
```

- **Works with any property:** it returns a `calc()`, so it works for `width`, margins, `max-width`, `translate` and so on.
- **Follows the breakpoint:** it reads `--grid-*` custom properties that switch from 4 to 8 columns at `$grid-breakpoint`. For a different span at each size, use it in `@include mq(...)`.
- **Sized from the viewport (`100svw`):** use it on elements laid out on the page grid, not inside narrower containers. On systems with always-visible scrollbars (e.g. Windows), `100svw` includes the scrollbar, so spans run a few pixels wider than the visible grid.
- **DevGrid:** press `|` in `pnpm dev` to show the column overlay (`partials/DevGrid.vue`). It reads the same settings.

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

**Uploads are processed in the browser.** `media_libraries` in `cms/config.ts` makes Sveltia process every upload before it's committed:
- JPEG, PNG and HEIC are converted to WebP at quality 82, at most 2560 px on the long side.
- SVGs are optimized.
- Uploads over 20 MB are rejected.
- Files get unique names (`photo-a1b2c3.webp`), so replacing an image never reuses a cached URL.

**Images are resized when they're served.** For an image in a block, use the shared field `cms/components/partials/CmsImage.ts`. It holds the image and its description, and its field names match `<CmsImage>`'s props, so `v-bind` passes them straight through:

```ts
import image from '../partials/CmsImage'
fields: [..., image] // saved as image: { image, alt }
```

```vue
<CmsImage v-bind="block.image" sizes="phone:100vw tablet:400px" priority />
```

A plain `widget: 'image'` field works too (like a post's cover): `<CmsImage :image="post.image" :alt="post.imageAlt" />`.

- **Resizing:** [`@nuxt/image`](https://image.nuxt.com) offers each image in the widths `sizes` asks for, as WebP. On Netlify that's [Netlify Image CDN](https://docs.netlify.com/image-cdn/overview/), which resizes when an image is requested, so build time doesn't grow with the number of images. Locally, `pnpm dev` uses IPX and `pnpm generate` writes the variants into the output.
- **`sizes`:** the rendered width from each breakpoint up. Always prefix each size with a breakpoint (`phone:100vw`, not `100vw`), or `@nuxt/image` adds useless 1 px variants. The layout is at most about 704 px wide.
- **No layout shift:** image dimensions are read from the files at build time (`modules/cms/transform.ts`), so every image gets real `width` and `height` attributes and nothing moves as it loads.
- **`priority`:** use it for the main image at the top of the page, like a hero image. It loads eagerly at high priority. Everything else lazy-loads.
- **Alt text:** every image has a description field: `alt` in the shared field. An empty description, or none, marks an image as decorative (`alt=""`).
- **SVGs** are used as-is.

**Video is hosted elsewhere, never uploaded.** Video files in git stay in its history permanently, and they can't stream at the right quality for each viewer. `cms/components/partials/CmsVideo.ts` is a shared field that takes:
- a YouTube or Vimeo link, or the embed URL from Mux, Cloudflare Stream or Bunny Stream
- a title for screen readers
- an optional poster image
- a shape (16:9, 4:3, 1:1 or 9:16)
- a caption

To add it to a block, import it and add it to the block's fields (`import video from '../partials/CmsVideo'`, then `fields: [..., video]`), then render it:

```vue
<CmsVideo v-if="block.video?.url?.startsWith('https://')" :video="block.video" />
```

- **Click to play:** it shows the poster (or the YouTube thumbnail) with a play button, and loads the player only when it's pressed. Players are often 500 KB–1 MB of scripts.
- **Privacy:** YouTube is embedded from `youtube-nocookie.com`.

### Rich text

`cms/components/partials/CmsRichText.ts` is a shared rich text field: Sveltia's editor with headings, bold, italic, links, lists, quotes, tables and dividers. Add it to a block and render it:

```ts
import richText from '../partials/CmsRichText'

fields: [richText] // saved as `body`
```

```vue
<CmsRichText :body="block.body" />
```

- **Parsed at build time:** it's saved as Markdown and parsed when the site is built, so no Markdown parser is sent to the browser. Keep `format: 'markdown'`. With `'html'`, it would be saved as an HTML string and not parsed.
- **Styles:** `<CmsRichText>` styles the formatted text (spacing, headings, links, lists, quotes, code, tables) in `app/assets/scss/components/partials/CmsRichText.scss`. It renders nothing when the field is empty. Set `tag` to change the wrapping element (a `div` by default).
- **Images and videos:** editors insert them with **Insert → Image** or **Insert → Video**. These are embeds, rendered with `<CmsImage>` and `<CmsVideo>` (see below). Sveltia's own image component is turned off, because it would skip the resizing and fixed dimensions.
- **Several in one block:** give each its own name, e.g. `{ ...richText, name: 'intro', label: 'Intro' }`.
- **Other fields:** `<CmsRichText>` renders any `markdown` or `richtext` field, not just this one.

**Embeds: partials inside rich text.** Any partial can be inserted into rich text. `CmsImage`, `CmsVideo` and `CmsButton` are set up this way. To add another, e.g. a `CmsQuote` partial:

1. Make the partial, `app/components/partials/CmsQuote.vue`, with the props it needs (e.g. `text` and `author`).
2. In `cms/components/partials/CmsQuote.ts`, export an embed whose field names match those props:
   ```ts
   import { defineEmbed } from '../../../modules/cms/define'

   export const embed = defineEmbed({
     label: 'Quote',
     icon: 'format_quote',
     mode: 'dialog', // a compact placeholder in the text; click to edit
     summary: '{{text}}',
     fields: [
       { name: 'text', label: 'Quote', widget: 'text' },
       { name: 'author', label: 'Author', widget: 'string', required: false },
     ],
   })
   ```

It then appears under **Insert** in every rich text field whose `editor_components` includes `embeds`, as `CmsRichText.ts` does. `<CmsRichText>` renders it with `<CmsQuote>`, which is loaded only on pages that use it.

How it works (`modules/cms/embeds.ts`):
- **Admin:** the build generates `public/admin/editor-components.js`, which registers each embed with Sveltia. `public/admin/index.html` loads it.
- **Saving:** an embed is saved in the Markdown as an MDC component, e.g. `::cms-image{image="/images/uploads/photo.webp" alt="A photo"}`, closed by `::` on the next line. Values are HTML-escaped. Objects (like the video) are saved as JSON.
- **Building:** when the site is built, each embed's values become the partial's props, typed by its fields. Image fields become `CmsImage` objects with their dimensions, the same as image fields elsewhere. Text fields left empty become `''`.
- **Missing partial:** an embed without a matching `.vue` partial fails the build.
- **Field and embed together:** a partial's `cms/` file can export both a field (default export) and an `embed`, like `CmsImage.ts` and `CmsVideo.ts`, or only one of them. Define the fields once and use them for both, as `CmsImage.ts` does.

### Buttons

`cms/components/partials/CmsButton.ts` is a button, as a field and as a rich text embed (**Insert → Button**). Editors set:

- **Button text.**
- **Link:** choose **Site page**, then pick a page from Pages and optionally add an anchor: a block's Anchor ID (`pricing` for `#pricing`) or a rich text heading. With an anchor and no page, it jumps to that section of the current page. Or choose **External URL**: `https://…`, `mailto:` or `tel:`.
- **Open in a new tab:** adds `target="_blank"` and `rel="noopener noreferrer"`, and tells screen readers it opens a new tab.

```ts
import button from '../partials/CmsButton'
fields: [..., button]
```

```vue
<CmsButton v-bind="block.button" />
```

It renders nothing without text and a link. Styles are in `app/assets/scss/components/partials/CmsButton.scss`. The page picker lists the Pages collection.

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
- **Markdown is parsed at build time.** `modules/cms/transform.ts` parses every `markdown` and `richtext` field defined in `cms/` (in blocks, lists, objects or singletons) when Nuxt Content reads the file. Components render the result with `<CmsRichText :body="…">`, so no Markdown parser ships to the browser. That's about 200 KB of gzipped JavaScript. Don't use `<MDC :value="…">` in components: it parses at runtime and brings the parser back.
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

1. Create a GitHub repo from this template, then update `cms/config.ts`:
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
