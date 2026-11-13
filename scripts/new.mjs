#!/usr/bin/env node
/**
 * Scaffolds a page block: its CMS fields, component and styles, at mirrored paths.
 *
 *   pnpm new block Quote
 *     cms/components/blocks/Quote.yml                  CMS fields
 *     app/components/blocks/Quote.vue                  component (typed with QuoteBlock from #cms)
 *     app/assets/scss/components/blocks/Quote.scss     styles
 *
 * Options: --dry-run (list the files without writing them).
 * Existing files are never overwritten.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const USAGE = `Usage:
  pnpm new block <Name> [--dry-run]`

function fail(message) {
  console.error(`\n  ${message}\n\n${USAGE}\n`)
  process.exit(1)
}

// ── Arguments ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const [kind, rawName, ...rest] = args.filter((arg) => arg !== '--dry-run')

if (kind !== 'block') fail(kind ? `Unknown kind "${kind}". Only "block" is supported.` : 'Expected "block" and a name.')
if (!rawName || rest.length) fail('Expected one block name, e.g. Quote or PullQuote.')
if (rawName.includes('/')) fail('Blocks can’t be in subfolders: their type comes from the filename.')

// ── Names ────────────────────────────────────────────────────────────────────

const toPascal = (value) => value.replace(/(^|[-_\s]+)([a-zA-Z0-9])/g, (_m, _s, char) => char.toUpperCase())
const toKebab = (value) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const name = toPascal(rawName)
if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) fail(`"${rawName}" isn't a valid name. Use something like Quote or PullQuote.`)

const type = toKebab(name)
const label = type.replace(/-/g, ' ').replace(/^./, (char) => char.toUpperCase())
const typeName = `${name}Block`

const paths = {
  cms: `cms/components/blocks/${name}.yml`,
  vue: `app/components/blocks/${name}.vue`,
  scss: `app/assets/scss/components/blocks/${name}.scss`,
}

// ── File contents ────────────────────────────────────────────────────────────

const files = new Map([
  [
    paths.cms,
    `# Mirrors ${paths.vue}.
# Type: "${type}" -> <Block${name}>. Types: import type { ${typeName} } from '#cms'

label: ${label}
fields:
  - { name: heading, label: Heading, widget: string }
`,
  ],
  [
    paths.vue,
    `<script setup lang="ts">
// CMS fields: ${paths.cms}
import type { ${typeName} } from '#cms' // generated from the CMS fields

defineProps<{ block: ${typeName} }>()
</script>

<template>
  <section class="${type}">
    <h2>{{ block.heading }}</h2>
  </section>
</template>

<style lang="scss" scoped src="${relative(dirname(paths.vue), paths.scss)}"></style>
`,
  ],
  [
    paths.scss,
    `// Styles for ${paths.vue} (scoped).
// Abstracts ($variables, @include mixins) are auto-injected.

.${type} {
  padding: $gutter * 2 0;
}
`,
  ],
])

// ── Write ────────────────────────────────────────────────────────────────────

const clashes = [...files.keys()].filter((file) => existsSync(join(ROOT, file)))
if (clashes.length) fail(`Already exists, nothing was written:\n  ${clashes.join('\n  ')}`)

console.log(`\n${dryRun ? 'Would create' : 'Created'} block ${name} (type "${type}"):`)
for (const [file, contents] of files) {
  if (!dryRun) {
    mkdirSync(dirname(join(ROOT, file)), { recursive: true })
    writeFileSync(join(ROOT, file), contents)
  }
  console.log(`  + ${file}`)
}

console.log(`
Next:
  - Edit its fields in ${paths.cms}.
  - It's in the CMS block picker under each page's Page content, and <Block${name}> renders it.
  - Types and the CMS config regenerate when \`pnpm dev\` restarts (automatic if it's running) or on \`pnpm typecheck\`.
`)
