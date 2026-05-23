import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    assetsInlineLimit: 0, // 데이터 URL 인라인 방지
    sourcemap: false, // .map 제거
  }
})