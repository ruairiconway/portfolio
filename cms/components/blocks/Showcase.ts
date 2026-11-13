// Mirrors app/components/blocks/Showcase.vue.
// Type: "showcase" -> <BlockShowcase>. Types: import type { ShowcaseBlock } from '#cms'
import { defineBlock } from "../../../modules/cms/define";
import image from "../partials/CmsImage";
import { projectRichText } from "../partials/CmsRichText";

export default defineBlock({
  label: "Showcase",
  fields: [
    {
      name: "hero",
      label: "Hero",
      widget: "object",
      fields: [
        {
          name: "headline",
          label: "Headline",
          widget: "string",
          required: true,
        },
        image,
        projectRichText,
      ],
    },
    {
      name: "projects",
      label: "Projects",
      widget: "list",
      summary: "{{name}}",
      thumbnail: "image.image",
      required: true,
      fields: [
        {
          name: "name",
          label: "Name",
          widget: "string",
          required: true,
        },
        {
          name: "url",
          label: "URL",
          widget: "string",
          pattern: [
            "^(https?://|mailto:|tel:)",
            "Must start with https://, http://, mailto: or tel:.",
          ],
          hint: "A full link to another site, e.g. https://example.com. mailto: and tel: links work too.",
          required: true,
        },
        image,
        projectRichText,
      ],
    },
  ],
});
