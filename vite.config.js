import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { copyFileSync } from 'fs';
export default defineConfig({
    base: '/AI-Anime-website/',
    plugins: [
        vue(),
        {
            name: 'copy-404-html',
            closeBundle: function () {
                copyFileSync(resolve(__dirname, 'dist/index.html'), resolve(__dirname, 'dist/404.html'));
            }
        }
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/api/, ''); }
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                            return 'vue-vendor';
                        }
                        if (id.includes('naive-ui')) {
                            return 'naive-ui';
                        }
                        if (id.includes('xgplayer')) {
                            return 'xgplayer';
                        }
                        if (id.includes('danmaku')) {
                            return 'danmaku';
                        }
                        return 'vendor';
                    }
                    if (id.includes('src/components')) {
                        return 'components';
                    }
                    if (id.includes('src/views')) {
                        return 'views';
                    }
                    if (id.includes('src/stores')) {
                        return 'stores';
                    }
                }
            }
        }
    },
    optimizeDeps: {
        include: ['vue', 'vue-router', 'pinia', 'naive-ui']
    }
});
