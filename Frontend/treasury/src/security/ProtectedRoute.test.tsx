import { describe, expect, it, vi } from "vitest"
import { Route, Routes, MemoryRouter } from "react-router-dom"
import { render, screen } from "@testing-library/react"

vi.mock("../api/authService", () => ({
  default: {
    hasRole: vi.fn(),
  },
}))

import authService from "../api/authService"
import ProtectedRoute from "./ProtectedRoute"

describe("ProtectedRoute", () => {
  it("redirects to /welcome when there is no token", () => {
    localStorage.removeItem("accessToken")

    render(
      <MemoryRouter initialEntries={["/main"]}>
        <Routes>
          <Route path="/welcome" element={<div>WELCOME</div>} />
          <Route
            path="/main"
            element={
              <ProtectedRoute roles={["user"]}>
                <div>MAIN</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText("WELCOME")).toBeInTheDocument()
  })

  it("redirects to /forbidden when token exists but role is missing", () => {
    localStorage.setItem("accessToken", "token")
    vi.mocked(authService.hasRole).mockReturnValue(false)

    render(
      <MemoryRouter initialEntries={["/admin/main"]}>
        <Routes>
          <Route path="/forbidden" element={<div>FORBIDDEN</div>} />
          <Route
            path="/admin/main"
            element={
              <ProtectedRoute roles={["admin"]}>
                <div>ADMIN</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText("FORBIDDEN")).toBeInTheDocument()
  })

  it("renders children when token exists and role matches", () => {
    localStorage.setItem("accessToken", "token")
    vi.mocked(authService.hasRole).mockReturnValue(true)

    render(
      <MemoryRouter initialEntries={["/main"]}>
        <Routes>
          <Route
            path="/main"
            element={
              <ProtectedRoute roles={["user"]}>
                <div>MAIN</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText("MAIN")).toBeInTheDocument()
  })
})

