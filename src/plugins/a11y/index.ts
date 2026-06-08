import { createApp, type App } from 'vue'
import A11yWidget from './A11yWidget.vue'
import { useA11yStore } from './useA11yStore'

const ROOT_ID = 'vue-a11y-widget-root'

export const A11yWidgetPlugin = {
  install(app: App): void {
    useA11yStore()

    if (typeof document === 'undefined') {
      return
    }

    if (document.getElementById(ROOT_ID)) {
      return
    }

    const root = document.createElement('div')
    root.id = ROOT_ID
    document.body.appendChild(root)

    const widgetApp = createApp(A11yWidget)
    widgetApp.config.globalProperties = app.config.globalProperties
    widgetApp.mount(root)
  },
}

export { default as A11yWidget } from './A11yWidget.vue'
export { useA11yStore }
export type { A11ySettings, ColorMode, ContrastMode, SpacingMode, TextScale } from './useA11yStore'

