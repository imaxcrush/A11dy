import { computed, reactive, watch } from 'vue'

const STORAGE_KEY = 'vue-a11y-widget-settings'

export type TextScale = 'default' | 'large' | 'xlarge' | 'max'
export type SpacingMode = 'default' | 'increased'
export type ContrastMode = 'default' | 'contrast-dark' | 'contrast-light' | 'monochrome'
export type ColorMode = 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia'

export interface A11ySettings {
  textScale: TextScale
  spacing: SpacingMode
  contrast: ContrastMode
  colorMode: ColorMode
  underlineLinks: boolean
  enhancedFocus: boolean
  largeCursor: boolean
  reducedMotion: boolean
  speechRate: number
}

const defaultSettings: A11ySettings = {
  textScale: 'default',
  spacing: 'default',
  contrast: 'default',
  colorMode: 'default',
  underlineLinks: false,
  enhancedFocus: false,
  largeCursor: false,
  reducedMotion: false,
  speechRate: 1,
}

const settings = reactive<A11ySettings>({ ...defaultSettings })
let initialized = false

function isTextScale(value: unknown): value is TextScale {
  return value === 'default' || value === 'large' || value === 'xlarge' || value === 'max'
}

function isSpacingMode(value: unknown): value is SpacingMode {
  return value === 'default' || value === 'increased'
}

function isContrastMode(value: unknown): value is ContrastMode {
  return value === 'default' || value === 'contrast-dark' || value === 'contrast-light' || value === 'monochrome'
}

function isColorMode(value: unknown): value is ColorMode {
  return value === 'default' || value === 'protanopia' || value === 'deuteranopia' || value === 'tritanopia'
}

function clampSpeechRate(value: unknown): number {
  const rate = typeof value === 'number' ? value : Number(value)

  if (!Number.isFinite(rate)) {
    return defaultSettings.speechRate
  }

  return Math.min(1.5, Math.max(0.7, Number(rate.toFixed(1))))
}

function readStoredSettings(): Partial<A11ySettings> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw) as Partial<A11ySettings>

    return {
      textScale: isTextScale(parsed.textScale) ? parsed.textScale : undefined,
      spacing: isSpacingMode(parsed.spacing) ? parsed.spacing : undefined,
      contrast: isContrastMode(parsed.contrast) ? parsed.contrast : undefined,
      colorMode: isColorMode(parsed.colorMode) ? parsed.colorMode : undefined,
      underlineLinks: typeof parsed.underlineLinks === 'boolean' ? parsed.underlineLinks : undefined,
      enhancedFocus: typeof parsed.enhancedFocus === 'boolean' ? parsed.enhancedFocus : undefined,
      largeCursor: typeof parsed.largeCursor === 'boolean' ? parsed.largeCursor : undefined,
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : undefined,
      speechRate: parsed.speechRate === undefined ? undefined : clampSpeechRate(parsed.speechRate),
    }
  } catch {
    return {}
  }
}

function persistSettings(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings }))
}

function setHtmlAttribute(name: string, value: string | boolean): void {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute(`data-a11y-${name}`, String(value))
}

function applySettingsToDocument(): void {
  setHtmlAttribute('text', settings.textScale)
  setHtmlAttribute('spacing', settings.spacing)
  setHtmlAttribute('contrast', settings.contrast)
  setHtmlAttribute('color', settings.colorMode)
  setHtmlAttribute('underline-links', settings.underlineLinks)
  setHtmlAttribute('enhanced-focus', settings.enhancedFocus)
  setHtmlAttribute('large-cursor', settings.largeCursor)
  setHtmlAttribute('reduced-motion', settings.reducedMotion)
  setHtmlAttribute('speech-rate', settings.speechRate.toFixed(1))
}

function initializeStore(): void {
  if (initialized) {
    return
  }

  Object.assign(settings, defaultSettings, readStoredSettings())
  applySettingsToDocument()

  watch(
    settings,
    () => {
      persistSettings()
      applySettingsToDocument()
    },
    { deep: true },
  )

  initialized = true
}

export function useA11yStore() {
  initializeStore()

  const activeCount = computed(() => {
    return [
      settings.textScale !== defaultSettings.textScale,
      settings.spacing !== defaultSettings.spacing,
      settings.contrast !== defaultSettings.contrast,
      settings.colorMode !== defaultSettings.colorMode,
      settings.underlineLinks,
      settings.enhancedFocus,
      settings.largeCursor,
      settings.reducedMotion,
      settings.speechRate !== defaultSettings.speechRate,
    ].filter(Boolean).length
  })

  function setTextScale(value: TextScale): void {
    settings.textScale = value
  }

  function setSpacing(value: SpacingMode): void {
    settings.spacing = value
  }

  function setContrast(value: ContrastMode): void {
    settings.contrast = value
  }

  function setColorMode(value: ColorMode): void {
    settings.colorMode = value
  }

  function setSpeechRate(value: number): void {
    settings.speechRate = clampSpeechRate(value)
  }

  function resetSettings(): void {
    Object.assign(settings, defaultSettings)
  }

  return {
    settings,
    activeCount,
    setTextScale,
    setSpacing,
    setContrast,
    setColorMode,
    setSpeechRate,
    resetSettings,
  }
}
