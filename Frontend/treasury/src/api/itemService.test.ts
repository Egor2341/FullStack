import { describe, expect, it, vi } from "vitest"

const axiosInstance = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}))

vi.mock("./axiosInstance", () => ({ default: axiosInstance }))

import itemService from "./itemService"

describe("itemService", () => {
  it("getItems sends paging params", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { total: "0", items: [] } })

    const res = await itemService.getItems("/expenses", 2, false)

    expect(axiosInstance.get).toHaveBeenCalledWith("/expenses", { params: { page: 2, order: false } })
    expect(res).toEqual({ total: "0", items: [] })
  })

  it("addItem converts value to number with parseFloat", async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: null })

    await itemService.addItem("/expenses", { name: "Транспорт", value: "10.20" })

    expect(axiosInstance.post).toHaveBeenCalledWith("/expenses", { name: "Транспорт", value: 10.2 })
  })
})

