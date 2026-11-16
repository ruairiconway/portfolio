#!/usr/bin/env node
/**
 * Makes the files in content/ match their fields in cms/ exactly (see
 * modules/cms/content.ts). `pnpm dev` does this automatically; this is for
 * syncing without starting the dev server.
 *
 *   pnpm cms:sync           changes the files
 *   pnpm cms:sync --check   only lists the differences (exits 1 if there are any)
 *
 * Values that aren't fields, or have the wrong type, are removed. Review the
 * result with git diff before committing.
 */
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')

const jiti = createJiti(import.meta.url)
const { buildCms, SOURCE_DIR } = await jiti.import(join(ROOT, 'modules/cms/build.ts'))
const { syncContent, formatChanges } = await jiti.import(join(ROOT, 'modules/cms/content.ts'))

let result
try {
  result = syncContent(buildCms(join(ROOT, SOURCE_DIR)), ROOT, { write: !check })
} catch (error) {
  console.error(`\n  ${error.message}\n`)
  process.exit(1)
}
const { files, changes } = result
const unfixable = changes.filter((change) => change.kind === 'unfixable')

if (!changes.length) {
  console.log('\n  content/ matches the fields in cms/.\n')
  process.exit(0)
}
const count = `${files.length} file${files.length === 1 ? '' : 's'}`
console.log(`\n  ${check ? `${count} don't match` : `Synced ${count}`} the fields in cms/:\n`)
console.log(formatChanges(changes))
if (unfixable.length) console.log('\n  ✖ needs a value set in the CMS.')
if (check) console.log('\n  Run pnpm cms:sync to sync them.')
console.log('')
process.exit(check || unfixable.length ? 1 : 0)
