import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set VITE_BASE=/realestate/ for subdirectory Hostinger deploys
  base: process.env.VITE_BASE || '/',
})
