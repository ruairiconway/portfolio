import { createScope, type Scope } from 'animejs'
import type { MaybeRefOrGetter } from 'vue'

type ScopeSetup = (scope: Scope) => (() => void) | void

/**
 * anime.js (https://animejs.com) for a component, as an anime.js Scope:
 *
 * - Selectors inside the setup only match elements in `root`, so
 *   `animate('.title', …)` won't touch another component's `.title`.
 * - `scope.matches.reduceMotion` is true when the visitor prefers reduced motion.
 *   The setup re-runs automatically if that setting changes.
 * - Everything is reverted (animations stopped, inline styles removed) when the
 *   component unmounts.
 * - Runs in the browser only, after mount, so it's safe with SSR.
 *
 * Import the animation functions you need from 'animejs' in the component:
 *
 *   import { animate, stagger } from 'animejs'
 *
 *   const root = useTemplateRef('root')
 *   const scope = useAnime(root, (scope) => {
 *     if (scope.matches.reduceMotion) return
 *     animate('.item', { opacity: { from: 0 }, delay: stagger(80) })
 *
 *     // Methods can be called later from event handlers: scope.value?.methods.pulse()
 *     scope.add('pulse', () => animate('.button', { scale: [1, 1.05, 1] }))
 *   })
 *
 * The setup may return a cleanup function for anything that isn't an anime.js
 * object (e.g. a manually added event listener).
 */
export function useAnime(root: MaybeRefOrGetter<HTMLElement | null | undefined>, setup: ScopeSetup) {
  const scope = shallowRef<Scope>()

  onMounted(() => {
    // anime.js types the scope argument as optional, but always passes it.
    scope.value = createScope({
      root: toValue(root) ?? undefined,
      mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' },
    }).add((self) => setup(self!))
  })

  onBeforeUnmount(() => {
    scope.value?.revert()
    scope.value = undefined
  })

  return scope
}
