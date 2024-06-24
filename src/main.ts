import { MotionPlugin } from '@vueuse/motion'
import { type Directive, createApp } from 'vue'
import Table from '@pureadmin/table'
import * as echarts from 'echarts'

/**
 * 引入avue
 */
import Avue from '@smallwei/avue'
import DataVVue3 from '@kjgl77/datav-vue3'
import '@smallwei/avue/lib/index.css'

import VueTippy from 'vue-tippy'
import App from './App.vue'
import router from './router'
import { getPlatformConfig } from './config'
import {
  FontIcon,
  IconifyIconOffline,
  IconifyIconOnline,
} from './components/ReIcon'
import { setupStore } from '@/store'
// import { useEcharts } from "@/plugins/echarts";
import { useElementPlus } from '@/plugins/elementPlus'
import { injectResponsiveStorage } from '@/utils/responsive'
// import PureDescriptions from "@pureadmin/descriptions";
// 引入重置样式
import './style/reset.scss'
// 导入公共样式
import './style/index.scss'
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import './style/tailwind.css'
import 'element-plus/dist/index.css'
// 导入字体图标
import './assets/iconfont/iconfont.js'
import './assets/iconfont/iconfont.css'

// 自定义指令
import * as directives from '@/directives'

// 全局注册@iconify/vue图标库

// 全局注册按钮级别权限组件
import { Auth } from '@/components/ReAuth'

// 全局注册vue-tippy
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'

const app = createApp(App)
Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key])
})
app.component('IconifyIconOffline', IconifyIconOffline)
app.component('IconifyIconOnline', IconifyIconOnline)
app.component('FontIcon', FontIcon)
app.component('Auth', Auth)
app.use(VueTippy)

app.use(DataVVue3)
app.use(Avue)

// 引入echarts 然后可以在组件种使用useEcharts方法
app.config.globalProperties.$echarts = echarts
getPlatformConfig(app).then(async (config) => {
  setupStore(app)
  app.use(router)
  await router.isReady()
  injectResponsiveStorage(app, config)
  app.use(MotionPlugin).use(useElementPlus).use(Table)
  // .use(PureDescriptions)
  // .use(useEcharts);
  app.mount('#app')
})
