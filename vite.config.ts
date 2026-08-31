import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.md'],
  build: {
    rollupOptions: {
      output: {
        // Split the largest stable dependencies into their own chunks so a
        // content edit does not invalidate the whole bundle in visitors'
        // caches: the app chunk changes weekly, react and the markdown
        // pipeline change only when dependencies are upgraded.
        manualChunks: {
          // 'react-dom/client' is a separate entry point from 'react-dom';
          // naming only the latter left the whole renderer in the app chunk.
          react: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
          markdown: ['react-markdown', 'remark-gfm'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
