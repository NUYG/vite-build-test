import { fileURLToPath, URL } from 'node:url'
import mkcert from 'vite-plugin-mkcert'
import removeConsole from "vite-plugin-remove-console";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dotenv from 'dotenv'

dotenv.config()
// || 'http://localhost:3000'

export default defineConfig({
  server: {
    https: true,
    host: '0.0.0.0',
    proxy: {
      '^/(api|static|media)/*': {
        target: process.env.BACKEND_URL  || 'https://dev.more.fpland.vn/',
        changeOrigin: true,
      },
    }
  },
  plugins: [vue(), vueJsx(), mkcert(),removeConsole()],
  define:{
    'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    'process.env.VITE_ENV': JSON.stringify(process.env.VITE_ENV),
     'process.env': process.env
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },

  optimizeDeps: {
    include: ['socket.io-client'],
  },
})
