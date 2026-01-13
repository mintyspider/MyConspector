// .vitepress/theme/index.ts
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import './custom.css'  // ← можно подключить стили сюда

export default {
  extends: DefaultTheme,

  // Используем хук Layout (вызывается на каждой странице)
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Можно добавить слоты, если нужно
      // 'nav-bar-title-after': () => h('div', 'мой текст'),
    })
  },

  enhanceApp({ router, app }) {
    // Ждём, пока Vue смонтируется (чтобы window и DOM были доступны)
    if (typeof window === 'undefined') return

    // Создаём элемент один раз
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

    // Функция обновления
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

    // Слушатели
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    // Первый вызов + при смене страницы
    router.onAfterRouteChanged = () => {
      // Даём DOM время обновиться после роутинга
      setTimeout(updateProgress, 100)
    }

    // Начальный вызов
    setTimeout(updateProgress, 50)
  }
} satisfies Theme