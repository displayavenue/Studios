import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Interim Hostinger path: /kundali-maker/
// Own domain later: VITE_BASE=/ npm run build  (or deploy script)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/kundali-maker/',
})
