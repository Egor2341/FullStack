import { describe, expect, it, vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ExpencesPage } from "./index"
import { renderWithProviders } from "../../test/test-utils"

vi.mock("../../api/itemService", () => ({
  default: {
    getItems: vi.fn(),
    getCategories: vi.fn(),
    getSearch: vi.fn(),
    addItem: vi.fn(),
    editItem: vi.fn(),
    deleteItem: vi.fn(),
  },
}))

import itemService from "../../api/itemService"

describe("ExpencesPage", () => {
  it("shows loading then renders page data", async () => {
    vi.mocked(itemService.getItems).mockResolvedValueOnce({ total: "123", items: [{ name: "Еда", value: "10.00" }] })
    vi.mocked(itemService.getCategories).mockResolvedValueOnce({ categories: ["Еда", "Транспорт"] })

    renderWithProviders(<ExpencesPage />)

    expect(screen.getByText("Загрузка...")).toBeInTheDocument()
    expect(await screen.findByRole("heading", { name: "Расходы" })).toBeInTheDocument()
    expect(screen.getByText("123")).toBeInTheDocument()
    expect(screen.getAllByText("Еда").length).toBeGreaterThan(0)
  })

  it("renders a fatal load error when API fails", async () => {
    vi.mocked(itemService.getItems).mockRejectedValueOnce(new Error("500"))

    renderWithProviders(<ExpencesPage />)

    expect(await screen.findByText("Не удалось загрузить страницу")).toBeInTheDocument()
  })

  it("shows search error when search request fails", async () => {
    const user = userEvent.setup()
    vi.mocked(itemService.getItems).mockResolvedValueOnce({ total: "0", items: [] })
    vi.mocked(itemService.getCategories).mockResolvedValueOnce({ categories: ["Еда"] })
    vi.mocked(itemService.getSearch).mockRejectedValueOnce(new Error("500"))

    renderWithProviders(<ExpencesPage />)
    await screen.findByRole("heading", { name: "Расходы" })

    await user.click(screen.getByRole("button", { name: "Найти" }))

    expect(await screen.findByText("Поиск не удался")).toBeInTheDocument()
  })
})

