// Shared fields: a link to a page on the site (optionally to an anchor on it)
// or to an external URL, plus "Open in a new tab". Used by CmsButton.
//
// Both fields, side by side in an object's fields (saved as `link` and `newWindow`):
//
//   import { linkFields } from '../partials/CmsLink'
//   fields: [..., ...linkFields]
//
// or just the link, without the new-tab checkbox:
//
//   import link from '../partials/CmsLink'
//   fields: [..., link]
//
// Type: CmsLinkField from '#cms' (the `link` object). CMS only: there's no
// CmsLink.vue; CmsButton.vue turns it into an href.
import { defineField } from '../../../modules/cms/define'
import { anchorPattern } from '../../fields/anchorId'
import url from './CmsUrl'

const link = defineField({
  name: 'link',
  label: 'Link',
  widget: 'object',
  // Choosing the link type shows only that type's fields.
  types: [
    {
      name: 'page',
      label: 'Site page',
      fields: [
        {
          name: 'page',
          label: 'Page',
          widget: 'relation',
          collection: 'pages',
          value_field: 'path',
          display_fields: ['title'],
          search_fields: ['title', 'path'],
          // Always a dropdown. By default Sveltia shows radio buttons until
          // there are more than 5 pages.
          dropdown_threshold: 0,
          required: false,
          hint: 'Leave empty to link to a section of the page the button is on.',
        },
        {
          name: 'anchor',
          label: 'Anchor',
          widget: 'string',
          required: false,
          pattern: anchorPattern,
          hint: 'Optional. Jump to a block on the page: use the Anchor ID set on that block, e.g. pricing for #pricing. Headings in rich text also work: "Our services" -> our-services.',
        },
      ],
    },
    {
      name: 'external',
      label: 'External URL',
      fields: [url],
    },
  ],
})

export default link

export const newWindow = defineField({
  name: 'newWindow',
  label: 'Open in a new tab',
  widget: 'boolean',
  default: false,
})

/** The link and "Open in a new tab", to spread into an object's fields. */
export const linkFields = [link, newWindow]
