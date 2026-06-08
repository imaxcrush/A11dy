<script setup lang="ts">
import { nextTick, ref } from 'vue'
import A11yPanel from './A11yPanel.vue'
import { useA11yStore } from './useA11yStore'
import { useA11ySurfaceDetector } from './useA11ySurfaceDetector'

const panelId = 'a11y-widget-panel'
const isOpen = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const { activeCount } = useA11yStore()
useA11ySurfaceDetector()

function openPanel(): void {
  isOpen.value = true
}

function closePanel(): void {
  isOpen.value = false

  void nextTick(() => {
    trigger.value?.focus()
  })
}

function togglePanel(): void {
  if (isOpen.value) {
    closePanel()
    return
  }

  openPanel()
}
</script>

<template>
  <div class="a11y-widget" aria-live="polite">
    <button
      ref="trigger"
      class="a11y-widget__trigger"
      type="button"
      aria-label="Открыть настройки доступности"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="panelId"
      @click="togglePanel"
    >
      <span class="a11y-widget__trigger-icon" aria-hidden="true">Aa</span>
      <span v-if="activeCount > 0" class="a11y-widget__badge" aria-label="Активные настройки">
        {{ activeCount }}
      </span>
    </button>

    <A11yPanel
      v-if="isOpen"
      :panel-id="panelId"
      @close="closePanel"
    />
  </div>
</template>
