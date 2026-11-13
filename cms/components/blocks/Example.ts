// Mirrors app/components/blocks/Example.vue.
// Type: "example" -> <BlockExample>. Types: import type { ExampleBlock } from '#cms'
//
// A placeholder: Sveltia needs at least one block type for a page's Page content
// list. Replace it with real blocks (`pnpm new block <Name>`), then delete it.
import { defineBlock } from "../../../modules/cms/define";
import richText from "../partials/CmsRichText";

export default defineBlock({
  label: "Example",
  fields: [richText],
});
