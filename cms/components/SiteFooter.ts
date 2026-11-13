// Mirrors app/components/SiteFooter.vue.
import { defineCms } from '../../modules/cms/define'

export default defineCms({
  collections: [
    {
      name: 'navigation',
      files: [
        {
          name: 'footer',
          label: 'Footer',
          icon: 'bottom_panel_open',
          file: 'content/navigation/footer.json',
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
            {
              name: 'copyright',
              label: 'Copyright text',
              widget: 'string',
              required: false,
              hint: 'Shown after "© <year> <site name>".',
            },
          ],
        },
      ],
    },
  ],
})
