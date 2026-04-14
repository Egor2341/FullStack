import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
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

