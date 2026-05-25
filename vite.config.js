import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const ocrUrl = env.VITE_CLOVA_OCR_URL || ''
  const ocrUrlObj = ocrUrl ? new URL(ocrUrl) : null

  return {
    plugins: [vue()],
    server: {
      port: 5173,
      open: true,
      proxy: ocrUrlObj ? {
        '/ocr-proxy': {
          target: ocrUrlObj.origin,
          changeOrigin: true,
          rewrite: () => ocrUrlObj.pathname,
        },
      } : {},
    },
  }
})
