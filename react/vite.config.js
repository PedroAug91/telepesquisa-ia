import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    base: "/",
    preview: {
        port: process.env.FRONTEND_PORT,
        strictPort: true,
    },
    server: {
        port: process.env.FRONTEND_PORT,
        strictPort: true,
        host: true,
        origin: `http://0.0.0.0:${process.env.FRONTEND_PORT}`,
    },
});
