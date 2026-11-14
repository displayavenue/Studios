import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Live on https://jyotishkundali.com/varnikya/ (does not replace kundali root)
  base: '/varnikya/',
})
