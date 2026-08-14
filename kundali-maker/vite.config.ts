import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploy under /kundali-maker/ on the same host, or set base: '/' for root hosting.
export default defineConfig({
  plugins: [react()],
  base: '/kundali-maker/',
})
