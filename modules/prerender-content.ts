/**
 * Adds every page to the prerender list, so a page is built even if
 * nothing links to it yet (for example, a new page whose URL path an editor
 * just set in the CMS). The crawler still finds anything that's linked.
 *
 * A page's URL is the `path` saved in its JSON file, or it's derived from the
 * filename, the same way Nuxt Content does it (see content.config.ts).
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { defineNuxtModule } from 'nuxt/kit'

// Content folder -> URL prefix. Keep in sync with `source.prefix` in content.config.ts.
const SOURCES = [
  { dir: 'content/pages', prefix: '' },
]

function readData(file: string): Record<string, unknown> {
  try {
    const data: unknown = JSON.parse(readFileSync(file, 'utf8'))
    return typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {}
  } catch {
    return {} // invalid JSON: Nuxt Content reports it
  }
}

function routesFor(rootDir: string, { dir, prefix }: (typeof SOURCES)[number]): string[] {
  const absolute = join(rootDir, dir)
  if (!existsSync(absolute)) return []

  return readdirSync(absolute, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .flatMap((entry) => {
      const file = join(entry.parentPath, entry.name)
      const data = readData(file)
      if (data.draft === true) return []
      if (typeof data.path === 'string') return [data.path]

      const stem = relative(absolute, file).split(sep).join('/').replace(/\.json$/, '')
      const route = `${prefix}/${stem}`.replace(/\/index$/, '')
      return [route || '/']
    })
}

export default defineNuxtModule({
  meta: { name: 'prerender-content' },
  setup(_options, nuxt) {
    nuxt.hook('nitro:config', (config) => {
      const routes = SOURCES.flatMap((source) => routesFor(nuxt.options.rootDir, source))
      config.prerender ??= {}
      config.prerender.routes = [...new Set([...(config.prerender.routes ?? []), ...routes])]
    })
  },
})
