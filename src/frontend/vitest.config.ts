import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"

const dependencyPath = (name: string) => fileURLToPath(new URL(`./node_modules/${name}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "axios", replacement: dependencyPath("axios") },
      { find: "react-dom", replacement: dependencyPath("react-dom") },
      { find: "react-router-dom", replacement: dependencyPath("react-router-dom") },
      { find: "react-helmet-async", replacement: dependencyPath("react-helmet-async") },
      { find: "react", replacement: dependencyPath("react") },
      {
        find: /^@testing-library\/(.*)$/,
        replacement: `${dependencyPath("@testing-library")}/$1`,
      },
    ],
  },
  server: {
    fs: {
      allow: ["../.."],
    },
  },
  test: {
    environment: "jsdom",
    include: ["../../tests/frontend/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    pool: "threads",
    maxThreads: 1,
    minThreads: 1,
    fileParallelism: false,
    forceExit: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
  },
})

