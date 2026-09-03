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
          text: "Семестры обучения",
          link: "/semesters.md",
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
  "/disciplines/6semester/cipt/": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/6semester/cipt/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/6semester/cipt/lectures"),
    },
  ],
  "/disciplines/6semester/pis": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/6semester/pis/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/6semester/pis/lectures"),
    },
  ],
  "/disciplines/7semester/aot": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/7semester/aot/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/7semester/aot/lectures"),
    },
  ],
  "/disciplines/7semester/ap": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/7semester/ap/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/7semester/ap/lectures"),
    },
  ],
  "/disciplines/7semester/dap": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/7semester/dap/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/7semester/dap/lectures"),
    },
  ],
  "/disciplines/7semester/ip": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/7semester/ip/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/7semester/ip/lectures"),
    },
  ],
  "/disciplines/7semester/mobile": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/7semester/mobile/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/7semester/mobile/lectures"),
    },
  ],
  "/disciplines/7semester/ssukpo": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/7semester/ssukpo/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/7semester/ssukpo/lectures"),
    },
  ],
  "/disciplines/7semester/test": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/7semester/test/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/7semester/test/lectures"),
    },
  ],
};
