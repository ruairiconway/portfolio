/**
 * Generates TypeScript types from the CMS field definitions in cms/, as the
 * `#cms` module:
 *
 *   import type { QuoteBlock, Block, SeoField, PagesEntry } from '#cms'
 *
 * - <Name>Block for each file in cms/components/blocks/ (Quote.yml -> QuoteBlock),
 *   with `type` set to the block's name, plus `Block`, a union of all of them.
 * - <Name>Field for each shared field in cms/fields/ and cms/components/partials/
 *   (seo.yml -> SeoField, CmsVideo.yml -> CmsVideoField).
 * - <Name>Entry for each folder collection: one entry's data (pages -> PagesEntry).
 * - <Collection><File>File for each file in a files collection
 *   (navigation/header -> NavigationHeaderFile).
 * - <Name>Singleton for each singleton (site -> SiteSingleton).
 *
 * These describe the data as the CMS saves it. For data read with
 * queryCollection(), Nuxt Content's own types match these (its schemas are
 * generated from the same fields, see ./schema.ts) plus fields it adds, like `path`.
 *
 * Sveltia widgets map to the type of the value they save, except two that are
 * transformed at build time (./transform.ts): `markdown` is a parsed tree
 * (MDCRoot) to render with <MDCRenderer :body="…">, and `image` is a CmsImage
 * ({ src, width, height }) to render with <CmsImage>. A Markdown file's own
 * `body` is left out of entry types, since Nuxt Content provides it.
 * Fields with `required: false`, and booleans (which can be absent), are optional.
 */
import { isObject, refToFile, type CmsBuild, type Obj } from './build'

const toPascal = (value: string) =>
  value.replace(/(^|[-_\s]+)([a-zA-Z0-9])/g, (_match, _separator, char: string) => char.toUpperCase())

const isIdentifier = (value: string) => /^[A-Za-z_$][\w$]*$/.test(value)

const comment = (field: Obj, pad: string) => {
  const text = [field.label, field.hint].filter((part) => typeof part === 'string' && part).join(' — ')
  return text ? `${pad}/** ${String(text).replace(/\*\//g, '*\\/')} */\n` : ''
}

// Block names ("quote") -> generated type names ("QuoteBlock"), so fields that
// hold blocks refer to the named types instead of repeating them.
let blockTypeNames = new Map<string, string>()
// Shared field definitions (as JSON) -> type names ("SeoField"), for the same reason.
let sharedFieldTypes = new Map<string, string>()

function objectType(fields: unknown, depth: number): string {
  if (!Array.isArray(fields) || !fields.length) return 'Record<string, unknown>'
  const pad = '  '.repeat(depth + 1)
  const lines = fields.filter(isObject).map((field) => {
    const name = String(field.name)
    const key = isIdentifier(name) ? name : JSON.stringify(name)
    // Matches ./schema.ts: anything that can be absent from saved data is optional.
    const optional =
      field.required === false || field.default !== undefined || field.widget === 'boolean' || field.widget === 'hidden'
    const type = sharedFieldTypes.get(JSON.stringify(field)) ?? fieldType(field, depth + 1)
    return `${comment(field, pad)}${pad}${key}${optional ? '?' : ''}: ${type}`
  })
  return `{\n${lines.join('\n')}\n${'  '.repeat(depth)}}`
}

function variantsType(types: unknown, typeKey: string, depth: number): string {
  if (!Array.isArray(types) || !types.length) return 'never'
  const variants = types.filter(isObject)
  if (typeKey === 'type' && variants.every((variant) => blockTypeNames.has(String(variant.name)))) {
    const names = variants.map((variant) => blockTypeNames.get(String(variant.name))!)
    return names.length === blockTypeNames.size ? 'Block' : names.join(' | ')
  }
  return variants
    .map((variant) => {
      const fields = [{ name: typeKey, widget: 'select', options: [variant.name] }, ...((variant.fields as Obj[]) ?? [])]
      return objectType(fields, depth)
    })
    .join(' | ')
}

function fieldType(field: Obj, depth: number): string {
  const multiple = field.multiple === true
  const many = (type: string) => (multiple ? `Array<${type}>` : type)

  switch (field.widget ?? 'string') {
    case 'boolean':
      return 'boolean'
    case 'number':
      return 'number'
    case 'select': {
      const values = Array.isArray(field.options)
        ? field.options.map((option) => (isObject(option) ? option.value : option))
        : []
      return many(values.length ? values.map((value) => JSON.stringify(value)).join(' | ') : 'string')
    }
    case 'image':
      return many('CmsImage')
    case 'file':
    case 'relation':
      return many('string')
    case 'keyvalue':
      return 'Record<string, string>'
    case 'hidden':
      return 'unknown'
    case 'object':
      return field.types
        ? variantsType(field.types, String(field.typeKey ?? 'type'), depth)
        : objectType(field.fields, depth)
    case 'list':
      if (field.types) return `Array<${variantsType(field.types, String(field.typeKey ?? 'type'), depth)}>`
      if (field.fields) return `Array<${objectType(field.fields, depth)}>`
      if (isObject(field.field)) return `Array<${fieldType(field.field, depth)}>`
      return 'string[]'
    case 'markdown':
      return 'MDCRoot'
    default:
      // string, text, richtext, datetime, color, code, map, uuid, compute
      return 'string'
  }
}

