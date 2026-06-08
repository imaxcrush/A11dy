import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ mode }) => ({
  plugins: mode === 'https-dev' ? [vue(), basicSsl()] : [vue()],
  server: {
    cors: true,
  },
  preview: {
    cors: true,
  },
}))
