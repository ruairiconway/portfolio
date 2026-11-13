/**
 * Assembles the Sveltia CMS config from the .ts files in cms/. Each file
 * default-exports its part of the config, using the typed helpers in ./define.ts.
 *
 * - Every file except blocks and shared fields is a piece of the Sveltia config
 *   (defineCms). They're deep-merged, config.ts first. Lists of named items
 *   (collections, singletons, files, fields) are merged by `name`, so several
 *   files can add to one collection.
 * - Files in cms/components/blocks/ each define one block (defineBlock). The
 *   block name is the filename in kebab-case (PullQuote.ts -> "pull-quote"),
 *   and the blocks fill any `types: blocks` list. Every block also gets the
 *   fields in BLOCK_FIELDS (an anchor ID), unless it defines a field of that name.
 * - Files in cms/fields/ and cms/components/partials/ each define one shared
 *   field (defineField), imported wherever it's used. They're read here too, so
 *   the generated types can name them (seo.ts -> SeoField). Partials are fields
 *   rendered by a matching component (app/components/partials/CmsVideo.vue).
 * - A file in cms/components/partials/ can also export `embed` (defineEmbed),
 *   so editors can insert that partial into rich text (./embeds.ts). Its id is
 *   the filename in kebab-case (CmsImage.ts -> "cms-image"), and the embeds
 *   fill any `editor_components` list containing `embeds`.
 */
import { readdirSync } from 'node:fs'
import { basename, join, relative, sep } from 'node:path'
import { createJiti } from 'jiti'

export const SOURCE_DIR = 'cms'
const BLOCKS_DIR = 'components/blocks'
const BLOCKS_PLACEHOLDER = '@blocks' // the value of `blocks` from ./define.ts
const EMBEDS_PLACEHOLDER = '@embeds' // the value of `embeds` from ./define.ts
const PARTIALS_DIR = 'components/partials'
const SHARED_FIELD_DIRS = ['fields', PARTIALS_DIR]
// Shared fields added to the end of every block's fields.
const BLOCK_FIELDS = ['fields/anchorId.ts']

export type Obj = Record<string, unknown>

export const isObject = (value: unknown): value is Obj =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isNamed = (value: unknown): value is Obj & { name: string } =>
  isObject(value) && typeof value.name === 'string'

const toKebab = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * Fields whose Markdown is parsed at build time (./transform.ts) into an MDC
 * tree: `markdown`, and `richtext` unless it's set to save HTML.
 */
export const isParsedMarkdown = (field: Obj) =>
  field.widget === 'markdown' || (field.widget === 'richtext' && field.format !== 'html')

/** "components/blocks/PullQuote.ts" -> "PullQuote" */
export const fileStem = (file: string) => basename(file).replace(/\.ts$/, '')

function merge(base: unknown, next: unknown): unknown {
  if (Array.isArray(base) && Array.isArray(next)) {
    // Only lists of named items are merged; any other list is replaced.
    if (!base.every(isNamed) || !next.every(isNamed)) return next
    const result = [...base]
    for (const item of next) {
      const index = result.findIndex((existing) => existing.name === item.name)
      if (index === -1) result.push(item)
      else result[index] = merge(result[index], item) as Obj & { name: string }
    }
    return result
  }
  if (isObject(base) && isObject(next)) {
    const result: Obj = { ...base }
    for (const [key, value] of Object.entries(next)) {
      result[key] = key in base ? merge(base[key], value) : value
    }
    return result
  }
  return next
}

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts'))
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)).split(sep).join('/'))
    .sort()
}

// No caching, so each build reads the files as they are now (dev restarts
// re-run it after every change).
const jiti = createJiti(import.meta.url, { moduleCache: false, fsCache: false })

/** A file's exports: `default`, and `embed` for partials. Undefined if not exported. */
function loadExports(dir: string, file: string): { default?: Obj; embed?: Obj } {
  let mod: Record<string, unknown>
  try {
    mod = (jiti(join(dir, file)) ?? {}) as Record<string, unknown>
  } catch (error) {
    throw new Error(`${SOURCE_DIR}/${file}: ${(error as Error).message}`)
  }
  const copy = (name: string): Obj | undefined => {
    const data = mod[name]
    if (data === undefined) return undefined
    if (!isObject(data)) throw new Error(`${SOURCE_DIR}/${file}: the \`${name}\` export must be an object`)
    try {
      // A copy, so merging and filling in placeholders never changes a shared import.
      return structuredClone(data)
    } catch {
      throw new Error(`${SOURCE_DIR}/${file} must export plain data: no functions or class instances`)
    }
  }
  return { default: copy('default'), embed: copy('embed') }
}

function loadDefault(dir: string, file: string): Obj {
  const data = loadExports(dir, file).default
  if (!data) throw new Error(`${SOURCE_DIR}/${file} must default-export an object (defineCms, defineBlock or defineField)`)
  return data
}

