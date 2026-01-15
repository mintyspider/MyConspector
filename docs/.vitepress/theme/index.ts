// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import './custom.css'

export default {
  extends: DefaultTheme,

  enhanceApp({ router }) {
    if (typeof window === 'undefined') return

    let initialized = false

    const init = () => {
      if (initialized) return
      initialized = true

      /* ───────────────── Прогресс-бар ───────────────── */

      let progress = document.getElementById('reading-progress') as HTMLDivElement | null

      if (!progress) {
        progress = document.createElement('div')
        progress.id = 'reading-progress'
        progress.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: var(--vp-c-brand-1);
          width: 0%;
          z-index: 9999;
          transition: width 0.12s ease-out;
          pointer-events: none;
        `
        document.body.appendChild(progress)
      }

      const updateProgress = () => {
        const scrollTop = window.scrollY
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight

        if (docHeight <= 0) {
          progress!.style.width = '0%'
          return
        }

        const percent = Math.min(
          100,
          Math.round((scrollTop / docHeight) * 100)
        )
        progress!.style.width = `${percent}%`
      }

      window.addEventListener('scroll', updateProgress, { passive: true })
      window.addEventListener('resize', updateProgress, { passive: true })
      updateProgress()

      /* ─────────────── Sidebar toggle ─────────────── */

      const restoreState = () => {
        if (localStorage.getItem('vp-sidebar-hidden') === '1') {
          document.body.classList.add('hide-sidebar')
        }
      }

      const toggleSidebar = () => {
        if (window.innerWidth < 960) return

        const hidden = document.body.classList.toggle('hide-sidebar')
        localStorage.setItem('vp-sidebar-hidden', hidden ? '1' : '0')
      }

      const onKeydown = (e: KeyboardEvent) => {
        if (
          (e.ctrlKey || e.metaKey) &&
          e.code === 'Space' &&
          !e.shiftKey &&
          !e.altKey
        ) {
          e.preventDefault()
          toggleSidebar()
        }
      }

      restoreState()
      document.addEventListener('keydown', onKeydown)
    }

    /* ── Запуск после первого client render ── */
    if (document.readyState === 'complete') {
      init()
    } else {
      window.addEventListener('load', init, { once: true })
    }

    /* ── После переходов между страницами ── */
    router.onAfterRouteChanged = () => {
      requestAnimationFrame(() => {
        const progress = document.getElementById('reading-progress')
        if (progress) {
          progress.style.width = '0%'
        }
      })
    }
  }
} satisfies Theme
