import { DefaultTheme } from "vitepress";
import { getLectures } from "../../utils";

export const sidebar: DefaultTheme.Sidebar = {
  "/": [
    {
      text: "Вступление",
      items: [
        {
          text: "О проекте",
          link: "/about",
        },
        {
          text: "Доступные дисциплины",
          link: "/introduction",
        },
      ],
    },
    {
      text: "Блог",
      items: [
        {
          text: "Ошибка выжившего",
          link: "/blog/survivorship.md",
        },
      ],
    },
    {
      text: "Гайды",
      items: [
        {
          text: "Обозначения в лекциях",
          link: "/guides/lecture.md",
        },
        {
          text: "Шпаргалка по основным SQL-запросам",
          link: "/guides/sql.md",
        },
      ],
    },
  ],
  "/disciplines/algos": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/algos/",
        },
      ],
    },
    {
      text: "Лекции",
      items: getLectures("./docs/disciplines/algos/lectures"),
    },
  ],
  "/disciplines/db": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/db/",
        },
      ],
    },
    {
      text: "Лекции",
      items: getLectures("./docs/disciplines/db/lectures"),
    },
  ],
  "/disciplines/kirpo": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/kirpo/",
        },
      ],
    },
    {
      text: "Лекции",
      items: getLectures("./docs/disciplines/kirpo/lectures"),
    },
  ],
  "/disciplines/pis": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/pis/",
        },
      ],
    },
    {
      text: "Лекции",
      items: getLectures("./docs/disciplines/pis/lectures"),
    },
  ],
  "/disciplines/prob": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/prob/",
        },
      ],
    },
    {
      text: "Лекции",
      items: getLectures("./docs/disciplines/prob/lectures"),
    },
  ],
  "/disciplines/tppo": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/tppo/",
        },
      ],
    },
    {
      text: "Лекции",
      items: getLectures("./docs/disciplines/tppo/lectures"),
    },
  ],
  "/disciplines/psix": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/psix/",
        },
      ],
    },
    {
      text: "Лекции",
      items: getLectures("./docs/disciplines/psix/lectures"),
    },
  ],
  "/disciplines/web": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/web/",
        },
      ],
    },
    {
      text: "Лекции",
      items: getLectures("./docs/disciplines/web/lectures"),
    },
  ],
};
