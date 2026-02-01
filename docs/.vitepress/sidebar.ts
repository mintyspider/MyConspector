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
  "/disciplines/6semester/ais/": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/6semester/ais/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/6semester/ais/lectures"),
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
  "/disciplines/6semester/econ": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/6semester/econ/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/6semester/econ/lectures"),
    },
  ],
  "/disciplines/6semester/its/": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/6semester/its/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/6semester/its/lectures"),
    },
  ],
  "/disciplines/6semester/ml/": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/6semester/ml/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/6semester/ml/lectures"),
    },
  ],
  "/disciplines/6semester/opres": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/6semester/opres/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/6semester/opres/lectures"),
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
  "/disciplines/6semester/tppo": [
    {
      text: "О курсе",
      items: [
        {
          text: "Описание дисциплины",
          link: "/disciplines/6semester/tppo/",
        },
      ],
    },
    {
      text: "Материалы",
      items: getLectures("./docs/disciplines/6semester/tppo/lectures"),
    },
  ],
};
