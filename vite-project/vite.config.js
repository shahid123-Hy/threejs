import { defineConfig } from 'vite';

export default defineConfig({
  server: {

    host:'0.0.0.0',
    port: 5173,
    proxy: {
      '/create': {
        target: 'http://localhost:4000', // backend ka URL
        changeOrigin: true,
      },
    },
    
    
  },
});

