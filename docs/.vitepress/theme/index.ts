// .vitepress/theme/index.ts
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import './custom.css'

export default {
  extends: DefaultTheme,

  enhanceApp({ router }) {
    if (typeof window === 'undefined') return

    // ── Прогресс-бар чтения ─────────────────────────────────────────────
    const progress = document.createElement('div')
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

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight

      if (docHeight <= 0) {
        progress.style.width = '0%'
        return
      }

      const percent = Math.min(100, Math.round((scrollTop / docHeight) * 100))
      progress.style.width = `${percent}%`
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    // ── Горячая клавиша Ctrl + Пробел для переключения сайдбара ────────
    const setupSidebarToggle = () => {
      // Стили (добавляем только один раз)
      if (!document.getElementById('sidebar-toggle-styles')) {
        const style = document.createElement('style')
        style.id = 'sidebar-toggle-styles'
        style.textContent = `
          body.hide-sidebar .VPSidebar,
          body.hide-sidebar .VPSidebarNav,
          body.hide-sidebar aside[data-sidebar] {
            transform: translateX(-100%) !important;
            opacity: 0 !important;
            visibility: hidden !important;
            width: 0 !important;
            pointer-events: none !important;
            transition: all 0.3s ease;
          }

          body.hide-sidebar .VPContent,
          body.hide-sidebar main.VPContent {
            --sidebar-width: 0px !important;
            margin-left: 0 !important;
            max-width: 100% !important;
            transition: margin-left 0.3s ease, max-width 0.3s ease;
          }

          @media (min-width: 960px) {
            body.hide-sidebar .VPContent {
              padding-left: 32px !important;
            }
          }
        `
        document.head.appendChild(style)
      }

      // Функция переключения
      const toggleSidebar = () => {
        document.body.classList.toggle('hide-sidebar')
        const isHidden = document.body.classList.contains('hide-sidebar')
        localStorage.setItem('vp-sidebar-hidden', isHidden ? '1' : '0')
      }

      // Восстанавливаем состояние из localStorage
      if (localStorage.getItem('vp-sidebar-hidden') === '1') {
        document.body.classList.add('hide-sidebar')
      }

      // Горячая клавиша Ctrl + Space (пробел)
      const hotkeyHandler = (e: KeyboardEvent) => {
        // Ctrl + Пробел (или Cmd + Пробел на Mac)
        if ((e.ctrlKey || e.metaKey) && e.code === 'Space' && !e.shiftKey && !e.altKey) {
          e.preventDefault()
          e.stopPropagation()
          toggleSidebar()
        }
      }

      // Удаляем старый слушатель (если был) и добавляем новый
      document.removeEventListener('keydown', hotkeyHandler, true)
      document.addEventListener('keydown', hotkeyHandler, true) // capture phase — выше других обработчиков
    }

    // ── Инициализация ──────────────────────────────────────────────────
    setTimeout(() => {
      updateProgress()
      setupSidebarToggle()
    }, 150)

    // После смены маршрута (страницы)
    router.onAfterRouteChanged = () => {
      setTimeout(() => {
        updateProgress()
        setupSidebarToggle()
      }, 150)
    }
  }
} satisfies Theme