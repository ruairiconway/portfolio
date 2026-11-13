/**
 * Assembles the Sveltia CMS config from the .yml files in cms/.
 *
 * - Every file except blocks and shared fields is a partial Sveltia config.
 *   They're deep-merged, config.yml first. Lists of named items (collections,
 *   singletons, files, fields) are merged by `name`, so several files can add
 *   to one collection.
 * - Files in cms/components/blocks/ each define one block. The block name is
 *   the filename in kebab-case (PullQuote.yml -> "pull-quote"), and the blocks
 *   replace any `types: '@blocks'` placeholder.
 * - Files in cms/fields/ and cms/components/partials/ each define one shared
 *   field. An item like `- '@fields/seo'` or `- '@partials/CmsVideo'` in any
 *   fields list is replaced by cms/fields/seo.yml or
 *   cms/components/partials/CmsVideo.yml. Partials are fields rendered by a
 *   matching component (app/components/partials/CmsVideo.vue).
 */
import { readFileSync, readdirSync } from 'node:fs'
import { basename, join, relative, sep } from 'node:path'
import { parse } from 'yaml'

export const SOURCE_DIR = 'cms'
const BLOCKS_DIR = 'components/blocks'
const BLOCKS_PLACEHOLDER = '@blocks'
// Shared field folders, by the prefix that references them.
const SHARED_DIRS = { '@fields': 'fields', '@partials': 'components/partials' } as const
const FIELD_REF = /^@(fields|partials)\/.+$/

export type Obj = Record<string, unknown>

export const isObject = (value: unknown): value is Obj =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isNamed = (value: unknown): value is Obj & { name: string } =>
  isObject(value) && typeof value.name === 'string'

const toKebab = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

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

function listYamlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)).split(sep).join('/'))
    .sort()
}

function readYaml(dir: string, file: string): Obj {
  const data: unknown = parse(readFileSync(join(dir, file), 'utf8'))
  if (!isObject(data)) throw new Error(`${SOURCE_DIR}/${file} must contain a YAML object`)
  return data
}

/** "@partials/CmsVideo" -> "components/partials/CmsVideo.yml" */
export function refToFile(ref: string): string {
  const [prefix, ...rest] = ref.split('/')
  return `${SHARED_DIRS[prefix as keyof typeof SHARED_DIRS]}/${rest.join('/')}.yml`
}

/** "components/partials/CmsVideo.yml" -> "@partials/CmsVideo", or undefined if it isn't a shared field. */
function fileToRef(file: string): string | undefined {
  for (const [prefix, dir] of Object.entries(SHARED_DIRS)) {
    if (file.startsWith(`${dir}/`)) return `${prefix}/${file.slice(dir.length + 1).replace(/\.ya?ml$/, '')}`
  }
}

function replacePlaceholders(value: unknown, blocks: Obj[], fields: Map<string, Obj>): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (typeof item === 'string' && FIELD_REF.test(item)) {
        const field = fields.get(item)
        if (!field) throw new Error(`"${item}" refers to ${SOURCE_DIR}/${refToFile(item)}, which doesn't exist`)
        value[index] = structuredClone(field)
      } else replacePlaceholders(item, blocks, fields)
    })
  } else if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (key === 'types' && child === BLOCKS_PLACEHOLDER) value[key] = structuredClone(blocks)
      else replacePlaceholders(child, blocks, fields)
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
          `"${item.name}" is listed in ${SOURCE_DIR}/config.yml ${key} but no file in ${SOURCE_DIR}/ defines its fields`,
        )
      }
    }
  }
}

export interface CmsBuild {
  /** The full Sveltia CMS config. */
  config: Obj
  /** Block definitions from cms/components/blocks/, by file, with shared fields filled in. */
  blocks: { file: string; name: string; definition: Obj }[]
  /** Shared fields from cms/fields/ and cms/components/partials/, by reference (e.g. "@fields/seo"). */
  fields: Map<string, Obj>
}

export function buildCms(sourceDir: string): CmsBuild {
  const files = listYamlFiles(sourceDir)
  const isBlock = (file: string) => file.startsWith(`${BLOCKS_DIR}/`)
  const isField = (file: string) => fileToRef(file) !== undefined

  // config.yml first so it sets the base config and sidebar order.
  const partials = files.filter((file) => !isBlock(file) && !isField(file))
  partials.sort((a, b) => Number(b === 'config.yml') - Number(a === 'config.yml'))

  let config: Obj = {}
  for (const file of partials) config = merge(config, readYaml(sourceDir, file)) as Obj

  const blockFiles = files.filter(isBlock)
  const blocks: Obj[] = blockFiles.map((file) => {
    const { name: _ignored, ...block } = readYaml(sourceDir, file)
    return { name: toKebab(basename(file).replace(/\.ya?ml$/, '')), widget: 'object', ...block }
  })
  const fields = new Map(
    files.filter(isField).map((file) => [fileToRef(file)!, readYaml(sourceDir, file)]),
  )
  // Shared fields can be used inside blocks too, so fill those first.
  replacePlaceholders(blocks, blocks, fields)
  replacePlaceholders(config, blocks, fields)
  checkComplete(config)

  return {
    config,
    blocks: blocks.map((definition, index) => ({ file: `${SOURCE_DIR}/${blockFiles[index]}`, name: definition.name as string, definition })),
    fields,
  }
}
