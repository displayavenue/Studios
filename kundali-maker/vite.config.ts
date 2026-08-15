import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production: https://jyotishkundali.com/  (base /)
// Override: VITE_BASE=/kundali-maker/ for subdirectory deploys
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