/** "@fields/seo" -> "SeoField", "@partials/CmsVideo" -> "CmsVideoField" */
const fieldTypeName = (ref: string) => `${toPascal(ref.split('/').pop()!)}Field`

export function generateTypes({ config, blocks, fields }: CmsBuild): string {
  blockTypeNames = new Map(blocks.map(({ name }) => [name, `${toPascal(name)}Block`]))
  // Registered before anything is written, so blocks can refer to shared fields too.
  sharedFieldTypes = new Map(
    [...fields].map(([ref, field]) => [JSON.stringify(field), fieldTypeName(ref)]),
  )

  const out: string[] = [
    '// GENERATED by modules/cms from cms/. Do not edit; change the files in cms/ instead.',
    '// Import with: import type { QuoteBlock } from \'#cms\'',
    '',
    "declare module '#cms' {",
    "  import type { MDCRoot } from '@nuxtjs/mdc'",
    '',
    '  /** An image field, with its dimensions read at build time. Render with <CmsImage>. */',
    '  export interface CmsImage {',
    '    /** Site-relative path (/images/uploads/…) or URL */',
    '    src: string',
    '    /** Intrinsic width in px. Absent for external URLs or unreadable files. */',
    '    width?: number',
    '    /** Intrinsic height in px. Absent for external URLs or unreadable files. */',
    '    height?: number',
    '  }',
    '',
  ]

  const blockNames: string[] = []
  for (const { file, name, definition } of blocks) {
    const typeName = `${toPascal(name)}Block`
    blockNames.push(typeName)
    const typeField = { name: 'type', widget: 'select', options: [name] }
    out.push(
      `  /** ${definition.label ?? name} block. Fields: ${file} */`,
      `  export interface ${typeName} ${objectType([typeField, ...((definition.fields as Obj[]) ?? [])], 1)}`,
      '',
    )
  }
  out.push(
    '  /** Any page block. Narrow it by `type`. */',
    // With no blocks yet, a bare shape keeps code that handles blocks generically
    // (like <BlockRenderer>) type-checking.
    `  export type Block = ${blockNames.length ? blockNames.join(' | ') : '{ type: string }'}`,
    '',
  )

  for (const [ref, field] of fields) {
    const typeName = fieldTypeName(ref)
    out.push(
      `  /** ${field.label ?? ref}. Fields: cms/${refToFile(ref)}, used as \`- '${ref}'\` */`,
      `  export type ${typeName} = ${fieldType(field, 1)}`,
      '',
    )
  }

  const describe = (item: Obj) => {
    const where = item.folder ? ` Saved in ${item.folder}/.` : item.file ? ` Saved in ${item.file}.` : ''
    return `${item.label ?? item.name}.${where}`
  }

  for (const collection of Array.isArray(config.collections) ? config.collections.filter(isObject) : []) {
    const name = toPascal(String(collection.name))
    if (Array.isArray(collection.fields)) {
      // A frontmatter collection's `body` is the file's own Markdown body, which Nuxt Content provides.
      const fileBody = (field: Obj) => collection.format === 'frontmatter' && field.name === 'body'
      const entryFields = collection.fields.filter((field) => !(isObject(field) && fileBody(field)))
      out.push(`  /** One entry of ${describe(collection)} */`, `  export interface ${name}Entry ${objectType(entryFields, 1)}`, '')
    }
    for (const file of Array.isArray(collection.files) ? collection.files.filter(isObject) : []) {
      out.push(
        `  /** ${describe(file)} (${collection.label ?? collection.name}) */`,
        `  export interface ${name}${toPascal(String(file.name))}File ${objectType(file.fields, 1)}`,
        '',
      )
    }
  }

  for (const singleton of Array.isArray(config.singletons) ? config.singletons.filter(isObject) : []) {
    out.push(
      `  /** ${describe(singleton)} */`,
      `  export interface ${toPascal(String(singleton.name))}Singleton ${objectType(singleton.fields, 1)}`,
      '',
    )
  }

  out.push('}', '')
  return out.join('\n')
}
