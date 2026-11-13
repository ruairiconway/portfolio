// Shared field: formatted text (headings, bold, links, lists, quotes…), edited
// in Sveltia's rich text editor. Add it to any block's fields:
//
//   import richText from '../partials/CmsRichText'
//   fields: [..., richText]
//
// and render it with <CmsRichText :body="block.body">.
// Type: CmsRichTextField from '#cms'. Mirrors app/components/partials/CmsRichText.vue.
//
// It's saved as Markdown and parsed at build time (modules/cms/transform.ts), so
// the browser gets a ready-made tree and no Markdown parser.
//
// For a second rich text field in the same block, give it its own name:
//   { ...richText, name: 'intro', label: 'Intro' }
import { defineField, embeds } from "../../../modules/cms/define";

export default defineField({
  name: "body",
  label: "Text",
  widget: "richtext",
  // Markdown, so it can be parsed at build time. Don't change to 'html'.
  format: "markdown",
  buttons: [
    "bold",
    "italic",
    "link",
    "heading-two",
    "heading-three",
    "quote",
    "bulleted-list",
    "numbered-list",
  ],
  // Tables, dividers and every embed (partials with an `embed` export, like
  // CmsImage and CmsVideo). Sveltia's own image component is left out: the
  // CmsImage embed resizes images and keeps their dimensions.
  editor_components: [embeds],
});
