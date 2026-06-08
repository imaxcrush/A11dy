import { createApp, type App as VueApp } from 'vue'
import A11yWidget from './A11yWidget.vue'
import { useA11yStore } from './useA11yStore'
import './a11y.css'

const ROOT_ID = 'vue-a11y-widget-standalone-root'
const GLOBAL_KEY = '__VUE_A11Y_WIDGET_STANDALONE__'

interface StandaloneApi {
  mount: () => void
  unmount: () => void
}

declare global {
  interface Window {
    [GLOBAL_KEY]?: StandaloneApi
  }
}

let widgetApp: VueApp<Element> | null = null

function mount(): void {
  if (typeof document === 'undefined') {
    return
  }

  useA11yStore()

  if (document.getElementById(ROOT_ID)) {
    return
  }

  const root = document.createElement('div')
  root.id = ROOT_ID
  document.body.appendChild(root)

  widgetApp = createApp(A11yWidget)
  widgetApp.mount(root)
}

function unmount(): void {
  const root = document.getElementById(ROOT_ID)

  widgetApp?.unmount()
  widgetApp = null
  root?.remove()
}

window[GLOBAL_KEY]?.unmount()
window[GLOBAL_KEY] = { mount, unmount }
mount()

