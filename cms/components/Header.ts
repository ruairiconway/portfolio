// Mirrors app/components/Header.vue.
// (The logo comes from Site settings in cms/app.ts.)
import { defineCms } from "../../modules/cms/define";
import { buttonFields } from "./partials/CmsButton";

export default defineCms({
  collections: [
    {
      name: "navigation",
      files: [
        {
          name: "header",
          label: "Header",
          icon: "top_panel_open",
          file: "content/navigation/header.json",
          format: "json",
          fields: [
            {
              name: "items",
              label: "Links",
              widget: "list",
              summary: "{{text}}",
              fields: [...buttonFields],
            },
          ],
        },
      ],
    },
  ],
});
