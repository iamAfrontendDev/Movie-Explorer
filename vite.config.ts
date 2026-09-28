   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import { visualizer } from 'rollup-plugin-visualizer'

   export default defineConfig({
     plugins: [
       react(),
       ...(process.env.ANALYZE
         ? [visualizer({ open: false, filename: 'bundle-report.html' })]
         : []),
     ],
   })