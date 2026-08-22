import {defineConfig} from "vite";
import {resolve} from "path";


export default defineConfig({

    base: "./",

    build: {
        outDir: "dist",
        emptyOutDir: true,

        rollupOptions: {
            input: {
                popup: resolve(__dirname, "src/popup/popup.html"),
                background: resolve(__dirname, "src/background/background.ts")
            },

            output: {
                entryFileNames: "assets/[name].js",
                chunkFileNames: "assets/[name]=-[hash].js",
                assetFileNames: "assets/[name]-[hash][extname]"
            }
        },
    }
})