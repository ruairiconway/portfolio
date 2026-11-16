/**
 * Makes the files in content/ match their fields in cms/, exactly: the fields
 * in cms/ are the only source of truth, and nothing else is kept.
 *
 * For every content file, compared with its fields:
 * - A value whose field no longer exists is removed.
 * - A value of the wrong type (text where the field is now an object, an
 *   option that's no longer in a select…) is replaced with the field's
 *   default or an empty value of the right type, or removed if the field is
 *   optional.
 * - A list item or object of a type that no longer exists is removed.
 * - A missing required field gets its default, or an empty value of the right
 *   type ('' for text, false, [] or {}), so the CMS shows what needs filling in.
 * - A field marked `renamedFrom: 'oldName'` takes the value saved under the old name.
 * - Keys are put in field order, as the CMS saves them.
 *
 * Only a required field that has no default and no possible empty value (an
 * image, file, relation, number or select) can't be fixed; it's reported.
 *
 * In dev the files are synced automatically (./index.ts); `pnpm generate`
 * fails if any file doesn't match, and `pnpm cms:sync` syncs by hand.
 *
 * Which files belong to which fields comes from the built CMS config: a
 * folder collection's `folder` + `extension`, and the `file` of each file in a
 * collection and of each singleton.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { extname, join, relative, sep } from 'node:path'
import { parse, stringify } from 'yaml'
import { isObject, type CmsBuild, type Obj } from './build'

export interface ContentChange {
  /** Content file, relative to the project root. */
  file: string
  /** Where in the file, e.g. "items[0].link". Empty for the whole file. */
  path: string
  message: string
  /** `fixed`: syncing changes it. `unfixable`: needs a value in the CMS. */
  kind: 'fixed' | 'unfixable'
}

interface ContentFile {
  file: string
  fields: Obj[]
  format: 'json' | 'yaml' | 'frontmatter'
}

// ── Finding the files ────────────────────────────────────────────────────────

const formatOf = (file: string, format?: unknown): ContentFile['format'] => {
  if (format === 'json' || format === 'yaml' || format === 'frontmatter') return format
  if (format === 'yml') return 'yaml'
  const ext = extname(file).slice(1)
  if (ext === 'json') return 'json'
  if (ext === 'yml' || ext === 'yaml') return 'yaml'
  return 'frontmatter'
}

const fieldsOf = (entry: Obj): Obj[] => (Array.isArray(entry.fields) ? entry.fields.filter(isObject) : [])
const typesOf = (field: Obj): Obj[] => (Array.isArray(field.types) ? field.types.filter(isObject) : [])

function listFiles(rootDir: string, folder: string, extension: string): string[] {
  const absolute = join(rootDir, folder)
  if (!existsSync(absolute)) return []
  return readdirSync(absolute, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(`.${extension}`))
    .map((entry) => relative(rootDir, join(entry.parentPath, entry.name)).split(sep).join('/'))
    .sort()
}

function contentFiles(build: CmsBuild, rootDir: string): ContentFile[] {
  const result: ContentFile[] = []
  const list = (value: unknown) => (Array.isArray(value) ? value.filter(isObject) : [])
  const add = (entry: Obj) => {
    if (typeof entry.file === 'string') result.push({ file: entry.file, fields: fieldsOf(entry), format: formatOf(entry.file, entry.format) })
  }

  for (const collection of list(build.config.collections)) {
    if (typeof collection.folder === 'string') {
      const extension = typeof collection.extension === 'string' ? collection.extension : 'md'
      for (const file of listFiles(rootDir, collection.folder, extension)) {
        result.push({ file, fields: fieldsOf(collection), format: formatOf(file, collection.format) })
      }
    }
    list(collection.files).forEach(add)
  }
  list(build.config.singletons).forEach(add)
  return result
}

// ── Reading and writing ──────────────────────────────────────────────────────

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n?---(\r?\n|$)/

function read(rootDir: string, { file, format }: ContentFile): { data: Obj; body: string } {
  const text = readFileSync(join(rootDir, file), 'utf8')
  let data: unknown
  let body = ''
  if (format === 'json') data = JSON.parse(text)
  else if (format === 'yaml') data = parse(text)
  else {
    const match = text.match(FRONTMATTER)
    data = match ? parse(match[1]!) : {}
    body = match ? text.slice(match[0].length) : text
  }
  return { data: isObject(data) ? data : {}, body }
}

const toYaml = (data: Obj) => stringify(data, { lineWidth: 0, singleQuote: true })

function serialize({ format }: ContentFile, data: Obj, body: string): string {
  if (format === 'json') return JSON.stringify(data, null, 2) + '\n'
  if (format === 'yaml') return toYaml(data)
  return `---\n${toYaml(data)}---\n${body}`
}

