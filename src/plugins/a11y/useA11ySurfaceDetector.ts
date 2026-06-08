import { onBeforeUnmount, watch } from 'vue'
import { useA11yStore } from './useA11yStore'

const SURFACE_ATTR = 'data-a11y-surface'
const CHROME_ATTR = 'data-a11y-chrome'
const WIDGET_SELECTOR = '#vue-a11y-widget-root, #vue-a11y-widget-standalone-root'
const CHROME_SELECTOR = [
  'header',
  'footer',
  'nav',
  'aside',
  '[role="banner"]',
  '[role="navigation"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[class*="header" i]',
  '[class*="sidebar" i]',
  '[class*="aside" i]',
  '[id*="header" i]',
  '[id*="sidebar" i]',
].join(',')

const SURFACE_SELECTOR = [
  'main > section',
  'main > article',
  'main > div',
  'main [class*="card" i]',
  'main [class*="course" i]',
  'main [class*="lesson" i]',
  'main [class*="module" i]',
  'main [class*="tile" i]',
  'main [class*="surface" i]',
  'main [class*="panel" i]',
  'main a[href]',
].join(',')

function clearMarks(): void {
  document.querySelectorAll(`[${SURFACE_ATTR}], [${CHROME_ATTR}]`).forEach((element) => {
    element.removeAttribute(SURFACE_ATTR)
    element.removeAttribute(CHROME_ATTR)
  })
}

function isVisibleElement(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement)) {
    return false
  }

  const rect = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)

  return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'
}

function isWidgetElement(element: Element): boolean {
  return Boolean(element.closest(WIDGET_SELECTOR))
}

function elementArea(element: Element): number {
  const rect = element.getBoundingClientRect()
  return rect.width * rect.height
}

function markChrome(): void {
  const candidates = Array.from(document.querySelectorAll(CHROME_SELECTOR))
    .filter((element): element is HTMLElement => {
      if (!isVisibleElement(element) || isWidgetElement(element)) {
        return false
      }

      const rect = element.getBoundingClientRect()
      return rect.width >= 120 && rect.height >= 48
    })
    .sort((a, b) => elementArea(b) - elementArea(a))

  candidates.forEach((element) => {
    if (element.closest(`[${CHROME_ATTR}]`)) {
      return
    }

    element.setAttribute(CHROME_ATTR, 'true')
  })
}

function markSurfaces(): void {
  const viewportArea = window.innerWidth * window.innerHeight
  const candidates = Array.from(document.querySelectorAll(SURFACE_SELECTOR))
    .filter((element): element is HTMLElement => {
      if (!isVisibleElement(element) || isWidgetElement(element) || element.closest(`[${CHROME_ATTR}]`)) {
        return false
      }

      const rect = element.getBoundingClientRect()
      const area = rect.width * rect.height

      if (area > viewportArea * 0.72) {
        return false
      }

      return rect.width >= 220 && rect.height >= 90 && area >= 36000
    })
    .sort((a, b) => elementArea(b) - elementArea(a))

  candidates.forEach((element) => {
    if (element.closest(`[${SURFACE_ATTR}]`)) {
      return
    }

    element.setAttribute(SURFACE_ATTR, 'true')
  })
}

export function useA11ySurfaceDetector() {
  const { settings } = useA11yStore()
  let frame = 0
  let observer: MutationObserver | null = null

  function scheduleDetect(): void {
    window.cancelAnimationFrame(frame)

    frame = window.requestAnimationFrame(() => {
      clearMarks()

      if (settings.contrast === 'default') {
        return
      }

      markChrome()
      markSurfaces()
    })
  }

  watch(() => settings.contrast, scheduleDetect, { immediate: true })
  window.addEventListener('resize', scheduleDetect)

  observer = new MutationObserver(scheduleDetect)
  observer.observe(document.body, { childList: true, subtree: true })

  onBeforeUnmount(() => {
    window.cancelAnimationFrame(frame)
    window.removeEventListener('resize', scheduleDetect)
    observer?.disconnect()
    clearMarks()
  })
}
