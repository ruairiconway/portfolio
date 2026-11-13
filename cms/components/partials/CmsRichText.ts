// Shared field: formatted text (headings, bold, links, lists, quotes…), edited
// in Sveltia's rich text editor. Render it with <CmsRichText :body="block.body">.
// Type: CmsRichTextField from '#cms'. Mirrors app/components/partials/CmsRichText.vue.
//
// It's saved as Markdown and parsed at build time (modules/cms/transform.ts), so
// the browser gets a ready-made tree and no Markdown parser.
//
// Use a preset:
//
//   import richText, { simpleRichText } from '../partials/CmsRichText'
//   fields: [..., richText]                 // everything
//   fields: [..., simpleRichText]           // bold, italic, links only
//
// or build your own, picking the buttons and embeds:
//
//   import { defineRichText } from '../partials/CmsRichText'
//   fields: [..., defineRichText({ name: 'intro', label: 'Intro', buttons: ['bold', 'link'], embeds: ['cms-image'] })]
//
// A preset can be renamed too: { ...simpleRichText, name: 'intro', label: 'Intro' }
// Add new presets at the bottom of this file. Only the default export is read
// by the build; the named ones are plain imports.
import type { RichTextEditorButtonName } from "@sveltia/cms";
import { defineField, embeds as allEmbeds } from "../../../modules/cms/define";

/**
 * What can go in `embeds`: a partial with an `embed` export, by its filename in
 * kebab-case (CmsImage.ts -> "cms-image"), or one of Sveltia's own components.
 * Add a partial's id here when you give it an `embed` export. An id that isn't
 * an embed fails the build (modules/cms/build.ts).
 */
export type RichTextEmbed =
  | "cms-image"
  | "cms-video"
  | "cms-button"
  | "table" // Sveltia's table
  | "hr"; // Sveltia's divider
// Sveltia's own `image` and `code-block` are left out: the CmsImage embed
// resizes images and keeps their dimensions.

export interface RichTextOptions {
  /** Field name, and the key in the content. Default: "body". */
  name?: string;
  /** Label in the CMS. Default: "Text". */
  label?: string;
  /** Formatting buttons in the toolbar. Default: ALL_BUTTONS. */
  buttons?: RichTextEditorButtonName[];
  /** Things editors can insert. Default: every embed. [] for none. */
  embeds?: RichTextEmbed[] | "all";
  /** Starts one line high and stops growing at 240px. Default: false. */
  minimal?: boolean;
  /** false keeps it to one paragraph (inline buttons only). Default: true. */
  multiline?: boolean;
  /** Default: true. */
  required?: boolean;
  hint?: string;
}

export const ALL_BUTTONS: RichTextEditorButtonName[] = [
  "bold",
  "italic",
  "link",
  "heading-two",
  "heading-three",
  "quote",
  "bulleted-list",
  "numbered-list",
];

export const defineRichText = ({
  name = "body",
  label = "Text",
  buttons = ALL_BUTTONS,
  embeds = "all",
  ...rest
}: RichTextOptions = {}) =>
  defineField({
    name,
    label,
    widget: "richtext",
    // Markdown, so it can be parsed at build time. Don't change to 'html'.
    format: "markdown",
    buttons,
    // An empty list hides the Insert menu (leaving it out would enable all of Sveltia's).
    editor_components: embeds === "all" ? [allEmbeds] : embeds,
    ...rest,
  });

// ---- Presets ----------------------------------------------------------------

/** Everything: all buttons and every embed. */
export default defineRichText();

/** Bold, italic and links, no embeds: short descriptions, captions. */
export const simpleRichText = defineRichText({
  buttons: ["bold", "italic", "link"],
  embeds: [],
});

/** Text formatting and lists, no embeds. */
export const textOnlyRichText = defineRichText({
  embeds: [],
});

/** Text formatting plus images and videos. */
export const mediaRichText = defineRichText({
  embeds: ["cms-image", "cms-video"],
});

/** Text formatting plus images and videos. */
export const projectRichText = defineRichText({
  buttons: ["heading-three", "bold", "italic", "link"],
  embeds: [],
});
