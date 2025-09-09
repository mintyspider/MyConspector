import { defineConfig } from "vitepress";
import { sidebar } from "./sidebar";
import { navigation } from "./navigation";
import mathjax3 from 'markdown-it-mathjax3';

export default defineConfig({
  lang: 'ru',
  title: "MyConspector",
  description: "База знаний ИСиТ ПетрГУ",
  base: "/MyConspector/",
  themeConfig: {
    logo: '/mascot.png',
    darkModeSwitchLabel: 'Сменить тему',
    outline: {
      label: 'Оглавление', 
      level: 'deep'
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/mintyspider/MyConspector",
      },
    ],
    docFooter: {
      prev: 'Предыдущая страница',
      next: 'Следующая страница'
    },
    sidebar,
    nav: navigation,
    footer: {
      message: "Опубликовано под лицензией MIT",
      copyright: "©mintyspider 2025 – настоящее время",
    },
    sidebarMenuLabel: "Меню",
    returnToTopLabel: "Наверх",
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Поиск',
            buttonAriaLabel: 'Поиск',
          },
          modal: {
            displayDetails: 'Отобразить подробный список',
            resetButtonTitle: 'Сбросить поиск',
            backButtonTitle: 'Закрыть поиск',
            noResultsText: 'Нет результатов по запросу',
            footer: {
              selectText: 'Выбрать',
              navigateText: 'Перейти',
              closeText: 'Закрыть'
            }
          }
        }
      }
    }
  },
  cleanUrls: true,
  markdown: {
    config: (md) => {
      // Подключаем плагин
      md.use(mathjax3);
    }
  },
  head: [
    ['script', { 
      src: 'https://polyfill.io/v3/polyfill.min.js?features=es6' 
    }],
    ['script', {
      id: 'MathJax-script',
      src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
    }],
    ['link', { rel: 'icon', href: '/MyConspector/favicon.ico' }]
  ]
});
