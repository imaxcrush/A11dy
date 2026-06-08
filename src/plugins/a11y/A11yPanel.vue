<script setup lang="ts">
import { onMounted, ref } from 'vue'
import A11yOptionButton from './A11yOptionButton.vue'
import { useA11yStore, type ColorMode, type ContrastMode, type SpacingMode, type TextScale } from './useA11yStore'
import { useSpeech } from './useSpeech'

defineProps<{
  panelId: string
}>()

const emit = defineEmits<{
  close: []
}>()

const {
  settings,
  setTextScale,
  setSpacing,
  setContrast,
  setColorMode,
  setSpeechRate,
  resetSettings,
} = useA11yStore()

const speech = useSpeech()
const panel = ref<HTMLElement | null>(null)

const textOptions: Array<{ label: string; value: TextScale }> = [
  { label: 'Обычный', value: 'default' },
  { label: 'Крупный 120%', value: 'large' },
  { label: 'Больше 150%', value: 'xlarge' },
  { label: 'Максимум 200%', value: 'max' },
]

const spacingOptions: Array<{ label: string; value: SpacingMode }> = [
  { label: 'Обычные', value: 'default' },
  { label: 'Увеличенные', value: 'increased' },
]

const contrastOptions: Array<{ label: string; value: ContrastMode }> = [
  { label: 'Обычный', value: 'default' },
  { label: 'Темный', value: 'contrast-dark' },
  { label: 'Светлый', value: 'contrast-light' },
  { label: 'Монохром', value: 'monochrome' },
]

const colorOptions: Array<{ label: string; value: ColorMode }> = [
  { label: 'Обычное', value: 'default' },
  { label: 'Протанопия', value: 'protanopia' },
  { label: 'Дейтеранопия', value: 'deuteranopia' },
  { label: 'Тританопия', value: 'tritanopia' },
]

function resetAll(): void {
  speech.stop()
  resetSettings()
}

onMounted(() => {
  panel.value?.focus()
})
</script>

<template>
  <section
    ref="panel"
    :id="panelId"
    class="a11y-panel"
    role="dialog"
    tabindex="-1"
    aria-label="Настройки доступности"
    @keydown.esc.prevent="emit('close')"
  >
    <header class="a11y-panel__header">
      <h2 class="a11y-panel__title">Доступность</h2>
      <button class="a11y-panel__close" type="button" aria-label="Закрыть панель доступности" @click="emit('close')">
        <span aria-hidden="true">×</span>
      </button>
    </header>

    <div class="a11y-panel__content">
      <section class="a11y-panel__section" aria-labelledby="a11y-text-title">
        <h3 id="a11y-text-title">Текст</h3>
        <div class="a11y-panel__grid">
          <A11yOptionButton
            v-for="option in textOptions"
            :key="option.value"
            :label="option.label"
            :pressed="settings.textScale === option.value"
            @press="setTextScale(option.value)"
          />
        </div>
      </section>

      <section class="a11y-panel__section" aria-labelledby="a11y-spacing-title">
        <h3 id="a11y-spacing-title">Интервалы</h3>
        <div class="a11y-panel__grid">
          <A11yOptionButton
            v-for="option in spacingOptions"
            :key="option.value"
            :label="option.label"
            :pressed="settings.spacing === option.value"
            @press="setSpacing(option.value)"
          />
        </div>
      </section>

      <section class="a11y-panel__section" aria-labelledby="a11y-contrast-title">
        <h3 id="a11y-contrast-title">Контраст</h3>
        <div class="a11y-panel__grid">
          <A11yOptionButton
            v-for="option in contrastOptions"
            :key="option.value"
            :label="option.label"
            :pressed="settings.contrast === option.value"
            @press="setContrast(option.value)"
          />
        </div>
      </section>

      <section class="a11y-panel__section" aria-labelledby="a11y-color-title">
        <h3 id="a11y-color-title">Цвет</h3>
        <div class="a11y-panel__grid">
          <A11yOptionButton
            v-for="option in colorOptions"
            :key="option.value"
            :label="option.label"
            :pressed="settings.colorMode === option.value"
            @press="setColorMode(option.value)"
          />
        </div>
      </section>

      <section class="a11y-panel__section" aria-labelledby="a11y-navigation-title">
        <h3 id="a11y-navigation-title">Навигация</h3>
        <div class="a11y-panel__grid">
          <A11yOptionButton
            label="Подчеркнуть ссылки"
            :pressed="settings.underlineLinks"
            @press="settings.underlineLinks = !settings.underlineLinks"
          />
          <A11yOptionButton
            label="Заметный фокус"
            :pressed="settings.enhancedFocus"
            @press="settings.enhancedFocus = !settings.enhancedFocus"
          />
          <A11yOptionButton
            label="Крупный курсор"
            :pressed="settings.largeCursor"
            @press="settings.largeCursor = !settings.largeCursor"
          />
        </div>
      </section>

      <section class="a11y-panel__section" aria-labelledby="a11y-motion-title">
        <h3 id="a11y-motion-title">Движение</h3>
        <div class="a11y-panel__grid">
          <A11yOptionButton
            label="Меньше анимации"
            :pressed="settings.reducedMotion"
            @press="settings.reducedMotion = !settings.reducedMotion"
          />
        </div>
      </section>

      <section class="a11y-panel__section" aria-labelledby="a11y-speech-title">
        <h3 id="a11y-speech-title">Речь</h3>
        <div class="a11y-panel__grid">
          <button class="a11y-action-button" type="button" :disabled="!speech.isSupported.value" @click="speech.readMainContent">
            Читать main
          </button>
          <button class="a11y-action-button" type="button" :disabled="!speech.isSupported.value" @click="speech.readSelectedText">
            Читать выделенное
          </button>
          <button class="a11y-action-button" type="button" :disabled="!speech.speaking.value" @click="speech.pause">
            Пауза
          </button>
          <button class="a11y-action-button" type="button" :disabled="!speech.paused.value" @click="speech.resume">
            Продолжить
          </button>
          <button class="a11y-action-button" type="button" :disabled="!speech.speaking.value && !speech.paused.value" @click="speech.stop">
            Стоп
          </button>
        </div>

        <label class="a11y-range">
          <span>Скорость {{ settings.speechRate.toFixed(1) }}</span>
          <input
            type="range"
            min="0.7"
            max="1.5"
            step="0.1"
            :value="settings.speechRate"
            @input="setSpeechRate(Number(($event.target as HTMLInputElement).value))"
          >
        </label>

        <p v-if="speech.error.value" class="a11y-panel__message" role="status">
          {{ speech.error.value }}
        </p>
      </section>

      <section class="a11y-panel__section" aria-labelledby="a11y-reset-title">
        <h3 id="a11y-reset-title">Сброс</h3>
        <button class="a11y-reset-button" type="button" @click="resetAll">
          Сбросить настройки
        </button>
      </section>
    </div>
  </section>
</template>
