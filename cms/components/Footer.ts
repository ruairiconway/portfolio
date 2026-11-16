// Mirrors app/components/Footer.vue.
import { defineCms } from "../../modules/cms/define";
import { buttonFields } from "./partials/CmsButton";

export default defineCms({
  collections: [
    {
      name: "navigation",
      files: [
        {
          name: "footer",
          label: "Footer",
          icon: "bottom_panel_open",
          file: "content/navigation/footer.json",
          format: "json",
          fields: [
            {
              name: "items",
              label: "Links",
              widget: "list",
              summary: "{{label}}",
              fields: [...buttonFields],
            },
          ],
        },
      ],
    },
  ],
});
