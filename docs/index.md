---
layout: home
title: Главная

hero:
  name: MyConspector
  text: Знания, которые останутся с тобой
  tagline: Простые и понятные конспекты дисциплин ИСиТ
  actions:
    - theme: brand
      text: Начните учиться
      link: /introduction
    - theme: alt
      text: GitHub
      link: https://github.com/mintyspider
  image:
    src: logo.png
    alt: Иллюстрация MyConspector

features:
  - icon: 🚀
    title: Быстрый старт
    details: Начните учиться с первых минут без сложных настроек.
  - icon: 🧠
    title: Глубокое понимание
    details: Объяснения, которые делают сложные темы простыми.
  - icon: 🌐
    title: Открытое сообщество
    details: Внесите свой вклад или задай вопрос на GitHub.

---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/173299138?v=4',
    name: 'Анастасия Ларионова',
    title: 'Автор контента',
    links: [
      { icon: 'github', link: 'https://github.com/mintyspider' },
      { icon: 'vk', link: 'https://vk.com/asya.lario777' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/135854145?v=4',
    name: 'Владислав Паньков',
    title: 'Соавтор контента',
    links: [
      { icon: 'github', link: 'https://github.com/FirstVlad99' },
      { icon: 'vk', link: 'https://vk.com/bebrbebr' }
    ]
  }
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Кто мы такие
    </template>
    <template #lead>
      Команда, которая делает обучение вдохновляющим!
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="members" />
</VPTeamPage>