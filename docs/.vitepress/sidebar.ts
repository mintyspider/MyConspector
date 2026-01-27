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
    }
  ],
  "/disciplines/5semester/algos": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/5semester/algos/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/5semester/algos/lectures"),
    },
  ],
  "/disciplines/5semester/db": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/5semester/db/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/5semester/db/lectures"),
    },
  ],
  "/disciplines/5semester/pis": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/5semester/pis/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/5semester/pis/lectures"),
    },
  ],
  "/disciplines/5semester/prob": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/5semester/prob/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/5semester/prob/lectures"),
    },
  ],
  "/disciplines/5semester/tppo": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/5semester/tppo/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/5semester/tppo/lectures"),
    },
  ],
  "/disciplines/5semester/psix": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/5semester/psix/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/5semester/psix/lectures"),
    },
  ],
};
