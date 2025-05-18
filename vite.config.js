import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  bbase: '/lifegame-vue/', // GitHub Pages用にbaseパスを指定
  plugins: [vue()],
})
