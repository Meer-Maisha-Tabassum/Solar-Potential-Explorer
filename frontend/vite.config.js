import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // Proxy API requests to the backend server during development
        proxy: {
            '/api': {
                target: 'http://localhost:5050',
                changeOrigin: true,
            },
        },
    },
})