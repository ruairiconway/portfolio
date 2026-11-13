// Mirrors app/components/AlertBanner.vue.
import { defineCms } from '../../modules/cms/define'

export default defineCms({
  collections: [
    {
      name: 'navigation',
      files: [
        {
          name: 'alert-banner',
          label: 'Alert banner',
          icon: 'campaign',
          file: 'content/navigation/alert-banner.json',
          format: 'json',
          fields: [
            { name: 'enabled', label: 'Show banner', widget: 'boolean', default: false },
            {
              name: 'tone',
              label: 'Tone',
              widget: 'select',
              default: 'info',
              options: [
                { label: 'Info', value: 'info' },
                { label: 'Warning', value: 'warning' },
              ],
            },
            { name: 'message', label: 'Message', widget: 'string' },
            {
              name: 'link',
              label: 'Link',
              widget: 'object',
              required: false,
              collapsed: true,
              fields: [
                { name: 'label', label: 'Label', widget: 'string', required: false },
                { name: 'url', label: 'URL', widget: 'string', required: false, hint: 'A path like /about, or a full https:// URL.' },
              ],
            },
          ],
        },
      ],
    },
  ],
})
