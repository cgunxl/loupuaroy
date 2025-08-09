import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/loupuaoy/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  }
})