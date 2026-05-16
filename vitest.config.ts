import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/node_modules/**', '**/e2e/**'], // Exclude E2E tests
    include: ['**/spec/**/*.spec.{js,ts,tsx}'], // Include unit tests in spec folders
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})