/** Fills in `types: blocks` and the `embeds` item of `editor_components` lists. */
function fillPlaceholders(value: unknown, blocks: Obj[], embedIds: string[]): void {
  if (Array.isArray(value)) {
    const index = value.indexOf(EMBEDS_PLACEHOLDER)
    if (index !== -1) value.splice(index, 1, ...embedIds.filter((id) => !value.includes(id)))
    for (const item of value) fillPlaceholders(item, blocks, embedIds)
  } else if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (key === 'types' && child === BLOCKS_PLACEHOLDER) value[key] = structuredClone(blocks)
      else fillPlaceholders(child, blocks, embedIds)
    }
  }
}

function checkComplete(config: Obj): void {
  for (const key of ['collections', 'singletons'] as const) {
    const items = config[key]
    if (!Array.isArray(items)) continue
    for (const item of items) {
      if (isNamed(item) && !item.fields && !item.files) {
        throw new Error(
          `"${item.name}" is listed in ${SOURCE_DIR}/config.ts ${key} but no file in ${SOURCE_DIR}/ defines its fields`,
        )
      }
    }
  }
}

export interface CmsBuild {
  /** The full Sveltia CMS config. */
  config: Obj
  /** Block definitions from cms/components/blocks/, by file. */
  blocks: { file: string; name: string; definition: Obj }[]
  /** Shared fields from cms/fields/ and cms/components/partials/, by file (e.g. "fields/seo.ts"). */
  fields: Map<string, Obj>
  /** Partials that can be inserted into rich text, from their `embed` exports. */
  embeds: CmsEmbedBuild[]
}

export interface CmsEmbedBuild {
  /** The editor component id and the MDC tag in the Markdown: "cms-image". */
  id: string
  /** The Vue partial that renders it: "CmsImage" (app/components/partials/CmsImage.vue). */
  component: string
  /** The cms/ file it's defined in. */
  file: string
  /** The defineEmbed() options. */
  definition: Obj
}

export function buildCms(sourceDir: string): CmsBuild {
  const files = listSourceFiles(sourceDir)
  const isBlock = (file: string) => file.startsWith(`${BLOCKS_DIR}/`)
  const isField = (file: string) => SHARED_FIELD_DIRS.some((dir) => file.startsWith(`${dir}/`))

  // config.ts first so it sets the base config and sidebar order.
  const partials = files.filter((file) => !isBlock(file) && !isField(file))
  partials.sort((a, b) => Number(b === 'config.ts') - Number(a === 'config.ts'))

  let config: Obj = {}
  for (const file of partials) config = merge(config, loadDefault(sourceDir, file)) as Obj

  // Shared fields. A partial may export only an `embed`, with no field of its own.
  const fields = new Map<string, Obj>()
  const embeds: CmsEmbedBuild[] = []
  for (const file of files.filter(isField)) {
    const { default: field, embed } = loadExports(sourceDir, file)
    if (embed && file.startsWith(`${PARTIALS_DIR}/`)) {
      embeds.push({ id: toKebab(fileStem(file)), component: fileStem(file), file: `${SOURCE_DIR}/${file}`, definition: embed })
    }
    if (field) fields.set(file, field)
    else if (!embed) {
      throw new Error(`${SOURCE_DIR}/${file} must default-export a field (defineField)${file.startsWith(`${PARTIALS_DIR}/`) ? ' or export an embed (defineEmbed)' : ''}`)
    }
  }

  const blockFields = BLOCK_FIELDS.map((file) => {
    const field = fields.get(file)
    if (!field) throw new Error(`${SOURCE_DIR}/${file} is missing: every block's fields include it`)
    return field
  })
  const blockFiles = files.filter(isBlock)
  const blocks: Obj[] = blockFiles.map((file) => {
    const { name: _ignored, ...block } = loadDefault(sourceDir, file)
    const own = Array.isArray(block.fields) ? block.fields : []
    const added = blockFields.filter((field) => !own.some((item) => isNamed(item) && item.name === field.name))
    return { name: toKebab(fileStem(file)), widget: 'object', ...block, fields: [...own, ...structuredClone(added)] }
  })

  const embedIds = embeds.map((embed) => embed.id)
  // Shared fields too, so they still match their copies in blocks and the
  // generated types can name them (CmsRichTextField).
  for (const field of fields.values()) fillPlaceholders(field, blocks, embedIds)
  fillPlaceholders(blocks, blocks, embedIds)
  fillPlaceholders(config, blocks, embedIds)
  checkComplete(config)

  return {
    config,
    blocks: blocks.map((definition, index) => ({ file: `${SOURCE_DIR}/${blockFiles[index]}`, name: definition.name as string, definition })),
    fields,
    embeds,
  }
}