// ── Types ────────────────────────────────────────────────────────────────────

const isMissing = (value: unknown) => value === undefined || value === null

/** Needs a value in the file. A missing list is simply empty, so it's never filled in. */
const isRequired = (field: Obj) => field.required !== false && field.widget !== 'hidden' && field.widget !== 'list'

const renamedFrom = (field: Obj): string[] =>
  typeof field.renamedFrom === 'string' ? [field.renamedFrom] : Array.isArray(field.renamedFrom) ? field.renamedFrom.map(String) : []

const TEXT_WIDGETS = new Set(['string', 'text', 'markdown', 'richtext', 'color', 'uuid', 'map'])
const PATH_WIDGETS = new Set(['image', 'file', 'relation'])

const optionValues = (field: Obj): unknown[] =>
  Array.isArray(field.options) ? field.options.map((option) => (isObject(option) ? option.value : option)) : []

/** Whether a leaf value (not an object or list field) has the field's type. */
function isValidLeaf(field: Obj, value: unknown): boolean {
  const widget = String(field.widget ?? 'string')
  const one = (item: unknown): boolean => {
    if (widget === 'select') return optionValues(field).includes(item)
    if (PATH_WIDGETS.has(widget)) return typeof item === 'string'
    return true
  }
  if (widget === 'select' || PATH_WIDGETS.has(widget)) {
    return field.multiple === true ? Array.isArray(value) && value.every(one) : one(value)
  }
  if (widget === 'boolean') return typeof value === 'boolean'
  if (widget === 'number') return typeof value === 'number'
  if (widget === 'datetime') return typeof value === 'string' || value instanceof Date
  if (widget === 'keyvalue') return isObject(value) && Object.values(value).every((item) => typeof item === 'string')
  if (TEXT_WIDGETS.has(widget)) return typeof value === 'string'
  return true // hidden, code, compute, and anything else: any value
}

const NONE = Symbol('none')

/** The value a required field gets when it has none: its default, or an empty value of its type. */
function emptyValue(field: Obj): unknown {
  if (field.default !== undefined) return structuredClone(field.default)
  const widget = String(field.widget ?? 'string')
  if (widget === 'list' || field.multiple === true) return []
  if (widget === 'boolean') return false
  if (widget === 'keyvalue') return {}
  if (widget === 'object') {
    const types = typesOf(field)
    if (field.types) {
      const first = types[0]
      if (!first) return NONE
      return fillRequired(fieldsOf(first), { [String(field.typeKey ?? 'type')]: first.name })
    }
    return fillRequired(fieldsOf(field), {})
  }
  if (TEXT_WIDGETS.has(widget) || widget === 'datetime') return ''
  return NONE // image, file, relation, number, select: no empty value of that type
}

/** An object with every required field filled in, for a new empty object. */
function fillRequired(fields: Obj[], data: Obj): Obj | typeof NONE {
  for (const field of fields) {
    if (!isRequired(field)) continue
    const value = emptyValue(field)
    if (value === NONE) return NONE
    data[String(field.name)] = value
  }
  return data
}

// ── Walking the fields ───────────────────────────────────────────────────────

const REMOVE = Symbol('remove')

type Report = (path: string, message: string, kind?: ContentChange['kind']) => void

const at = (path: string, key: string | number) => (typeof key === 'number' ? `${path}[${key}]` : path ? `${path}.${key}` : key)

function describe(value: unknown): string {
  if (Array.isArray(value)) return 'a list'
  if (isObject(value)) return `an object (${Object.keys(value).join(', ') || 'empty'})`
  if (typeof value === 'string') return `the text ${JSON.stringify(value.length > 40 ? `${value.slice(0, 40)}…` : value)}`
  return JSON.stringify(value)
}

/** The object, rebuilt from its fields alone, in field order. */
function walkObject(fields: Obj[], data: Obj, path: string, report: Report, keep: string[] = []): Obj {
  const out: Obj = {}
  for (const key of keep) out[key] = data[key]
  const used = new Set(keep)

  for (const field of fields) {
    const name = String(field.name)
    const fieldPath = at(path, name)
    used.add(name)
    let value = data[name]

    if (isMissing(value)) {
      const old = renamedFrom(field).find((key) => !isMissing(data[key]))
      if (old) {
        used.add(old)
        value = data[old]
        report(fieldPath, `moved from its old name "${old}"`)
      }
    }

    if (!isMissing(value)) {
      const result = walkValue(field, value, fieldPath, report)
      if (result !== REMOVE) {
        out[name] = result
        continue
      }
    }

    // No value, or one that had to go.
    if (!isRequired(field)) continue
    const empty = emptyValue(field)
    if (empty === NONE) {
      report(fieldPath, `the "${field.label ?? name}" field is required and has no value; set it in the CMS`, 'unfixable')
      continue
    }
    out[name] = empty
    report(fieldPath, field.default !== undefined ? `set to its default, ${JSON.stringify(empty)}` : `set to ${JSON.stringify(empty)}: required, fill it in in the CMS`)
  }

  for (const key of Object.keys(data)) {
    if (!used.has(key)) report(at(path, key), `removed ${describe(data[key])}: not a field`)
  }
  return out
}

