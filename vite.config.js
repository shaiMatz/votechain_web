import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    host: true,
    proxy: {
      '/api': {
        target: 'https://votechain.biz/api.php',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api.php'),
      },
    },
   },
  
})
