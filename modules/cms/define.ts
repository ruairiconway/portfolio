/**
 * Typed helpers for the files in cms/. Each file default-exports one of these,
 * so your editor checks every option against Sveltia CMS's own types (from
 * @sveltia/cms) and autocompletes them.
 *
 *   defineCms()    a piece of the Sveltia config: cms/config.ts, and any file
 *                  adding collections or singletons (cms/pages/…, cms/app.ts)
 *   defineBlock()  a page block: cms/components/blocks/<Name>.ts
 *   defineField()  a shared field: cms/fields/<name>.ts or
 *                  cms/components/partials/<Name>.ts. Import it where it's used.
 *   defineEmbed()  lets editors insert a partial into rich text:
 *                  `export const embed = defineEmbed({...})` in
 *                  cms/components/partials/<Name>.ts (see ./embeds.ts)
 *   blocks         every page block, for a list field's `types`
 *   embeds         every embed, for a rich text field's `editor_components`
 *
 * The helpers only add types: they return what they're given.
 */
import type {
  CmsConfig,
  CollectionFile,
  EditorComponentDefinition,
  EntryCollection,
  FileCollection,
  StandardField,
  VariableFieldType,
} from '@sveltia/cms'

// Sveltia's own `Field` type also allows custom widgets, typed as any widget
// name with any options, which would let every typo through. These types allow
// only the built-in widgets, at every depth (fields inside objects, lists and
// blocks), so a misspelt option or widget name is an error.
type Strict<T> = {
  [K in keyof T]: K extends 'fields'
    ? CmsField[]
    : K extends 'field'
      ? CmsField
      : K extends 'types'
        ? CmsBlockType[]
        : K extends 'files'
          ? CmsFile[]
          : T[K]
}

/** Options read by modules/cms only, removed from the Sveltia config. */
interface BuildOnlyFieldOptions {
  /**
   * The field's old name(s). `pnpm cms:sync` moves values saved under an old
   * name to this one. Remove it once the content has been synced.
   */
  renamedFrom?: string | string[]
}

/** A field with one of Sveltia's built-in widgets. */
export type CmsField = StandardField extends infer F ? (F extends unknown ? Strict<F> & BuildOnlyFieldOptions : never) : never
type CmsBlockType = Strict<VariableFieldType>
type CmsFile = Strict<CollectionFile>

/**
 * An item that's merged with others of the same `name`, so every other option
 * is optional. A file collection's `files` are merged by name too, so they can
 * be listed by name alone (e.g. in cms/config.ts, to set their order).
 */
type Named<T> = T extends unknown
  ? Partial<Omit<Strict<T>, 'files'>> & { name: string } & ('files' extends keyof T ? { files?: Named<CollectionFile>[] } : unknown)
  : never

/**
 * A piece of the Sveltia config. The pieces are deep-merged (cms/config.ts
 * first), with collections, singletons, files and fields merged by `name`, so
 * several files can add to one collection.
 */
export interface CmsPartial extends Omit<Partial<CmsConfig>, 'collections' | 'singletons'> {
  collections?: Named<EntryCollection | FileCollection>[]
  singletons?: Named<CollectionFile>[]
}

export const defineCms = (config: CmsPartial): CmsPartial => config

/** A page block. Its name comes from the filename (PullQuote.ts -> "pull-quote"). */
export const defineBlock = (block: Omit<CmsBlockType, 'name'>): Omit<CmsBlockType, 'name'> => block

export const defineField = <T extends CmsField>(field: T): T => field

/**
 * A partial that editors can insert into rich text (an editor component in
 * Sveltia). Its field names must match the partial's props: the values are
 * passed to <Name> as props. Image fields arrive as CmsImage objects
 * ({ src, width, height }), like everywhere else.
 */
export interface CmsEmbed
  extends Pick<EditorComponentDefinition, 'label' | 'icon' | 'trigger' | 'mode' | 'summary' | 'thumbnail' | 'collapsed'> {
  fields: CmsField[]
}

export const defineEmbed = (embed: CmsEmbed): CmsEmbed => embed

/**
 * Every embed, filled in at build time, for a rich text field:
 *   editor_components: ['table', 'hr', embeds]
 */
export const embeds = '@embeds'

/**
 * Every block in cms/components/blocks/, filled in at build time:
 *   { name: 'blocks', widget: 'list', types: blocks }
 */
export const blocks = '@blocks' as unknown as CmsBlockType[]
