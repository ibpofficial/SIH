import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@freightiq/shared-types': path.resolve(__dirname, '../../packages/shared-types/src/index.ts')
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../../dist'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'recharts';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('xlsx') || id.includes('papaparse')) return 'exports-utils';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-hook-form')) return 'vendor-core';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
});
