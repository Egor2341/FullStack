import { describe, expect, it, vi, beforeEach } from "vitest"
import { renderWithProviders } from "../../test/test-utils"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

vi.mock("../../api/authService", () => ({
  default: {
    login: vi.fn(),
    hasRole: vi.fn(),
  },
}))

import authService from "../../api/authService"
import { LoginPage } from "./index"

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(authService.login).mockReset()
    vi.mocked(authService.hasRole).mockReset()
    window.location.href = "http://localhost/welcome"
  })

  it("shows validation error when password is empty", async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { route: "/login" })

    await user.type(screen.getByLabelText("Email"), "a@b.ru")
    await user.click(screen.getByRole("button", { name: "Войти" }))

    expect(screen.getByText("Пароль не может быть пустым")).toBeInTheDocument()
    expect(authService.login).not.toHaveBeenCalled()
  })

  it("shows 'Неверные данные' on 422 error", async () => {
    const user = userEvent.setup()
    vi.mocked(authService.login).mockRejectedValueOnce(new Error("Request failed with status code 422"))

    renderWithProviders(<LoginPage />, { route: "/login" })

    await user.type(screen.getByLabelText("Email"), "a@b.ru")
    await user.type(screen.getByLabelText("Пароль"), "bad")
    await user.click(screen.getByRole("button", { name: "Войти" }))

    expect(await screen.findByText("Неверные данные")).toBeInTheDocument()
  })

  it("redirects admin to /admin/main after login", async () => {
    const user = userEvent.setup()
    vi.mocked(authService.login).mockResolvedValueOnce({ access_token: "a", refresh_token: "r", token_type: "bearer" })

    vi.mocked(authService.hasRole).mockReturnValueOnce(true)
    renderWithProviders(<LoginPage />, { route: "/login" })
    await user.type(screen.getByLabelText("Email"), "admin@b.ru")
    await user.type(screen.getByLabelText("Пароль"), "ok")
    await user.click(screen.getByRole("button", { name: "Войти" }))
    await waitFor(() => expect(window.location.href).toContain("/admin/main"))
  })

  it("redirects user to /main after login", async () => {
    const user = userEvent.setup()
    vi.mocked(authService.login).mockResolvedValueOnce({ access_token: "a", refresh_token: "r", token_type: "bearer" })
    vi.mocked(authService.hasRole).mockReturnValueOnce(false)
    renderWithProviders(<LoginPage />, { route: "/login" })
    await user.type(screen.getByLabelText("Email"), "user@b.ru")
    await user.type(screen.getByLabelText("Пароль"), "ok")
    await user.click(screen.getByRole("button", { name: "Войти" }))
    await waitFor(() => expect(window.location.href).toContain("/main"))
  })
})

