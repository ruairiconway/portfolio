// Shared field: a link to another site (https://, http://, mailto: or tel:).
// CMS only: there's no CmsUrl.vue, the value is a plain string. Add it to any
// block's fields:
//
//   import url from '../partials/CmsUrl'
//   fields: [..., url]
//
// For a second URL field, or an optional one, override what you need:
//   { ...url, name: 'website', label: 'Website', required: false }
// Type: CmsUrlField from '#cms'. Also used by CmsButton's External URL link.
import { defineField } from '../../../modules/cms/define'

export default defineField({
  name: 'url',
  label: 'URL',
  widget: 'string',
  pattern: ['^(https?://|mailto:|tel:)', 'Must start with https://, http://, mailto: or tel:.'],
  hint: 'A full link to another site, e.g. https://example.com. mailto: and tel: links work too.',
})
