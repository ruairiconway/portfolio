/**
 * Builds Nuxt Content (zod) schemas from the CMS field definitions in cms/, so
 * content.config.ts doesn't repeat them and `queryCollection()` results are
 * typed from the same fields the CMS edits:
 *
 *   schema: cmsSchema({ collection: 'posts' }, { omit: ['body'] })
 *   schema: cmsSchema({ collection: 'navigation', file: 'header' })
 *   schema: cmsSchema({ singleton: 'site' })
 *
 * Mapping, per field:
 * - The value type follows the widget, the same as the #cms types (./types.ts).
 *   `markdown` and `image` fields are transformed at build time (./transform.ts),
 *   into a parsed tree and `{ src, width, height }` respectively.
 * - On top-level fields, a `default` becomes the schema default and lists
 *   default to []. Nuxt Content fills those in when a file leaves them out.
 *   Nested fields with a default are optional instead, since nothing fills them.
 * - Fields with `required: false`, booleans and hidden fields are optional.
 * - Lists with `types` (like page blocks) become a union keyed on `type`.
 */
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import { buildCms, isObject, isParsedMarkdown, type Obj } from './build'

type Target = { collection: string; file?: string } | { singleton: string }

const SOURCE_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../cms')

let cached: Obj | undefined
const cmsConfig = () => (cached ??= buildCms(SOURCE_DIR).config)

function findFields(target: Target): Obj[] {
  const config = cmsConfig()
  const byName = (list: unknown, name: string) =>
    Array.isArray(list) ? list.find((item) => isObject(item) && item.name === name) : undefined

  let entry: unknown
  let label: string
  if ('singleton' in target) {
    entry = byName(config.singletons, target.singleton)
    label = `singleton "${target.singleton}"`
  } else {
    const collection = byName(config.collections, target.collection)
    entry = target.file && isObject(collection) ? byName(collection.files, target.file) : collection
    label = target.file ? `file "${target.file}" in collection "${target.collection}"` : `collection "${target.collection}"`
  }
  if (!isObject(entry) || !Array.isArray(entry.fields)) {
    throw new Error(`cmsSchema: no ${label} with fields found in cms/`)
  }
  return entry.fields.filter(isObject)
}

function objectSchema(fields: unknown, topLevel = false): z.ZodObject {
  const shape: Record<string, z.ZodType> = {}
  if (Array.isArray(fields)) {
    for (const field of fields.filter(isObject)) shape[String(field.name)] = fieldSchema(field, topLevel)
  }
  return z.object(shape)
}

function variantsSchema(types: unknown, typeKey: string): z.ZodType {
  const variants = (Array.isArray(types) ? types.filter(isObject) : []).map((variant) =>
    objectSchema(variant.fields).extend({ [typeKey]: z.literal(String(variant.name)) }),
  )
  if (variants.length === 0) return z.never()
  if (variants.length === 1) return variants[0]!
  return z.discriminatedUnion(typeKey, variants as [z.ZodObject, z.ZodObject, ...z.ZodObject[]])
}

function valueSchema(field: Obj): z.ZodType {
  const many = (schema: z.ZodType) => (field.multiple === true ? z.array(schema) : schema)

  switch (field.widget ?? 'string') {
    case 'boolean':
      return z.boolean()
    case 'number':
      return z.number()
    case 'select': {
      const values = Array.isArray(field.options)
        ? field.options.map((option) => (isObject(option) ? option.value : option))
        : []
      if (values.length && values.every((value) => typeof value === 'string')) {
        return many(z.enum(values as [string, ...string[]]))
      }
      return many(values.length ? z.union(values.map((value) => z.literal(value as string | number))) : z.string())
    }
    case 'image':
      return many(z.object({ src: z.string(), width: z.number().optional(), height: z.number().optional() }))
    case 'file':
    case 'relation':
      return many(z.string())
    case 'keyvalue':
      return z.record(z.string(), z.string())
    case 'hidden':
      return z.unknown()
    case 'object':
      return field.types ? variantsSchema(field.types, String(field.typeKey ?? 'type')) : objectSchema(field.fields)
    case 'list':
      if (field.types) return z.array(variantsSchema(field.types, String(field.typeKey ?? 'type')))
      if (field.fields) return z.array(objectSchema(field.fields))
      if (isObject(field.field)) return z.array(valueSchema(field.field))
      return z.array(z.string())
    case 'markdown':
    case 'richtext':
      // Parsed at build time (./transform.ts) into an MDC tree, unless it's HTML.
      if (!isParsedMarkdown(field)) return z.string()
      return z.looseObject({ type: z.literal('root'), children: z.array(z.any()) })
    default:
      return z.string()
  }
}

function fieldSchema(field: Obj, topLevel: boolean): z.ZodType {
  const schema = valueSchema(field)
  if (topLevel && field.default !== undefined) return schema.default(field.default as never)
  if (topLevel && field.widget === 'list') return schema.default([] as never)
  const optional =
    field.required === false || field.default !== undefined || field.widget === 'boolean' || field.widget === 'hidden'
  return optional ? schema.optional() : schema
}

/**
 * The zod schema for a collection, a file in a collection, or a singleton in cms/.
 * `omit` drops fields Nuxt Content provides itself, e.g. `body` (the Markdown
 * body) or `path` (the page URL) on `type: 'page'` collections.
 */
export function cmsSchema(target: Target, { omit = [] }: { omit?: string[] } = {}) {
  return objectSchema(
    findFields(target).filter((field) => !omit.includes(String(field.name))),
    true,
  )
}
