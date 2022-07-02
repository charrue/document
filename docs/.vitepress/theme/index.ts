import DefaultTheme from 'vitepress/theme'
import type { Theme } from "vitepress"
import Demo from "../components/Demo.vue";
import EP from "element-plus"
import "element-plus/dist/index.css";

const themeConfig: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(EP)

    app.component("Demo", Demo)
  }
}

export default themeConfig