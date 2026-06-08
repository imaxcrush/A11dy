import { computed, ref } from 'vue'
import { useA11yStore } from './useA11yStore'

export function useSpeech() {
  const { settings } = useA11yStore()
  const speaking = ref(false)
  const paused = ref(false)
  const error = ref('')

  const isSupported = computed(() => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  })

  function clearSpeechState(): void {
    speaking.value = false
    paused.value = false
  }

  function speakText(text: string): void {
    const trimmedText = text.trim()

    if (!trimmedText) {
      error.value = 'Нет текста для чтения.'
      return
    }

    if (!isSupported.value) {
      error.value = 'Синтез речи не поддерживается этим браузером.'
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(trimmedText)
    utterance.rate = settings.speechRate
    utterance.lang = document.documentElement.lang || window.navigator.language || 'ru-RU'

    utterance.onstart = () => {
      error.value = ''
      speaking.value = true
      paused.value = false
    }

    utterance.onpause = () => {
      paused.value = true
    }

    utterance.onresume = () => {
      paused.value = false
    }

    utterance.onend = clearSpeechState
    utterance.onerror = () => {
      error.value = 'Не удалось воспроизвести речь.'
      clearSpeechState()
    }

    window.speechSynthesis.speak(utterance)
  }

  function readMainContent(): void {
    const main = document.querySelector('main')
    speakText(main?.textContent || document.body.textContent || '')
  }

  function readSelectedText(): void {
    speakText(window.getSelection()?.toString() || '')
  }

  function pause(): void {
    if (!isSupported.value || !window.speechSynthesis.speaking) {
      return
    }

    window.speechSynthesis.pause()
    paused.value = true
  }

  function resume(): void {
    if (!isSupported.value) {
      return
    }

    window.speechSynthesis.resume()
    paused.value = false
    speaking.value = window.speechSynthesis.speaking
  }

  function stop(): void {
    if (!isSupported.value) {
      return
    }

    window.speechSynthesis.cancel()
    clearSpeechState()
  }

  return {
    isSupported,
    speaking,
    paused,
    error,
    readMainContent,
    readSelectedText,
    pause,
    resume,
    stop,
  }
}

