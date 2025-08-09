import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/loupuaroy/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  }
})