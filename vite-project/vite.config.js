import { defineConfig } from 'vite';

export default defineConfig({
  server: {

    host:'0.0.0.0',
    port: 5173,
    proxy: {
      '/create': {
        target: 'https://threejs-backend-baoa.onrender.com', // backend ka URL
        changeOrigin: true,
      },
    },
    
    
  },
});

