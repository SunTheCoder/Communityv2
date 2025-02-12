import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from "vite-jsconfig-paths";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@resolvers/zod': '@hookform/resolvers/zod',
      '@components': path.resolve(__dirname, 'src/components'),
      '@ui': path.resolve(__dirname, 'src/components/ui'),
    },
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 3000, // Optional: Specify a port (default is 5173)
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase the size limit to 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'ethers'],
          ui: ['@chakra-ui/react']
        }
      }
    }
  },
});
