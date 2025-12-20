import { DefaultTheme } from "vitepress";
import { getLectures, getNotes } from "../../utils";

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
          text: "Благодарности",
          link: "/thanks",
        },
        {
          text: "Дисциплины",
          link: "/disciplines.md",
        },
      ],
    },
    {
      text: "Блог",
      items: getNotes("./docs/blog/notes"),
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
      text: "Материалы",
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
      text: "Материалы",
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
      text: "Материалы",
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
      text: "Материалы",
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
      text: "Материалы",
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
      text: "Материалы",
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
      text: "Материалы",
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
      text: "Материалы",
      items: getLectures("./docs/disciplines/web/lectures"),
    },
  ],
};
