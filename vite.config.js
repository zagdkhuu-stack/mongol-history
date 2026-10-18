import { defineConfig } from 'vite';
export default defineConfig({base:'/mongol-history/',build:{rollupOptions:{output:{manualChunks:{three:['three','three/addons/renderers/CSS3DRenderer.js']}}}}});
