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
import { linkFields } from './CmsLink'

// The button's fields, named after CmsButton's props.
const fields = [
  defineField({ name: 'text', label: 'Button text', widget: 'string' }),
  ...linkFields, // link + newWindow: cms/components/partials/CmsLink.ts
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
