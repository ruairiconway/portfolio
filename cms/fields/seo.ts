// Shared field: per-entry SEO overrides of the global SEO settings (cms/app.ts).
// Used by pages: import seo from '…/fields/seo', then add `seo`
// to their fields.
// Mirrors app/composables/usePageSeo.ts, which applies the overrides.
import { defineField } from '../../modules/cms/define'

export default defineField({
  name: 'seo',
  label: 'SEO',
  widget: 'object',
  required: false,
  collapsed: true,
  hint: 'Overrides for this entry. Anything left blank uses the global SEO settings.',
  fields: [
    {
      name: 'title',
      label: 'Meta title',
      widget: 'string',
      required: false,
      hint: 'Replaces the title in search results and link previews. The site name is still added after it.',
    },
    { name: 'titleSeparator', label: 'Title separator', widget: 'string', required: false },
    {
      name: 'description',
      label: 'Meta description',
      widget: 'text',
      required: false,
      hint: 'Shown in search results and link previews. Aim for 150–160 characters.',
    },
    {
      name: 'image',
      label: 'Social image',
      widget: 'image',
      required: false,
      hint: 'Used for link previews. 1200 × 630 px works best.',
    },
    {
      name: 'twitterHandle',
      label: 'X / Twitter handle',
      widget: 'string',
      required: false,
      hint: 'Including the @, e.g. @yourstudio',
    },
    {
      name: 'noindex',
      label: 'Hide from search engines',
      widget: 'boolean',
      default: false,
      hint: 'If the global setting is on, every page is hidden regardless.',
    },
  ],
})