/** A value of an object or list item with `types`. REMOVE if its type no longer exists. */
function walkVariant(field: Obj, value: unknown, path: string, report: Report): unknown {
  if (!isObject(value)) {
    report(path, `removed ${describe(value)}: expected an object`)
    return REMOVE
  }
  const typeKey = String(field.typeKey ?? 'type')
  const variant = typesOf(field).find((type) => type.name === value[typeKey])
  if (!variant) {
    report(path, `removed: "${value[typeKey]}" isn't a type any more`)
    return REMOVE
  }
  return walkObject(fieldsOf(variant), value, path, report, [typeKey])
}

/** The value, made to match its field. REMOVE if nothing of it can be kept. */
function walkValue(field: Obj, value: unknown, path: string, report: Report): unknown {
  const widget = field.widget ?? 'string'

  if (widget === 'object') {
    if (field.types) return walkVariant(field, value, path, report)
    if (!isObject(value)) {
      report(path, `removed ${describe(value)}: expected an object`)
      return REMOVE
    }
    return walkObject(fieldsOf(field), value, path, report)
  }

  if (widget === 'list') {
    if (!Array.isArray(value)) {
      report(path, `removed ${describe(value)}: expected a list`)
      return REMOVE
    }
    const items: unknown[] = []
    value.forEach((item, index) => {
      const itemPath = at(path, index)
      let result: unknown = item
      if (field.types) result = walkVariant(field, item, itemPath, report)
      else if (field.fields) {
        if (isObject(item)) result = walkObject(fieldsOf(field), item, itemPath, report)
        else {
          report(itemPath, `removed ${describe(item)}: expected an object`)
          result = REMOVE
        }
      } else if (isObject(field.field)) result = walkValue(field.field, item, itemPath, report)
      else if (typeof item !== 'string') {
        report(itemPath, `removed ${describe(item)}: expected text`)
        result = REMOVE
      }
      if (result !== REMOVE) items.push(result)
    })
    return items
  }

  if (!isValidLeaf(field, value)) {
    report(path, `removed ${describe(value)}: wrong type for a ${widget} field`)
    return REMOVE
  }
  return value
}

/**
 * In a Markdown file, a top-level Markdown field named `body` is the text
 * after the frontmatter, not a frontmatter value, so it's skipped.
 */
const frontmatterFields = (content: ContentFile) =>
  content.format === 'frontmatter'
    ? content.fields.filter((field) => !(field.name === 'body' && (field.widget === 'markdown' || field.widget === 'richtext')))
    : content.fields

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Compares every content file with its fields. With `write`, saves the synced
 * files. `changes` lists every difference; `files` the files that differ.
 */
export function syncContent(build: CmsBuild, rootDir: string, { write }: { write: boolean }) {
  const changes: ContentChange[] = []
  const files: string[] = []

  for (const content of contentFiles(build, rootDir)) {
    if (!existsSync(join(rootDir, content.file))) continue // created by the CMS on first save
    let parsed: { data: Obj; body: string }
    try {
      parsed = read(rootDir, content)
    } catch (error) {
      changes.push({ file: content.file, path: '', message: `can't be read: ${(error as Error).message}`, kind: 'unfixable' })
      continue
    }
    const report: Report = (path, message, kind = 'fixed') => changes.push({ file: content.file, path, message, kind })
    const data = walkObject(frontmatterFields(content), parsed.data, '', report)
    // Compared as data (key order included), so formatting alone, like the
    // CMS's own quoting or indentation, never counts as a difference.
    if (JSON.stringify(data) !== JSON.stringify(parsed.data)) {
      files.push(content.file)
      if (!changes.some((change) => change.file === content.file)) report('', 'keys put in field order')
      if (write) writeFileSync(join(rootDir, content.file), serialize(content, data, parsed.body))
    }
  }
  return { files, changes }
}

/** Changes as readable lines, grouped by file. */
export function formatChanges(changes: ContentChange[]): string {
  const byFile = new Map<string, ContentChange[]>()
  for (const change of changes) byFile.set(change.file, [...(byFile.get(change.file) ?? []), change])
  return [...byFile]
    .map(([file, list]) =>
      [`  ${file}`, ...list.map((change) => `    ${change.kind === 'unfixable' ? '✖' : '•'} ${change.path || '(file)'}: ${change.message}`)].join('\n'),
    )
    .join('\n')
}
