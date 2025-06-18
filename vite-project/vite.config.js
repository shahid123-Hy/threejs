import { defineConfig } from 'vite';

export default defineConfig({
  server: {

    host:'0.0.0.0',
    port: 5173,
    proxy: {
      '/create': {
        target: 'https://threejs-backend-0bbe.onrender.com', // backend ka URL
        changeOrigin: true,
      },
    },
    
    
  },
});

