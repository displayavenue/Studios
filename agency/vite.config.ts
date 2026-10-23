import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use DEPLOY_BASE=/demo/ when deploying the live Hostinger demo folder.
// Local: npm run dev (base /). Live demo: DEPLOY_BASE=/demo/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.DEPLOY_BASE || "/",
});
