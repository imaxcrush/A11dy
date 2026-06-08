<script setup lang="ts">
defineProps<{
  label: string
  pressed: boolean
}>()

defineEmits<{
  press: []
}>()
</script>

<template>
  <button
    class="a11y-option-button"
    type="button"
    :aria-pressed="pressed"
    @click="$emit('press')"
  >
    {{ label }}
  </button>
</template>

