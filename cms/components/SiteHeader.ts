// Mirrors app/components/SiteHeader.vue.
// (The logo comes from Site settings in cms/app.ts.)
import { defineCms } from '../../modules/cms/define'

export default defineCms({
  collections: [
    {
      name: 'navigation',
      files: [
        {
          name: 'header',
          label: 'Header',
          icon: 'top_panel_open',
          file: 'content/navigation/header.json',
          format: 'json',
          fields: [
            {
              name: 'items',
              label: 'Links',
              widget: 'list',
              summary: '{{label}} → {{url}}',
              fields: [
                { name: 'label', label: 'Label', widget: 'string' },
                { name: 'url', label: 'URL', widget: 'string', hint: 'A path like /about, or a full https:// URL.' },
              ],
            },
          ],
        },
      ],
    },
  ],
})
