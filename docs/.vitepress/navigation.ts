import { DefaultTheme } from "vitepress";

export const navigation: DefaultTheme.NavItem[] = [
  {
    text: "Все дисциплины",
    activeMatch: "^/disciplines/",
    items: [
      {
        text: "Алгоритмы и структуры данных",
        link: "/disciplines/algos/",
      },
      {
        text: "Базы данных",
        link: "/disciplines/db/",
      },
      {
        text: "Киберимунная методология разработки ПО",
        link: "/disciplines/kirpo/",
      },
      {
        text: "Проектирование информационных систем",
        link: "/disciplines/pis/",
      },
      {
        text: "Теория вероятностей и математическая статистика",
        link: "/disciplines/prob/",
      },
      {
        text: "Технология производства программного обеспечения",
        link: "/disciplines/tppo/",
      },
      {
        text: "Философия",
        link: "/disciplines/psix/",
      },
      {
        text: "Web-проектирование",
        link: "/disciplines/web/",
      },
    ],
  },
  {
    text: "О проекте",
    link: "/about",
  },
  {
    text: "Блог",
    link: "/blog/",
  },
];
