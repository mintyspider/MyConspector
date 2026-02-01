import { DefaultTheme } from "vitepress";

export const navigation: DefaultTheme.NavItem[] = [
  {
    text: "Все дисциплины",
    items: [
      {
        text: "5 семестр",
        link: "/disciplines/5semester"
      },
      {
        text: "6 семестр",
        link: "/disciplines/6semester"
      },
    ],
  },
  {
    text: "О проекте",
    link: "/about",
  },
];
