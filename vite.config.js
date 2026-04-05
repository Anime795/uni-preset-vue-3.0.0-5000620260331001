import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

const isH5 = process.env.UNI_PLATFORM === 'h5'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'es2015',
    cssCodeSplit: false,
    polyfillDynamicImport: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/main.js'),
      ...(isH5 ? {
        output: {
          format: 'es',
          inlineDynamicImports: true
        }
      } : {})
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: true,
    proxy: {
      '/api': {
        target: 'https://eydhjkzxoezn.sealoshzh.site',
        changeOrigin: true,
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxy request:', req.method, req.url, '->', proxyReq.getHeader('host') + proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
            // 添加CORS头
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
          });
        }
      }
    }
  }
})
