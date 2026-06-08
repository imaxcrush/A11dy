import { createApp } from 'vue'
import App from './App.vue'
import { A11yWidgetPlugin } from './plugins/a11y'
import './plugins/a11y/a11y.css'

createApp(App)
  .use(A11yWidgetPlugin)
  .mount('#app')
