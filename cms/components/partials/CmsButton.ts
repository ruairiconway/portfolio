// Shared field: a button that links to a page on the site (optionally to an
// anchor on it) or to an external URL. Add it to any block's fields:
//
//   import button from '../partials/CmsButton'
//   fields: [..., button]
//
// and render it with <CmsButton v-bind="block.button" /> (its fields are
// CmsButton's props, so v-bind passes them straight through).
// Type: CmsButtonField from '#cms'. Mirrors app/components/partials/CmsButton.vue.
//
// It's also a rich text embed (the `embed` export below): editors can insert a
// button into rich text (Insert → Button).
import { defineEmbed, defineField } from '../../../modules/cms/define'
import { anchorPattern } from '../../fields/anchorId'
import url from './CmsUrl'

// The button's fields, named after CmsButton's props.
const fields = [
  defineField({ name: 'text', label: 'Button text', widget: 'string' }),
  defineField({
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
  }),
  defineField({
    name: 'newWindow',
    label: 'Open in a new tab',
    widget: 'boolean',
    default: false,
  }),
]

const button = defineField({
  name: 'button',
  label: 'Button',
  widget: 'object',
  required: false,
  summary: '{{text}}',
  fields,
})

export default button

export const embed = defineEmbed({
  label: 'Button',
  icon: 'smart_button',
  mode: 'dialog',
  summary: '{{text}}',
  fields,
})
