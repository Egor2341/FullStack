import "@testing-library/jest-dom/vitest"
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

// JSDOM throws "Not implemented: navigation to another Document"
// when code assigns to window.location.href. We replace location with
// a lightweight stub so redirect logic stays testable.
const locationState = { href: "http://localhost:3000/" }
Object.defineProperty(window, "location", {
  value: {
    get href() {
      return locationState.href
    },
    set href(next: string) {
      locationState.href = next
    },
  },
  writable: true,
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

