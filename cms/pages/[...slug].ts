// Mirrors app/pages/[...slug].vue: block-based pages.
import { blocks, defineCms } from '../../modules/cms/define'
import seo from '../fields/seo'

export default defineCms({
  collections: [
    {
      name: 'pages',
      label: 'Pages',
      label_singular: 'Page',
      folder: 'content/pages',
      extension: 'json',
      format: 'json',
      create: true,
      // The URL comes from the `path` field below, not the filename, so the
      // sidebar Slug panel is turned off. Filenames are set from the title once.
      slug: {
        template: '{{slug}}',
        editable: false,
      },
      summary: '{{title}} — {{path}}',
      fields: [
        { name: 'title', label: 'Title', widget: 'string', hint: 'Used for the browser tab and search results.' },
        {
          name: 'path',
          label: 'URL path',
          widget: 'string',
          required: true,
          unique: true,
          pattern: [
            '^/([a-z0-9]+(-[a-z0-9]+)*(/[a-z0-9]+(-[a-z0-9]+)*)*)?$',
            'Use lowercase letters, numbers and hyphens, starting with / (e.g. /about or /services/design).',
          ],
          hint: 'Where the page lives on the site, e.g. /about. Use / for the home page.',
        },
        {
          name: 'blocks',
          label: 'Page content',
          label_singular: 'Block',
          widget: 'list',
          // Always open: the list and every block in it start expanded.
          minimize_collapsed: false,
          collapsed: false,
          // Every block in cms/components/blocks/, filled in at build time.
          types: blocks,
        },
        seo, // cms/fields/seo.ts
      ],
    },
  ],
})
