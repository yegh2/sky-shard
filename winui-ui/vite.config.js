import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    global: 'globalThis'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: 'esbuild',
    lib: {
      entry: 'src/main.js',
      name: 'WinUIThemeControls',
      formats: ['iife'],
      fileName: () => 'winui-controls.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => assetInfo.names?.includes('css') ? 'winui-controls.css' : 'assets/[name][extname]'
      }
    }
  }
});