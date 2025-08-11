import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => ({
      server: {
            proxy: {
                  '/api': {
                        target: 'http://localhost:5050',
                        changeOrigin: true,
                        secure: false,
                  },
            },
      },
      plugins: [
            react(),
            ...(mode === 'analyze'
                  ? [visualizer({
                        open: true,
                        filename: 'bundle-report.html',
                        gzipSize: true,
                        brotliSize: true,
                  })]
                  : [])
      ],
      build: {
            rollupOptions: {
                  output: {
                        manualChunks: undefined,
                  },
            },
      },
}))
