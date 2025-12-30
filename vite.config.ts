import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/zvukolizer/' : '',
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    plugins: [
        tailwindcss(),
    ],
});
