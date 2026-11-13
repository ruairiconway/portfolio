// Shared field: an anchor ID, so links can jump to a block (/about#team).
// Added to every block automatically (modules/cms/build.ts), and rendered as the
// block's `id` by app/components/partials/BlockRenderer.vue, so blocks don't
// need to handle it themselves.
import { defineField } from '../../modules/cms/define'

/** Letters, numbers, hyphens and underscores, starting with a letter. Also used by CmsButton's Anchor. */
export const anchorPattern: [string, string] = [
  '^[A-Za-z][\\w-]*$',
  'Letters, numbers, hyphens and underscores, starting with a letter, without the #.',
]

export default defineField({
  name: 'anchorId',
  label: 'Anchor ID',
  widget: 'string',
  required: false,
  pattern: anchorPattern,
  hint: 'Optional. Lets links jump to this block: an anchor ID of pricing makes /this-page#pricing scroll here. Use it in a button’s Anchor. Keep it unique on the page.',
})
