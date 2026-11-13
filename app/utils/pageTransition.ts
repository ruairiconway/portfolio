import { animate } from 'animejs'
import type { TransitionProps } from 'vue'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Default page transition, animated with anime.js. Used on <NuxtPage> in app.vue.
 * The old page fades out, then the new one fades in while rising slightly.
 * With reduced motion, pages swap instantly.
 *
 * To change it per page, set `definePageMeta({ pageTransition: … })` in that page.
 */
export const pageTransition: TransitionProps = {
  mode: 'out-in',
  css: false,

  onLeave(el, done) {
    if (reducedMotion()) return done()
    animate(el, { opacity: [1, 0], duration: 180, ease: 'in(2)', onComplete: () => done() })
  },

  onEnter(el, done) {
    if (reducedMotion()) return done()
    animate(el, {
      opacity: [0, 1],
      y: ['0.5rem', 0],
      duration: 320,
      ease: 'out(3)',
      onComplete: (animation) => {
        // Remove the inline styles, so the page isn't left with a `transform`
        // (which would break `position: fixed` inside it).
        animation.revert()
        done()
      },
    })
  },
}
