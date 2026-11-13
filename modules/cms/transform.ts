/**
 * Build-time transforms of CMS field values, applied as Nuxt Content reads each
 * content file. For every file, this finds its CMS definition in cms/ and,
 * wherever those fields are (blocks, lists, objects, singletons):
 *
 * - `widget: markdown` and `widget: richtext` (unless `format: html`): parses
 *   the Markdown into an MDC tree, so the browser never needs a Markdown
 *   parser (~200 KB of gzipped JavaScript). Render it with <CmsRichText>.
 * - `widget: image`: turns the path into `{ src, width, height }`, reading the
 *   dimensions from the file in public/. <CmsImage> uses them for `width` and
 *   `height` attributes, so images never shift the layout as they load.
 *
 * A Markdown file's own body (e.g. a blog post's `body`) is left alone: Nuxt
 * Content already parses that, and it's rendered with <ContentRenderer>.
 */
import { readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { createMarkdownParser } from '@nuxtjs/mdc/runtime'
import { imageSize } from 'image-size'
import { isObject, isParsedMarkdown, type CmsBuild, type Obj } from './build'
import { transformEmbeds } from './embeds'

export interface CmsImage {
  src: string
  width?: number
  height?: number
}

let parser: ReturnType<typeof createMarkdownParser> | undefined
async function parseMarkdown(markdown: string): Promise<unknown> {
  parser ??= createMarkdownParser()
  return (await (await parser)(markdown)).body
}

const dimensions = new Map<string, { width?: number; height?: number }>()
function toImage(src: string, rootDir: string): CmsImage {
  // Site-relative paths are files in public/. External URLs get no dimensions.
  if (!src.startsWith('/')) return { src }
  if (!dimensions.has(src)) {
    try {
      const { width, height } = imageSize(readFileSync(join(rootDir, 'public', decodeURI(src))))
      dimensions.set(src, { width, height })
    } catch {
      dimensions.set(src, {}) // missing or unreadable: render without dimensions
    }
  }
  return { src, ...dimensions.get(src) }
}

/** The CMS collection, collection file or singleton that a content file belongs to. */
function findDefinition(config: Obj, contentPath: string): Obj[] | undefined {
  const entries: Obj[] = []
  for (const collection of Array.isArray(config.collections) ? config.collections.filter(isObject) : []) {
    entries.push(collection)
    if (Array.isArray(collection.files)) entries.push(...collection.files.filter(isObject))
  }
  if (Array.isArray(config.singletons)) entries.push(...config.singletons.filter(isObject))

  const match = entries.find((entry) =>
    typeof entry.file === 'string'
      ? contentPath === entry.file
      : typeof entry.folder === 'string' && contentPath.startsWith(`${entry.folder}/`),
  )
  return match && Array.isArray(match.fields) ? match.fields.filter(isObject) : undefined
}

type Transform = (value: unknown, field: Obj) => Promise<unknown>

async function transformFields(data: Obj, fields: Obj[], transform: Transform): Promise<void> {
  for (const field of fields) {
    const name = String(field.name)
    const value = data[name]
    if (value === undefined || value === null) continue

    if (field.widget === 'object' && isObject(value)) {
      await transformNested(value, field, transform)
    } else if (field.widget === 'list' && Array.isArray(value)) {
      for (const [index, item] of value.entries()) {
        if (isObject(field.field)) value[index] = await transform(item, field.field)
        else if (isObject(item)) await transformNested(item, field, transform)
      }
    } else {
      data[name] = await transform(value, field)
    }
  }
}

/** An object or list item: plain subfields, or one of several `types` (like page blocks). */
async function transformNested(item: Obj, field: Obj, transform: Transform): Promise<void> {
  if (Array.isArray(field.types)) {
    const typeKey = String(field.typeKey ?? 'type')
    const variant = field.types.filter(isObject).find((type) => type.name === item[typeKey])
    if (variant && Array.isArray(variant.fields)) await transformFields(item, variant.fields.filter(isObject), transform)
  } else if (Array.isArray(field.fields)) {
    await transformFields(item, field.fields.filter(isObject), transform)
  }
}

/** Applies the transforms to one content file in place. */
export async function transformContent(
  { config, embeds }: Pick<CmsBuild, 'config' | 'embeds'>,
  rootDir: string,
  file: { path: string },
  content: Obj,
): Promise<void> {
  const contentPath = relative(rootDir, file.path).split(sep).join('/')
  const fields = findDefinition(config, contentPath)
  if (!fields) return

  // Rich text embeds (./embeds.ts), by tag: their fields are transformed too.
  const embedFields = new Map(
    embeds.map((embed) => [embed.id, (Array.isArray(embed.definition.fields) ? embed.definition.fields : []).filter(isObject)]),
  )

  const transform: Transform = async (value, field) => {
    if (isParsedMarkdown(field) && typeof value === 'string') {
      const tree = await parseMarkdown(value)
      await transformEmbeds(tree, embedFields, (data, nested) => transformFields(data, nested, transform))
      return tree
    }
    if (field.widget === 'image') {
      if (typeof value === 'string') return value ? toImage(value, rootDir) : undefined
      if (Array.isArray(value)) return value.filter((src) => typeof src === 'string' && src).map((src) => toImage(src, rootDir))
    }
    return value
  }
  await transformFields(content, fields, transform)
}
