import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // عشان الموقع يشتغل كمان على آيفونات وسفاري الأقدم
    target: ['es2018', 'safari12'],
  },
})