import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["**/node_modules/**", "**/e2e/**"], // Exclude E2E tests
    include: ["**/spec/**/*.spec.{js,ts,tsx}"], // Include unit tests in spec folders
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage/unit",
      reporter: ["text", "html", "lcov", "json"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.spec.{ts,tsx}",
        "src/**/spec/**",
        "src/test/**",
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
