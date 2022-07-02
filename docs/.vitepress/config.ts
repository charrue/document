import { defineConfig } from "vitepress";
import { ComponentSidebars } from "./config/sidebar"
import nav from "./config/nav"
import { mdPlugin } from "./config/plugin"

export default defineConfig({
  title: "Charrue",
  base: "/document/",
  description: '从零开始的前端基础设施研发',
  themeConfig: {
    siteTitle: "Charrue",
    logo: "https://avatars.githubusercontent.com/u/86038711?s=400&u=a12f78c5f64e3986cc9b33fe17fc4fb68d8955ef&v=4",
    nav,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/charrue' },
    ],
    sidebar: {
      "/component": [
        {
          text: "Component",
          items: ComponentSidebars
        },
      ]
    }
  },
  markdown: {
    config: (md) => mdPlugin(md),
  },
})