import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'index.html',  // Copy the index.html from the root
          dest: '',            // This copies it directly into the dist folder
        },
        {
          src: 'icons/*',      // Copy the icons from the root icons folder
          dest: 'icons',       // Put them inside the dist/icons folder
        },
      ],
    }),
  ],
  build: {
    outDir: 'dist',  // Specify the output directory
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),  // Ensure Vite knows where the entry HTML file is
    },
  },
});
